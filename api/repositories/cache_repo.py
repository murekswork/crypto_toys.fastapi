import logging

import aioredis
from aioredis import Redis
from fastapi import HTTPException


class CacheRepository:

    def __init__(self, redis_cp: aioredis.ConnectionPool):
        self.cache = Redis(connection_pool=redis_cp)

    async def set(self, key: str, value: str):
        try:
            await self.cache.set(key, value)
            logging.warning(f'Setting key {key} to {value}')
        except Exception as e:
            raise HTTPException(status_code=500,
                                detail=f'Cache database connection error! {e}')

    async def get(self, key: str) -> str | None:
        try:
            logging.warning(f'Looking for {key} in cache...')
            cached = await self.cache.get(key)
            if cached is not None:
                logging.warning('Found cached value!')
                return cached
            logging.warning('Cache does not exists!')
            logging.warning(cached)
            return None
        except Exception as e:
            raise HTTPException(status_code=500,
                                detail=f'Cache database connection error! {e}')

    async def set_coin_chart_cache(self,
                                   coin_id: str,
                                   timestamp: str,
                                   value: str) -> None:

        try:
            await self.cache.set(f'{coin_id}/chart_cache/{timestamp}',
                                 value, ex=60)
        except Exception as e:
            raise HTTPException(status_code=500,
                                detail=f'Could not set chart cache for {coin_id}! {e}')