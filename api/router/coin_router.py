from typing import Literal

from fastapi import APIRouter, Depends

from api.schemas.coin_schemas import CoinSchema
from api.services.coin_service import ApiService

coin_router = APIRouter(tags=['Coin Api Router'])


@coin_router.get(
  '/market_data/{currency}',
  response_model=list[CoinSchema],
  description='Api parses huge json file from cryptobubbles site'
)
async def market_data(
        currency: Literal['usd', 'rub', 'eur'],
        service: ApiService = Depends()
) -> list[CoinSchema]:
    data = await service.get_full_market_data(currency)
    return data


@coin_router.get('/coins/{coin_id}/{currency}', response_model=CoinSchema)
async def coin_data(
        currency: Literal['usd', 'rub', 'eur'],
        coin_id: str,
        service: ApiService = Depends()
) -> CoinSchema:
    data = await service.get_explicit_coin(currency=currency, coin_id=coin_id)
    return data


@coin_router.get('/market_data/{currency}/', response_model=list[CoinSchema])
async def market_data_with_skip(
        currency: Literal['usd', 'rub', 'eur'] = 'usd',
        skip: int = 0,
        limit: int = 100,
        service: ApiService = Depends()
) -> list[CoinSchema]:

    data = await service.get_market_data_with_skip(skip=skip,
                                                   limit=limit,
                                                   currency=currency)
    return data


@coin_router.get('/charts/')
async def coin_chart_data(
        coin_id: str,
        timestamp: Literal['day', 'week', 'month', 'hour', 'year'] = 'day',
        service: ApiService = Depends()
) -> list[dict]:
    data = await service.get_explicit_coin_chart(coin_id, timestamp)
    return data
