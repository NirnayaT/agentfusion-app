import logging
import uuid
from datetime import datetime, timedelta
from typing import override

from pydantic import UUID4
from sqlalchemy import cast, delete, exists, select
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security.password import hash_password
from app.models.database.user_model import (
    PasswordReset as PasswordResetORM,
)
from app.models.database.user_model import (
    User as UserORM,
)
from app.repositories.interfaces.user_repository_interface import IUserRepository
from app.schemas.request.auth_request import UserRegistrationIn

logger = logging.getLogger(__name__)


class UserRepository(IUserRepository):
    def __init__(self, db: AsyncSession):
        self.db = db

    @override
    async def get_by_id(self, id: UUID4):
        stmt = select(UserORM).where(UserORM.id == id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    @override
    async def get_by_email(self, email: str) -> UserORM | None:
        """returns a User Object or None

        Args:
            email (str): _description_

        Returns:
            UserORM | None: _description_
        """

        stmt = select(UserORM).where(UserORM.email == email)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    @override
    async def create(self, data: UserRegistrationIn) -> UserORM | None:
        """creates a new user in the database

        Args:
            data (UserRegistrationIn): _description_

        Returns:
            UserORM | None: _description_
        """
        try:
            new_data = {**data.model_dump()}
            hashed_password = hash_password(new_data.pop("password"))
            new_user = UserORM(**new_data, hashed_password=hashed_password)
            self.db.add(new_user)
            await self.db.commit()
            await self.db.refresh(new_user)
            return new_user

        except IntegrityError:
            await self.db.rollback()
            raise

        except Exception:
            import traceback

            logger.error(str(traceback.format_exc()))
            await self.db.rollback()
            raise

    @override
    async def update(self, data) -> UserORM | None: ...

    @override
    async def delete(self, id: int) -> None: ...


class PasswordRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_reset_token(self, email: str) -> "PasswordResetORM | None":
        user = await UserRepository(db=self.db).get_by_email(email=email)
        if not user:
            return None

        await self.db.execute(
            delete(PasswordResetORM).where(PasswordResetORM.user_id == user.id)
        )

        token = str(uuid.uuid4())
        print(token)
        expires_at = datetime.now() + timedelta(hours=1)
        reset_entry = PasswordResetORM(
            user_id=cast(user.id, UUID),
            token=str(token),
            expires_at=expires_at,
        )
        self.db.add(reset_entry)
        await self.db.commit()
        await self.db.refresh(reset_entry)
        return reset_entry

    async def validate_token(self, token: UUID4):
        time = datetime.now()
        stmt = select(
            exists().where(
                PasswordResetORM.token == token,
                PasswordResetORM.expires_at >= time,
            )
        )
        result: bool | None = await self.db.scalar(stmt)
        return result if isinstance(result, bool) else False

    async def change_password(self, password, token):
        user = await self.get_user_by_token(token)  # Add 'await' here
        if user:
            user.hashed_password = hash_password(password)  # type:ignore
            self.db.add(user)
            await self.db.commit()
            return True

        return False

    async def get_user_by_token(self, token: str):
        stmt = select(PasswordResetORM).where(PasswordResetORM.token == token)
        result = await self.db.execute(stmt)
        password_reset_obj = result.scalar_one_or_none()

        if not password_reset_obj:
            return None

        user_repo = UserRepository(self.db)
        user = await user_repo.get_by_id(id=password_reset_obj.user_id)  # type:ignore

        await self.db.delete(password_reset_obj)
        await self.db.commit()

        return user
