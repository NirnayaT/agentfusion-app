from pydantic import BaseModel, EmailStr, field_validator, UUID4
from app.models.database.user_model import UserRolesEnum


class UserLoginIn(BaseModel):
    email: EmailStr
    password: str


class RefreshRequestIn(BaseModel):
    refresh_token: str


class UserRegistrationIn(BaseModel):
    password: str
    email: str
    first_name: str
    last_name: str
    role: str

    @field_validator("role")
    @classmethod
    def validate_role(cls, value: str) -> str:
        if value not in UserRolesEnum:
            raise ValueError("invalid roles assigned")
        return value


class PasswordResetRequestIn(BaseModel):
    email: EmailStr


class PasswordResetConfirmIn(BaseModel):
    token: UUID4
    password: str
    
