from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class CustomerBase(BaseModel):
    full_name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    phone_number: str = Field(min_length=7, max_length=20)

    @field_validator("full_name")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return v.strip()


class CustomerCreate(CustomerBase):
    """Payload accepted by POST /customers."""


class CustomerOut(CustomerBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)