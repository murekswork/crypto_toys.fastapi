from typing import Any

from pydantic import BaseModel


class CoinSchema(BaseModel):
    id: str
    name: str
    slug: Any
    rank: int
    symbol: str
    symbols: Any
    image: str
    stable: bool
    circulating_supply: int
    dominance: float
    rankDiffs: dict[str, int]
    cg_id: str
    price: float
    marketcap: int
    volume: float
    performance: Any
