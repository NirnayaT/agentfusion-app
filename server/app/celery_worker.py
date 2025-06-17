from celery import Celery
from celery.schedules import crontab
from .core.config.config import REDIS_URL

# Initialize Celery instance
celery = Celery(
    "worker",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["app.tasks"],
)

# # Set Celery configuration
celery.conf.update(
    {
        "beat_scheduler": "celery_sqlalchemy_scheduler.schedulers:DatabaseScheduler",
    }
)

celery.conf.beat_schedule = {
    "hello_task": {
        "task": "app.tasks.test_task.user_task",
        "schedule": crontab(minute="*/1"),
    }
}
