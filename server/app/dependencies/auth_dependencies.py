import jwt
from app.core.config.config import SECRET_KEY
from app.core.security.jwt_handler import decode_token
from app.dependencies.db import get_db
from app.repositories.implementations.user_repository import (
    UserRepository,
    PasswordRepository,
)
from app.services.auth.auth_service import AuthService, PasswordService
from fastapi import Depends, HTTPException, status
from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
)
from sqlalchemy.ext.asyncio import AsyncSession


security = HTTPBearer()


def get_auth_service(db: AsyncSession = Depends(get_db)):
    return AuthService(UserRepository(db))


def get_password_service(db: AsyncSession = Depends(get_db)):
    return PasswordService(PasswordRepository(db))


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
):
    token = credentials.credentials
    try:
        payload = decode_token(token=token, secret=str(SECRET_KEY))
        user_email = payload.get("email")
        if user_email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: no email",
            )

        user = await UserRepository(db=db).get_by_email(email=user_email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )

        return user

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )


# async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         # FIX: this
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])  # type:ignore
#         username = payload.get("sub")
#         if username is None:
#             raise credentials_exception
#         token_data = TokenData(username=username)

#     except jwt.InvalidTokenError:
#         raise credentials_exception

#     user = get_user(fake_users_db, username=token_data.username)

#     if user is None:
#         raise credentials_exception

#     return user
