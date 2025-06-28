from fastapi import APIRouter

from app.schemas.response.generics import HealthCheckOut
from app.api.v1.endpoints.auth import router as auth_router

v1 = APIRouter(prefix="/api/v1", tags=["root"])


@v1.get("/health", response_model=HealthCheckOut)
def root():
    return {"health": "world"}


v1.include_router(router=auth_router)
