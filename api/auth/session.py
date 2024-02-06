import json

from fastapi import Request, HTTPException
from pydantic import BaseModel

from api.schemas.follow_lists import FollowList


class FollowListSchema(BaseModel):

    name: str = 'follow list'
    coins: list[int] | None = []


class SessionManager:

    def __init__(self, request: Request):
        self.request = request
        self.session = self.request.session

        try:
            self.follow_lists = self.session['follow_lists']
        except:
            self.session['follow_lists'] = {}
            self.follow_lists = self.session['follow_lists']


    async def get_follow_lists(self) -> list[FollowListSchema]:
        return [FollowListSchema(name=key, coins=self.follow_lists[key]) for key in self.follow_lists]

    async def create_follow_list(self, new_list_name: str) -> FollowListSchema:

        lst = self.follow_lists.get(new_list_name)
        if lst is None:
            self.follow_lists[new_list_name] = []
            self.request.session['follow_lists'] = self.follow_lists
            return FollowListSchema(name=new_list_name)

        raise HTTPException(status_code=403, detail='You already have list with same name!')

    async def add_to_follow_list(self, list_name: str, coin_id: int):

        lst = self.follow_lists.get(list_name)

        if lst is not None:

            lst_schema = FollowListSchema(list_name=list_name, coins=lst)

            if coin_id in lst_schema.coins:
                raise HTTPException(status_code=403, detail=f"You already have coin with id {coin_id} in list {list_name}")

            lst_schema.coins.append(coin_id)
            self.follow_lists[list_name] = lst_schema.coins
            self.session['follow_lists'] = self.follow_lists
            return lst_schema

        raise HTTPException(status_code=404, detail=f"You dant have list with this name!")

    async def remove_from_follow_list(self, list_name: str, coin_id: int):

        lst = self.follow_lists.get(list_name)

        if lst is not None:

            if coin_id in lst:
                lst.remove(coin_id)
                self.follow_lists[list_name] = lst
                self.session['follow_lists'] = self.follow_lists
                return True

            raise HTTPException(status_code=403, detail=f"You dont have {coin_id} in list {list_name}")

        raise HTTPException(status_code=403, detail=f"You dont have list with this name")