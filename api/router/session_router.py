from fastapi import APIRouter, HTTPException, Request

from api.schemas.follow_lists import (
    AddCoinToFollowListSchema,
    FollowListSchema,
    FollowListSchemaCreate,
)
from api.services.session_service import SessionService

session_router = APIRouter(tags=['Session Router'])


@session_router.get('/me/follow_lists', response_model=list[FollowListSchema])
async def get_follow_lists(
        request: Request,
) -> list[FollowListSchema]:
    session_service = SessionService(request)
    follow_lists = await session_service.get_follow_lists()
    if follow_lists is None:
        raise HTTPException(status_code=404,
                            detail='You dont have any follow lists yet!')
    return follow_lists


@session_router.post('/me/follow_lists', response_model=FollowListSchema)
async def create_follow_list(
        request: Request,
        list_name: FollowListSchemaCreate,
) -> FollowListSchema:
    service = SessionService(request)
    new_lst = await service.create_follow_list(list_name.name)
    return new_lst


@session_router.post('/me/follow_lists/{list_name}',
                     response_model=FollowListSchema)
async def add_to_follow_list(
        request: Request,
        list: AddCoinToFollowListSchema,
) -> FollowListSchema:
    service = SessionService(request)
    new_coin = await service.add_to_follow_list(list.list_name, list.coin_id)
    return new_coin


@session_router.delete('/me/follow_lists/{list_name}/{coin_id}',
                       response_model=FollowListSchema)
async def delete_from_follow_list(
        request: Request,
        list_name: str,
        coin_id: int,
) -> FollowListSchema:
    service = SessionService(request)
    delete_coin = await service.remove_from_follow_list(list_name, coin_id)
    return delete_coin


@session_router.get('/me/follow_lists/{list_name}',
                    response_model=FollowListSchema)
async def get_follow_list(
        list_name: str,
        request: Request) -> FollowListSchema:
    service = SessionService(request)
    requested_list = await service.get_follow_list(list_name)
    return requested_list


@session_router.delete('/me/follow_lists/{list_name}',
                       response_model=list[FollowListSchema])
async def delete_follow_list(
        request: Request,
        list_name: str,
) -> list[FollowListSchema]:
    service = SessionService(request)
    result = await service.delete_follow_list(list_name)
    return result
