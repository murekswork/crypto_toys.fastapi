from pydantic import BaseModel


class FollowListSchema(BaseModel):
    name: str = 'follow list'
    coins: list[int] = []


class FollowList(BaseModel):

    name: str
    coins: set[int]
