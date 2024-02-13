from pydantic_settings import BaseSettings


class ParseSettings(BaseSettings):

    PARSE_SOURCE_BASE_URL: str = 'https://cryptobubbles.net'

    TOP_1000_DATA_URL: str = '/backend/data/bubbles1000.{}.json'

    COIN_TIMESTAMP_CHART_URL: str = '/backend/data/charts/{}/{}/USD.json'
