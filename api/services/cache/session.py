import logging

from aioredis import ConnectionPool, Redis

async def get_redis() -> ConnectionPool:
    try:
        cp = ConnectionPool.from_url(url='redis://localhost:6379', decode_responses=True)
        logging.warning('Redis connection established.')
        yield cp
    finally:
        logging.warning('Redis connection closed.')