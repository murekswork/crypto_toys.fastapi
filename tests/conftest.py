import logging
from typing import AsyncGenerator

import aioredis
import pytest
from httpx import AsyncClient

from main import create_app


@pytest.fixture(scope='session')
async def client():

    async with AsyncClient(app=create_app(_test=True), base_url='http://localhost:8000/api/v1') as client:
        yield client


@pytest.fixture(scope='session')
async def clean_cache(redis_client: aioredis.Redis):
    await redis_client.flushdb()


async def get_redis():
    try:
        logging.warning('Getting redis session...')
        redis = aioredis.ConnectionPool.from_url(
            url='redis://localhost:6379', decode_responses=True
        )
        logging.warning('Redis connection pool opened successfully :)')
        return redis
    finally:
        logging.warning('Redis connection closed!')


@pytest.fixture(scope='session')
async def redis_client() -> AsyncGenerator[aioredis.Redis, None]:
    async with aioredis.Redis(connection_pool=await get_redis()) as redis:
        yield redis
