"""
Business logic for Customer operations. Framework-agnostic, same pattern as
crud/product.py.
"""
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import ConflictError, NotFoundError
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate


def get_customer(db: Session, customer_id: int) -> Customer:
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if customer is None:
        raise NotFoundError("Customer", customer_id)
    return customer


def list_customers(db: Session, skip: int = 0, limit: int = 100) -> list[Customer]:
    return db.query(Customer).offset(skip).limit(limit).all()


def get_customer_by_email(db: Session, email: str) -> Customer | None:
    return db.query(Customer).filter(Customer.email == email).first()


def create_customer(db: Session, payload: CustomerCreate) -> Customer:
    if get_customer_by_email(db, payload.email) is not None:
        raise ConflictError(f"Customer with email '{payload.email}' already exists.")

    customer = Customer(**payload.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


def delete_customer(db: Session, customer_id: int) -> None:
    customer = get_customer(db, customer_id)
    db.delete(customer)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise ConflictError(
            f"Cannot delete customer '{customer.full_name}' because they have existing orders."
        )