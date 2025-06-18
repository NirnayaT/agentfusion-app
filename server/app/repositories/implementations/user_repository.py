import logging
from typing import override

from app.models.database.user_model import User as UserORM
from app.repositories.interfaces.user_repository_interface import IUserRepository
from app.schemas.request.auth_request import UserRegistrationIn
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.security.password import hash_password

logger = logging.getLogger(__name__)


class UserRepository(IUserRepository):
    def __init__(self, db: AsyncSession):
        self.db = db

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
