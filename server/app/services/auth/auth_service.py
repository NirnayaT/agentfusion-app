from datetime import timedelta

from app.core.security.jwt_handler import (
    SECRET_KEY,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.core.security.password import verify_password
from app.models.database.user_model import User
from app.repositories.interfaces.user_repository_interface import IUserRepository
from app.repositories.implementations.user_repository import UserRepository
from passlib.context import CryptContext
from pydantic import EmailStr
from fastapi import HTTPException
from fastapi import status
import jwt
from sqlalchemy.exc import IntegrityError
from app.schemas.request.auth_request import UserRegistrationIn

import logging


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
