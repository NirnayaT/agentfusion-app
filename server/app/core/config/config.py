from pathlib import Path
from decouple import Config, RepositoryEnv

BASE_URL = Path(__file__).resolve().parent.parent.parent.parent

env = Config(RepositoryEnv(Path(BASE_URL / ".env")))

CELERY_BEAT_URL = env("CELERY_BEAT_URL")

SQLALCHEMY_DATABASE_URL = env("SQLALCHEMY_DATABASE_URL", cast=str)
REDIS_URL = env("REDIS_URL", cast=str)

SECRET_KEY = env("SECRET_KEY", cast=str)
ALGORITHM = env("ALGORITHM", cast=str)

DB_NAME = env("DB_NAME", cast=str)
DB_USER = env("DB_USER", cast=str)
DB_PASSWORD = env("DB_PASSWORD", cast=str)
DB_PORT = env("DB_PORT", default=5432, cast=int)
DB_HOST = env("DB_HOST", cast=str)
DB_POOL_SIZE = env("DB_POOL_SIZE", cast=int)

MAX_OVERFLOW = env("MAX_OVERFLOW", cast=int)
POOL_RECYCLE = env("POOL_RECYCLE", cast=int)

DEBUG = env("DEBUG")
POSTGRES_SCHEMA = env("POSTGRES_SCHEMA", None)
