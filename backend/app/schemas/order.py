from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class OrderItemCreate(BaseModel):
    """One line item when creating an order: which product, how many units."""
    product_id: int
    quantity: int = Field(gt=0, description="Quantity must be greater than 0")


class OrderCreate(BaseModel):
    """Payload accepted by POST /orders."""
    customer_id: int
    items: list[OrderItemCreate] = Field(min_length=1)


class OrderItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float

    model_config = ConfigDict(from_attributes=True)


class OrderOut(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    created_at: datetime
    items: list[OrderItemOut]

    model_config = ConfigDict(from_attributes=True)