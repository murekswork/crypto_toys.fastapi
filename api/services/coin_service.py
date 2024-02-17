import json

import aioredis
from fastapi import Depends, HTTPException

from api.db.cache.session import get_redis
from api.repositories.cache_repo import CacheRepository
from api.repositories.coin_parse_repo import CoinParseRepository
from api.schemas.coin_schemas import CoinSchema
from api.schemas.response_schemas import CurrencySchema


class BaseService:
    pass


class ApiService(BaseService):

    def __init__(
            self,
            redis_cp: aioredis.ConnectionPool = Depends(get_redis)) -> None:
        self.cache_repo = CacheRepository(redis_cp)
        self.parse_repo = CoinParseRepository()

    async def get_full_market_data(self, currency: str) -> list[CoinSchema]:
        try:
            CurrencySchema(currency=currency)
        except Exception as e:
            raise HTTPException(
                status_code=403,
                detail=f'invalid currency input! {e}'
            )
        # firstly look for saved data in cache
        cached = await self.cache_repo.get(f'coin1000{currency}')
        if cached is not None:
            return [CoinSchema.model_validate(coin) for coin in
                    json.loads(cached)]

        parsed_market_data = await self.parse_repo.parse_full_market_data(currency)

        await self.cache_repo.set(f'coin1000{currency}', parsed_market_data)

        # save each coin in jsoned data to cache
        coins_schemas = [CoinSchema(**coin) for coin in
                         json.loads(parsed_market_data)]

        for coin in coins_schemas:
            await self.cache_repo.set(f'{coin.id}_' + currency,
                                      coin.model_dump_json())
        return coins_schemas

    async def get_explicit_coin(self, currency: str,
                                coin_id: int) -> CoinSchema:
        # firstly check if requested coin exists in cache
        cached = await self.cache_repo.get(f'{coin_id}_{currency}')
        if cached is not None:
            return CoinSchema.model_validate_json(cached)

        raise HTTPException(
            status_code=404,
            detail='could not find selected coin'
        )

    async def get_explicit_coin_chart(self,
                                      coin_id: int,
                                      timestamp: str) -> list[dict]:
        cached = await self.cache_repo.get(f'{coin_id}_{timestamp}_chart')
        if cached is not None:
            return json.loads(cached)

        parse_data = await self.parse_repo.parse_coin_chart(coin_id, timestamp)
        await self.cache_repo.set_coin_chart_cache(coin_id, timestamp, parse_data)

        return [value for value in json.loads(parse_data)]

    async def get_market_data_with_skip(self, skip: int, limit: int,
                                        currency: str) -> list[CoinSchema]:
        if (skip + limit) > 1000 or (skip + limit) < 0:
            raise HTTPException(status_code=403, detail='invalid skip or limit!')
        try:
            CurrencySchema(currency=currency)
        except Exception as e:
            raise HTTPException(
                status_code=403,
                detail=f'invalid currency input! {e}'
            )
        cached = await self.cache_repo.get(f'coin1000{currency}')
        # TODO: CREATE DATA MAPPER FROM CACHE TO SERVICE
        if cached is not None:
            cached_dict = json.loads(cached)  # type : ignore
            result = []
            for i in range(skip, skip + limit):  # type: ignore
                result.append(CoinSchema(**cached_dict[i]))  # type : ignore
            return result
        else:

            try:
                await self.get_full_market_data(currency=currency)
                return await self.get_market_data_with_skip(skip, limit, currency)
            except Exception as e:

                raise HTTPException(
                    status_code=404,
                    detail=f'temp probs try again later! {e}'
                )
