from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Client, User
from app.schemas import ClientCreate, ClientRead

router = APIRouter(prefix="/clients", tags=["clients"])


@router.get("", response_model=list[ClientRead])
def list_clients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Client]:
    statement = select(Client).where(Client.user_id == current_user.id).order_by(Client.created_at.desc())
    return list(db.scalars(statement).all())


@router.post("", response_model=ClientRead, status_code=status.HTTP_201_CREATED)
def create_client(
    payload: ClientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Client:
    existing_client = db.scalar(
        select(Client).where(Client.user_id == current_user.id, Client.email == payload.email)
    )
    if existing_client is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Client email already exists")

    client = Client(user_id=current_user.id, **payload.model_dump())
    db.add(client)
    db.commit()
    db.refresh(client)
    return client
