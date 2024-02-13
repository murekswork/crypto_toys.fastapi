from pydantic import BaseModel, ValidationError, field_validator


class CurrencySchema(BaseModel):

    currency: str

    @field_validator('currency')
    def currency_validator(cls, v: str) -> ValidationError | str:
        v = v.lower()
        if v.lower() not in ['usd', 'eur', 'gbp', 'rub']:
            raise ValidationError('incorrect currency input')
        return v.lower()
