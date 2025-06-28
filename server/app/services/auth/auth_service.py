import logging
from datetime import timedelta

from fastapi import HTTPException, status
from mailers import Email, Mailer
from passlib.context import CryptContext
from pydantic import UUID4, EmailStr
from sqlalchemy.exc import IntegrityError

from app.core.config.config import SMTP_CONNECTION_STRING
from app.core.security.jwt_handler import (
    SECRET_KEY,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.core.security.password import verify_password
from app.models.database.user_model import User
from app.repositories.implementations.user_repository import (
    PasswordRepository,
    UserRepository,
)
from app.schemas.request.auth_request import UserRegistrationIn

logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def authenticate_user(self, email: EmailStr, password: str) -> User:
        user = await self.user_repository.get_by_email(email)
        if user:
            hashed_pwd = str(user.hashed_password)
            if not verify_password(password, hashed_pwd):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="email or password doesn't match",
                )
            return user

        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="no user found",
            )

    async def login(self, email: str, password: str) -> dict[str, str] | None:
        user = await self.authenticate_user(email, password)

        access_token = create_access_token(
            data={
                "email": user.email,
                "role": user.role,
            },
            expires_delta=timedelta(days=7),
        )
        refresh_token = create_refresh_token(
            data={
                "email": user.email,
                "role": user.role,
            },
            expires_delta=timedelta(days=14),
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }

    def refresh(self, refresh_token: str) -> str | None:
        try:
            payload = decode_token(refresh_token, secret=SECRET_KEY)  # type:ignore
            email = payload.get("email")
            role = payload.get("role")
            if email is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="",
                )
            return create_access_token(
                data={"email": email, "role": role}, expires_delta=timedelta(minutes=30)
            )
        except Exception:
            return None

    async def register(self, user_data: UserRegistrationIn):
        try:
            user = await self.user_repository.create(user_data)
            return user

        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="server",
            )
        except Exception as _:
            import traceback

            logger.error(f"{str(traceback.format_exc())}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="some error occoured",
            )

    async def get_current_user(self, token: str) -> User | None:
        try:
            payload = decode_token(token=token, secret=SECRET_KEY)  # type: ignore
            email = payload.get("email")
            if email is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token: email missing",
                )
            user = await self.user_repository.get_by_email(email)
            if user is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found",
                )
            return user

        except jwt.InvalidKeyError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate token",
            )


class PasswordService:
    def __init__(self, password_repository: PasswordRepository):
        self.password_repository = password_repository

    async def reset_token(self, email: EmailStr):
        token = await self.password_repository.create_reset_token(email=email)

        if token:
            text = f"""
            Reset Token 
            https://localhost:3000/reset-password?token={token.token}
            """

            html = f"""
            Reset Token 
            https://localhost:3000/reset-password?token={token.token}
            """

            message = Email(
                to=email, from_address="login@ath.com", text=text, html=html
            )
            mailer = Mailer(SMTP_CONNECTION_STRING)  # type:ignore
            await mailer.send(message)

            return {"message": "successfully sent"}

        return None

    async def reset_passsword(self, token: UUID4, password: str):
        validate_token = await self.password_repository.validate_token(token=token)
        if validate_token:
            password_changed = await self.password_repository.reset_password(
                password=password,
                token=token,
            )
            if password_changed:
                return True
            else:
                return False
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    async def update_password(self, user_id, current_password, new_password):
        updated = await self.password_repository.update_password(
            user_id=user_id,
            new_password=new_password,
            current_password=current_password,
        )

        if not updated:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
