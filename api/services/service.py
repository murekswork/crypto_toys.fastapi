import aioredis

from api.services.cache.session import get_redis
from api.services.cache.cache_service import CacheService
from api.schemas.response_schemas import CurrencySchema
from api.schemas.coin_schemas import CoinSchema
from fastapi import HTTPException

import requests
from typing import List, Annotated
from fastapi import Depends
import json


class BaseService:
    pass


class ApiService(BaseService):

    def __init__(self, redis_cp: aioredis.ConnectionPool) -> None:
        self.cache_manager = CacheService(redis_cp)

    async def get_full_market_data(self, currency: str) -> List[CoinSchema]:
        try:
            CurrencySchema(currency=currency)
        except:
            raise HTTPException(
                status_code=403,
                detail='invalid currency input'
            )
        # firstly look for saved data in cache
        cached = await self.cache_manager.get(f'coin1000{currency}')
        if cached is not None:
            return [CoinSchema.model_validate(coin) for coin in json.loads(cached)]

        # if requested data does not exist in cache then make request to api
        response = requests.get(f'https://cryptobubbles.net/backend/data/bubbles1000.{currency}.json')
        if response.status_code != 200:
            raise HTTPException(
                status_code=424,
                detail='could not fetch data'
            )
        # save response data to cache
        data = response.json()
        await self.cache_manager.set(f'coin1000{currency}', json.dumps(data))

        # save each coin in jsoned data to cache    
        coins_schemas = [CoinSchema(**coin) for coin in json.loads(json.dumps(data))]
        for coin in coins_schemas:
            await self.cache_manager.set(f"{coin.id}_" + currency, coin.model_dump_json())

        return coins_schemas

    async def get_explicit_coin(self, currency: str, coin_id: str) -> CoinSchema:
        try:
            CurrencySchema(currency=currency)
        except:
            raise HTTPException(
                status_code=403,
                detail='invalid currency input'
            )
        # firstly check if requested coin exists in cache
        cached = await self.cache_manager.get(f"{coin_id}_{currency}")
        if cached is not None:
            return CoinSchema.model_validate_json(cached)

        raise HTTPException(
            status_code=404,
            detail='could not found selected coin'
        )

    async def get_explicit_coin_chart(self, coin_id: str, timestamp: str) -> list[dict]:
        cached = await self.cache_manager.get(f"{coin_id}_{timestamp}_chart")
        if cached is not None:
            return json.loads(cached)

        response = requests.get(f'https://cryptobubbles.net/backend/data/charts/{timestamp}/{coin_id}/USD.json')
        if response.status_code != 200:
            raise HTTPException(
                status_code=424,
                detail='could not fetch data from third side!'
            )
        data = response.json()
        await self.cache_manager.set(f"{coin_id}_{timestamp}_chart", json.dumps(data))

        return [value for value in data]

    async def get_market_data_with_skip(self, skip: int, limit: int, currency: str) -> List[CoinSchema]:
        if not 0 <= skip <= 999 or not 0 <= limit <= 100 or not (skip + limit) <= 1000:
            raise HTTPException(
                status_code=403,
                detail='skip value must be between 0 and 999 '
                       'and limit must be between 0 and 100.'
                       'also skip + limit must be lower than or equal to 1000'
            )
        try:
            CurrencySchema(currency=currency)
        except:
            raise HTTPException(
                status_code=403,
                detail='invalid currency input'
            )
        cached = await self.cache_manager.get(f"coin1000{currency}")
        if cached is not None:
            cached = json.loads(cached)
            result = []
            for i in range(skip, skip+limit):
                result.append(CoinSchema(**cached[i]))
            return result

        raise HTTPException(
            status_code=404,
            detail='could not find selected coin'
        )

