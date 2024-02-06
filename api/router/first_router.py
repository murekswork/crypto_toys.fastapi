import json
from typing import List, Literal

import aioredis
from fastapi import APIRouter, Depends, Path, HTTPException
from starlette.responses import JSONResponse

from api.auth.session import SessionManager, FollowListSchema
from api.schemas.coin_schemas import CoinSchema
from api.schemas.follow_lists import FollowList
from api.services.service import ApiService
from api.services.cache.session import get_redis
from fastapi import Request

parsing_router = APIRouter()



@parsing_router.get("/market_data/{currency}", response_model=List[CoinSchema])
async def market_data(
        currency: str,
        redis_cp: aioredis.ConnectionPool = Depends(get_redis)
) -> List[CoinSchema]:
    service = ApiService(redis_cp)
    data = await service.get_full_market_data(currency)
    return data


@parsing_router.get("/coins/{coin_id}/{currency}", response_model=CoinSchema)
async def coin_data(
        currency: str,
        coin_id: str,
        redis_cp: aioredis.ConnectionPool = Depends(get_redis)
) -> CoinSchema:
    service = ApiService(redis_cp)
    data = await service.get_explicit_coin(currency=currency, coin_id=coin_id)
    return data


@parsing_router.get("/market_data/{currency}/", response_model=List[CoinSchema])
async def market_data_with_skip(
        currency: str = 'usd',
        skip: int = 0,
        limit: int = 100,
        redis_cp: aioredis.ConnectionPool = Depends(get_redis)
) -> List[CoinSchema]:

    service = ApiService(redis_cp)
    data = await service.get_market_data_with_skip(skip=skip,
                                                   limit=limit,
                                                   currency=currency)
    return data

@parsing_router.get("/charts/")
async def get_coin_chart_data(
        coin_id: str,
        timestamp: Literal["day", "week", "month"] = "day",
        redis_cp: aioredis.ConnectionPool = Depends(get_redis)
) -> list[dict]:
    service = ApiService(redis_cp)
    data = await service.get_explicit_coin_chart(coin_id, timestamp)
    return data

@parsing_router.get("/me/follow_lists", response_model=list[FollowListSchema])
async def get_follow_lists(
        request: Request
) -> list[FollowListSchema]:

    session_manager = SessionManager(request)
    follow_lists = await session_manager.get_follow_lists()
    if follow_lists is None:
        raise HTTPException(status_code=404, detail='You dont have any follow lists yet!')
    return follow_lists

@parsing_router.post("/me/follow_lists", response_model=FollowListSchema)
async def create_follow_list(request: Request, lst_name: str) -> FollowListSchema:
    session_manager = SessionManager(request)
    new_lst = await session_manager.create_follow_list(lst_name)
    return new_lst


@parsing_router.post("/me/follow_lists/{list_name}", response_model=FollowListSchema)
async def add_to_follow_list(request: Request, list_name: str, coin_id: int) -> FollowListSchema:
    session_manager = SessionManager(request)
    new_coin = await session_manager.add_to_follow_list(list_name, coin_id)
    return new_coin

@parsing_router.delete("/me/follow_lists/{list_name}")
async def delete_from_follow_list(request: Request, list_name: str, coin_id: int):
    session_manager = SessionManager(request)
    delete_coin = await session_manager.remove_from_follow_list(list_name, coin_id)
    return JSONResponse(content={'msg': 'deleted ' + str(coin_id) + ' from list' + list_name}, status_code=200)

# @parsing_router.post("me/follow_lists")
# async def create_follow_lists(
#         request: Request,
#         list_name: str,
# ) -> list[FollowList] | None:
#     await request_session.add_follow_list(list_name)
#     response = await request_session.get_follow_lists()
#     return response
