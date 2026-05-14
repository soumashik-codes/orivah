from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class UserBase(BaseModel):
    name: str = Field(..., max_length=100)
    email: str


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: str
    password: str


class ClientBase(BaseModel):
    name: str = Field(..., max_length=100)
    email: str
    company_name: str | None = Field(default=None, max_length=255)
    phone: str | None = Field(default=None, max_length=50)
    notes: str | None = None


class ClientCreate(ClientBase):
    pass


class ClientRead(ClientBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    created_at: datetime


class InvoiceBase(BaseModel):
    client_id: int
    invoice_number: str = Field(..., max_length=100)
    amount: Decimal = Field(..., gt=0)
    issue_date: date
    due_date: date
    paid_date: date | None = None
    status: str = Field(..., max_length=50)
    description: str | None = None


class InvoiceCreate(InvoiceBase):
    pass


class InvoiceRead(InvoiceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    created_at: datetime


class DashboardSummary(BaseModel):
    outstanding_total: Decimal
    overdue_total: Decimal
    expected_next_30_days: Decimal
    paid_this_month: Decimal
    overdue_count: int
    risk_level: str
