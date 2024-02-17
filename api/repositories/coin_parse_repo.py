import json

from fastapi import HTTPException
from httpx import AsyncClient
from starlette import status

from settings import ParseSettings


class CoinParseRepository:

    def __init__(self, token: str = 'MOCKED'):
        self.token = token
        self.settings = ParseSettings()
        self.client = AsyncClient(base_url=self.settings.PARSE_SOURCE_BASE_URL)

    async def parse_full_market_data(self, currency: str):
        async with self.client as c:
            response = await c.get(self.settings.TOP_1000_DATA_URL.format(currency))
            if response.status_code == 200:
                return json.dumps(response.json())

        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY,
                            detail='Could not fetch market data')

    async def parse_coin_data(self, coin_id: int, currency: str):
        ...

    async def parse_coin_chart(self, coin_id: int, timestamp: str) -> str:
        async with self.client as c:
            response = await c.get(
                self.settings.COIN_TIMESTAMP_CHART_URL.format(timestamp,
                                                              coin_id)
            )

            if response.status_code == 200:
                return json.dumps(response.json())

            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY,
                                detail='Could not fetch coin data')
