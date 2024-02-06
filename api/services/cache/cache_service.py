import logging

import aioredis
from aioredis import Redis
from fastapi import HTTPException


class CacheService:

    def __init__(self, redis_cp: aioredis.ConnectionPool):
        self.cache = Redis(connection_pool=redis_cp)

    async def set(self, key: str, value: str):
        try:
            await self.cache.set(key, value)
            logging.warning('Setting key {} to {}'.format(key, value))
        except:
            raise HTTPException(status_code=500, detail='Cache database connection error!')

    async def get(self, key: str) -> str | None:
        try:
            logging.warning(f'Looking for {key} in cache...')
            cached = await self.cache.get(key)
            if cached is not None:
                logging.warning('Found cached value!')
                return cached
            logging.warning('Cache does not exists!')
            logging.warning(cached)
            return cached
        except:
            raise HTTPException(status_code=500, detail='Cache database connection error!')
