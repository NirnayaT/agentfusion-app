from sqlalchemy import Column, String
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
