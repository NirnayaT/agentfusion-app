from pydantic import BaseModel


class TokenPairOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class RefreshTokenOut(BaseModel):
    access_token: str
    token_type: str


class UserOut(BaseModel):
    email: str
    first_name: str
    last_name: str
