from datetime import date
from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Invoice, User
from app.schemas import DashboardSummary
from app.services.cashflow_service import calculate_expected_next_30_days
from app.services.risk_service import calculate_risk_level

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DashboardSummary:
    invoices = list(
        db.scalars(select(Invoice).where(Invoice.user_id == current_user.id)).all()
    )

    outstanding_total = Decimal("0.00")
    overdue_total = Decimal("0.00")
    paid_this_month = Decimal("0.00")
    today = date.today()

    for invoice in invoices:
        amount = Decimal(str(invoice.amount))
        status = invoice.status.lower()

        if status != "paid":
            outstanding_total += amount
        if status == "overdue":
            overdue_total += amount
        if status == "paid" and invoice.paid_date and invoice.paid_date.month == today.month and invoice.paid_date.year == today.year:
            paid_this_month += amount

    return DashboardSummary(
        outstanding_total=outstanding_total,
        overdue_total=overdue_total,
        expected_next_30_days=calculate_expected_next_30_days(invoices),
        paid_this_month=paid_this_month,
        overdue_count=sum(1 for invoice in invoices if invoice.status.lower() == "overdue"),
        risk_level=calculate_risk_level(invoices),
    )
