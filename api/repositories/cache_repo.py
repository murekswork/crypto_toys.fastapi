import logging

import aioredis
from fastapi import HTTPException


class CacheRepository:

    def __init__(self, redis_cp: aioredis.ConnectionPool):
        self.cache = aioredis.Redis(connection_pool=redis_cp)

    async def set(self, key: str, value: str):
        try:
            await self.cache.set(key, value)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f'Cache database connection error! {e}'
            )

    async def get(self, key: str) -> str | None:
        try:
            cached = await self.cache.get(key)
            if cached is not None:
                logging.warning('Found cached value!')
                return cached
            return None
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f'Cache database connection error! {e}'
            )

    async def set_coin_chart_cache(self,
                                   coin_id: int,
                                   timestamp: str,
                                   value: str) -> None:

        try:
            await self.cache.set(f'{coin_id}/chart_cache/{timestamp}',
                                 value, ex=60)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f'Could not set chart cache for {coin_id}! {e}'
            )
