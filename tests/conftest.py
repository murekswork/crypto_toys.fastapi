import logging
import shutil
from typing import AsyncGenerator

import aioredis
import pytest
from fastapi import APIRouter, FastAPI
from httpx import AsyncClient
from starlette.staticfiles import StaticFiles

from api.pages.router import pages_router


@pytest.fixture(scope='session')
def static_dir(tmpdir_factory):
    static_dir = tmpdir_factory.mktemp('static')
    shutil.copytree('static', str(static_dir))
    return str(static_dir)


@pytest.fixture(scope='session')
def app(static_dir):
    app = FastAPI()
    router = APIRouter(prefix='/api/v1')
    router.include_router(pages_router)
    router.include_router(parsing_router)
    app.include_router(router)
    app.mount('/static', StaticFiles(directory=static_dir), name='static')
    return app


@pytest.fixture(scope='session')
async def client(app):
    async with AsyncClient(app=app, base_url='http://localhost:8000') as client:
        yield client


@pytest.fixture(scope='session')
async def clean_cache(redis_client: aioredis.Redis):
    await redis_client.flushdb()


async def _get_redis_cp() -> aioredis.ConnectionPool:
    try:
        redis_cp = aioredis.ConnectionPool.from_url(
            'redis://redis:6379', decode_responses=True
        )
        return redis_cp

    except Exception as e:
        logging.warning(e)


@pytest.fixture(scope='session')
async def redis_client() -> AsyncGenerator[aioredis.Redis, None]:
    async with aioredis.Redis(connection_pool=await _get_redis_cp()) as redis:
        yield redis
