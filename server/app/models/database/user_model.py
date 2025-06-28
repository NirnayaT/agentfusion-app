from sqlalchemy import Column, String, ForeignKey, DateTime, UUID
from .shared_models import BaseModel
from enum import Enum


class UserRolesEnum(str, Enum):
    AGENT = "agent"
    USER = "user"


class User(BaseModel):
    __tablename__ = "users"

    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String)
    role = Column(String)


class PasswordReset(BaseModel):
    __tablename__ = "password_reset"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    token = Column(UUID(as_uuid=True), unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
