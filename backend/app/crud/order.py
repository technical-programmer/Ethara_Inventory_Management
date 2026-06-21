"""
Business logic for Order operations.

create_order is the most business-rule-heavy function in this app:
  - the customer must exist
  - every referenced product must exist
  - stock must be sufficient for every line item
  - the total amount is calculated server-side, never trusted from the client
  - stock is decremented only after every check has passed
  - the whole thing is one DB transaction: if anything fails, nothing commits
"""
from sqlalchemy.orm import Session

from app.core.exceptions import InsufficientStockError, NotFoundError
from app.crud.customer import get_customer
from app.crud.product import decrement_stock, get_product, is_stock_available
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate


def get_order(db: Session, order_id: int) -> Order:
    order = db.query(Order).filter(Order.id == order_id).first()
    if order is None:
        raise NotFoundError("Order", order_id)
    return order


def list_orders(db: Session, skip: int = 0, limit: int = 100) -> list[Order]:
    return db.query(Order).offset(skip).limit(limit).all()


def create_order(db: Session, payload: OrderCreate) -> Order:
    
    get_customer(db, payload.customer_id)

   
    products = {}
    for item in payload.items:
        product = get_product(db, item.product_id)
        if not is_stock_available(product, item.quantity):
            raise InsufficientStockError(
                product_name=product.name,
                requested=item.quantity,
                available=product.quantity,
            )
        products[item.product_id] = product

   
    order = Order(customer_id=payload.customer_id, total_amount=0.0)
    db.add(order)
    db.flush()  

    total_amount = 0.0
    for item in payload.items:
        product = products[item.product_id]
        line_total = product.price * item.quantity
        total_amount += line_total

        db.add(
            OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=item.quantity,
                unit_price=product.price,
            )
        )
        decrement_stock(db, product, item.quantity)

    order.total_amount = total_amount
    db.commit()
    db.refresh(order)
    return order