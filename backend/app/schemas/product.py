from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator


class ProductBase(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    sku: str = Field(min_length=1, max_length=64, description="Unique product code")
    price: float = Field(gt=0, description="Unit price; must be greater than 0")
    quantity: int = Field(ge=0, description="Stock on hand; cannot be negative")

    @field_validator("name", "sku")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return v.strip()


class ProductCreate(ProductBase):
    """Payload accepted by POST /products."""


class ProductUpdate(BaseModel):
    """Payload accepted by PUT /products/{id}. All fields optional (partial update)."""
    name: str | None = Field(default=None, min_length=1, max_length=200)
    sku: str | None = Field(default=None, min_length=1, max_length=64)
    price: float | None = Field(default=None, gt=0)
    quantity: int | None = Field(default=None, ge=0)

    @field_validator("name", "sku")
    @classmethod
    def strip_whitespace(cls, v: str | None) -> str | None:
        return v.strip() if v else v


class ProductOut(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)