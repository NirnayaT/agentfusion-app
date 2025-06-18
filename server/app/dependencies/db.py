from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    AsyncSession,
)

from app.core.config.database import sessionmanager


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Database dependency function.

    Usage in FastAPI:
        @app.get("/users/")
        async def get_users(db: AsyncSession = Depends(get_db)):
            # Your database operations here
            pass

    Usage in general async code:
        async for db in get_db():
            # Your database operations here
            pass
    """
    async for session in sessionmanager.get_session():
        yield session
