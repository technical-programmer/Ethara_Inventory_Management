"""
Business logic for Product operations.

Framework-agnostic on purpose: only SQLAlchemy + domain exceptions, never
FastAPI. This is what lets it be unit-tested without a running server.
"""
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import ConflictError, NotFoundError
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


def get_product(db: Session, product_id: int) -> Product:
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise NotFoundError("Product", product_id)
    return product


def list_products(db: Session, skip: int = 0, limit: int = 100) -> list[Product]:
    return db.query(Product).offset(skip).limit(limit).all()


def get_product_by_sku(db: Session, sku: str) -> Product | None:
    return db.query(Product).filter(Product.sku == sku).first()


def create_product(db: Session, payload: ProductCreate) -> Product:
    if get_product_by_sku(db, payload.sku) is not None:
        raise ConflictError(f"Product with SKU '{payload.sku}' already exists.")

    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def update_product(db: Session, product_id: int, payload: ProductUpdate) -> Product:
    product = get_product(db, product_id)
    updates = payload.model_dump(exclude_unset=True)

    new_sku = updates.get("sku")
    if new_sku and new_sku != product.sku and get_product_by_sku(db, new_sku):
        raise ConflictError(f"Product with SKU '{new_sku}' already exists.")

    for field, value in updates.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product_id: int) -> None:
    product = get_product(db, product_id)
    db.delete(product)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise ConflictError(
            f"Cannot delete product '{product.name}' because it is referenced by an existing order."
        )


def is_stock_available(product: Product, requested_quantity: int) -> bool:
    """Used by the order flow to enforce: orders cannot exceed available stock."""
    return product.quantity >= requested_quantity


def decrement_stock(db: Session, product: Product, quantity: int) -> None:
    """Reduce stock after a successful order. Caller guarantees availability was checked."""
    product.quantity -= quantity
    db.add(product)


def increment_stock(db: Session, product: Product, quantity: int) -> None:
    """Restore stock, e.g. when an order is cancelled/deleted."""
    product.quantity += quantity
    db.add(product)