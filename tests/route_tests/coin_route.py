import pytest
from fastapi import status
from httpx import AsyncClient


class TestCoinRouteGetMarketData:

    @pytest.mark.asyncio
    async def test_market_data_without_cache(self, client: AsyncClient, clean_cache) -> None:
        response = await client.get('market_data/usd')
        assert response.status_code == status.HTTP_200_OK
        assert response.json()[0]['id'] == '1'
        assert response.json()[0]['slug'] == 'bitcoin'
        assert response.json()[0]['symbol'] == 'BTC'

    @pytest.mark.asyncio
    async def test_market_data_with_cache(self, client: AsyncClient) -> None:
        response = await client.get('market_data/usd')
        assert response.status_code == status.HTTP_200_OK
        assert response.json()[0]['id'] == '1'
        assert response.json()[0]['slug'] == 'bitcoin'
        assert response.json()[0]['symbol'] == 'BTC'

    @pytest.mark.asyncio
    async def test_market_data_with_incorrect_currency_then_raise_422(self, client: AsyncClient) -> None:
        response = await client.get('market_data/usu')
        assert response.status_code >= status.HTTP_422_UNPROCESSABLE_ENTITY


class TestCoinRouteGetMarketDataWithSkipLimit:

    @pytest.mark.asyncio
    async def test_market_data_without_cache(self, client: AsyncClient, clean_cache) -> None:
        skip = 0
        limit = 100
        response = await client.get(f'market_data/usd/?skip={skip}&limit={limit}')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.json()) == 100

    @pytest.mark.asyncio
    async def test_market_data_with_cache(self, client: AsyncClient) -> None:
        response = await client.get('market_data/usd/?skip=0&limit=100')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.json()) == 100

    @pytest.mark.asyncio
    async def test_market_data_with_incorrect_skip_then_raise_403(self, client: AsyncClient) -> None:
        response = await client.get('market_data/usd/?skip=999&limit=200')
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.json()['detail'] == 'invalid skip or limit!'

    @pytest.mark.asyncio
    async def test_market_data_with_incorrect_currency_then_raise_422(self, client: AsyncClient):
        response = await client.get('market_data/xyz/?skip=1&limit=20')
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestGetCoinData:

    @pytest.mark.asyncio
    async def test_get_coin_data_with_correct_request(self, client: AsyncClient) -> None:
        response = await client.get('coins/1/usd')
        assert response.status_code == status.HTTP_200_OK
        assert response.json()['id'] == '1'
        assert response.json()['symbol'] == 'BTC'

    @pytest.mark.asyncio
    async def test_get_coin_data_with_incorrect_coin_id_then_raise_422(self, client: AsyncClient) -> None:
        response = await client.get('coins/incorrect_coin_id/usd')
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    @pytest.mark.asyncio
    async def test_get_coin_data_with_incorrect_currency_then_raise_422(self, client: AsyncClient) -> None:
        response = await client.get('coins/1/incorrect_currency')
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    class TestGetCoinChartData:

        @pytest.mark.asyncio
        async def test_get_coin_data_with_correct_request(self, client: AsyncClient) -> None:
            response = await client.get('charts/?coin_id=1&timestamp=day')
            assert response.status_code == status.HTTP_200_OK
            assert len(response.json()) == 144

        @pytest.mark.asyncio
        async def test_get_coin_data_with_string_coin_id_then_raise_422(self, client: AsyncClient) -> None:
            response = await client.get('charts/?coin_id=incorrect_coin_id&timestamp=day')
            assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

        @pytest.mark.asyncio
        async def test_get_coin_data_with_not_existing_coin_id_then_raise_502(self, client: AsyncClient) -> None:
            response = await client.get('charts/?coin_id=1121512512251&timestamp=day')
            assert response.status_code == status.HTTP_502_BAD_GATEWAY
            assert response.json()['detail'].lower() == 'could not fetch coin data'

        @pytest.mark.asyncio
        async def test_get_coin_data_not_incorrect_timestamp_then_raise_422(self, client: AsyncClient) -> None:
            response = await client.get('charts/?coin_id=1&timestamp=second')
            assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    # @pytest.mark.asyncio
    # async def test_market_data_when_cache_is_down(self, client: AsyncClient) -> None:
    #     with patch.object(ParseSettings, 'TOP_1000_DATA_URL', new='https://google.com/'):
    #         result = await client.get('market_data/usd')
    #         assert result.status_code == 200
