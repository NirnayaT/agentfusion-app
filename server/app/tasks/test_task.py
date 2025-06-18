from ..celery_worker import celery
from app.core.config.database import sessionmanager
from app.models.database.user_model import User
import asyncio
from sqlalchemy import select
import logging


logger = logging.getLogger("__name__")


@celery.task()
def user_task():
    """Celery task wrapper for async database operation"""
    return asyncio.run(hello_async())


async def hello_async():
    """Async function to fetch users from database"""
    try:
        sessionmanager.init_db()

        async for session in sessionmanager.get_session():
            logger.info("Fetching users from database")

            try:
                result = await session.execute(select(User))
                users = result.scalars().all()
                user_data = [{"email": user.email} for user in users]
                logger.info(f"Returning user data: {user_data}")

                return user_data

            except Exception as e:
                logger.error(f"Database query error: {e}")
                await session.rollback()
                raise

    except Exception as e:
        print(e)
        logger.error(f"Database connection error: {e}")
        raise RuntimeError(f"Failed to fetch users: {e}")
