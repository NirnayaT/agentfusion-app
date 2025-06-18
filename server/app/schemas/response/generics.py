from pydantic import BaseModel


class MessageOut(BaseModel):
    message: str
    status: bool


class HealthCheckOut(BaseModel):
    health: str
