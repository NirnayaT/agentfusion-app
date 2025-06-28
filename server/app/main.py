from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter

from app.api.v1.routers import v1
from app.core.config.database import sessionmanager

from redis.asyncio import Redis
from app.core.config.config import REDIS_URL


redis = Redis()


@asynccontextmanager
async def lifespan(app: FastAPI):
    sessionmanager.init_db()
    redis_connection = redis.from_url(
        REDIS_URL,
        encoding="utf-8",
        decode_responses=True,
    )
    await FastAPILimiter.init(redis_connection)
    yield


app = FastAPI(
    title="Agent Fusion API",
    version="1.0.0",
    # docs_url="/api/v1/docs/",
    lifespan=lifespan,
)


@app.exception_handler(500)
async def internal_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content=jsonable_encoder({"code": 500, "msg": "Internal Server Error"}),
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1)
