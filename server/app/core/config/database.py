from typing import AsyncGenerator, Optional
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import declarative_base
from sqlalchemy.pool import AsyncAdaptedQueuePool
from . import config


class SessionManager:
    """Manages asynchronous DB sessions with connection pooling."""

    def __init__(self) -> None:
        self.engine: Optional[AsyncEngine] = None
        self.session_factory: Optional[async_sessionmaker[AsyncSession]] = None

    def init_db(self) -> None:
        """Initialize the database engine and session factory."""
        database_url = (
            f"postgresql+asyncpg://{config.DB_USER}:{config.DB_PASSWORD}"
            f"@{config.DB_HOST}:{config.DB_PORT}/{config.DB_NAME}"
        )

        self.engine = create_async_engine(
            database_url,
            poolclass=AsyncAdaptedQueuePool,
            pool_size=config.DB_POOL_SIZE,
            max_overflow=config.MAX_OVERFLOW,
            pool_pre_ping=True,
            pool_recycle=config.POOL_RECYCLE,
            echo=True,
        )

        self.session_factory = async_sessionmaker(
            self.engine,
            expire_on_commit=False,
            autoflush=False,
            class_=AsyncSession,
        )

    async def close(self) -> None:
        """Dispose of the database engine."""
        if self.engine:
            await self.engine.dispose()

    async def get_session(self) -> AsyncGenerator[AsyncSession, None]:
        """Yield a database session with the correct schema set."""
        if not self.session_factory:
            raise RuntimeError("Database session factory is not initialized.")

        async with self.session_factory() as session:
            try:
                yield session
            except Exception as e:
                await session.rollback()
                raise RuntimeError(f"Database session error: {e!r}") from e


# Global instances
sessionmanager = SessionManager()
Base = declarative_base()

