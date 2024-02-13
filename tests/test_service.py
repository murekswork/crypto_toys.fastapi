import pytest
from httpx import AsyncClient


class TestGetFullMarketDataService:

    @pytest.mark.asyncio
    async def test_when_pass_incorrect_currency_then_raise_error(self, client: AsyncClient, clean_cache) -> None:
        response = await client.get('/market_data/{currency}', params={'currency': 'xyz'})
        assert response.status_code == 403
        assert response.json()['detail'] == 'invalid currency input'
