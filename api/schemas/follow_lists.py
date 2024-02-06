from pydantic import BaseModel


class FollowList(BaseModel):

    name: str
    coins: set[int]
