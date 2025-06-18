from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.routers import v1
from app.core.config.database import sessionmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    sessionmanager.init_db()
    yield


app = FastAPI(
    title="Agent Fusion API",
    version="1.0.0",
    docs_url="/api/v1/docs/",
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
