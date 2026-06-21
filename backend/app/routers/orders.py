from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.exceptions import InsufficientStockError, NotFoundError
from app.crud import order as order_crud
from app.database import get_db
from app.schemas.order import OrderCreate, OrderOut

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)) -> OrderOut:
    """
    Create a new order. Validates the customer and every product exist,
    checks stock availability for each item, then atomically creates the
    order and decrements stock. Fails with 404 if customer/product is
    missing, or 409 if stock is insufficient.
    """
    try:
        return order_crud.create_order(db, payload)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except InsufficientStockError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc


@router.get("", response_model=list[OrderOut])
def list_orders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> list[OrderOut]:
    """Retrieve all orders, paginated."""
    return order_crud.list_orders(db, skip=skip, limit=limit)


@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)) -> OrderOut:
    """Retrieve a single order's details by ID."""
    try:
        return order_crud.get_order(db, order_id)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: Session = Depends(get_db)) -> None:
    """Cancel/delete an order."""
    try:
        order = order_crud.get_order(db, order_id)
        db.delete(order)
        db.commit()
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc