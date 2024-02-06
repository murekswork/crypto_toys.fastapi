from pydantic import BaseModel, field_validator, validator, ValidationError
from typing import Any, Dict, List, Optional


class CurrencySchema(BaseModel):

    currency: str

    @field_validator('currency')
    def currency_validator(cls, v: str) -> ValidationError | str:
        v = v.lower()
        if v.lower() not in ['usd', 'eur', 'gbp', 'rub']:
            raise ValidationError('incorrect currency input')
        return v.lower()


