from abc import ABC, abstractmethod
from app.models.database.user_model import User as UserORM
from pydantic import EmailStr, UUID4


class IUserRepository(ABC):
    @abstractmethod
    async def get_by_email(self, email: EmailStr) -> UserORM | None:
        raise NotImplementedError()

    @abstractmethod
    async def create(self, data) -> UserORM | None:
        raise NotImplementedError()

    @abstractmethod
    async def update(self, data) -> UserORM | None:
        raise NotImplementedError()

    @abstractmethod
    async def delete(self, id: int) -> None:
        raise NotImplementedError()

    @abstractmethod
    async def get_by_id(self, id: UUID4):
        raise NotImplementedError()
