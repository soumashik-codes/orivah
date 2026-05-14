from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Client, Invoice, User
from app.schemas import InvoiceCreate, InvoiceRead

router = APIRouter(prefix="/invoices", tags=["invoices"])


@router.get("", response_model=list[InvoiceRead])
def list_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Invoice]:
    statement = select(Invoice).where(Invoice.user_id == current_user.id).order_by(Invoice.created_at.desc())
    return list(db.scalars(statement).all())


@router.post("", response_model=InvoiceRead, status_code=status.HTTP_201_CREATED)
def create_invoice(
    payload: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Invoice:
    client = db.scalar(
        select(Client).where(Client.id == payload.client_id, Client.user_id == current_user.id)
    )
    if client is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")

    invoice = Invoice(user_id=current_user.id, **payload.model_dump())
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    return invoice
