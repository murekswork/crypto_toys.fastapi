from pydantic import BaseModel


class FollowListSchema(BaseModel):
    name: str = 'follow list'
    coins: list[int] = []


class FollowListSchemaCreate(BaseModel):
    name: str = 'default'


class AddCoinToFollowListSchema(BaseModel):
    list_name: str
    coin_id: int


class FollowList(BaseModel):
    name: str
    coins: set[int]
