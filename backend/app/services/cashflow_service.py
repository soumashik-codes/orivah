from datetime import date, timedelta
from decimal import Decimal

from app.models import Invoice


def calculate_expected_next_30_days(invoices: list[Invoice]) -> Decimal:
    today = date.today()
    end_date = today + timedelta(days=30)
    total = Decimal("0.00")

    for invoice in invoices:
        status = invoice.status.lower()
        if status in {"paid", "draft"}:
            continue
        if today <= invoice.due_date <= end_date:
            total += Decimal(str(invoice.amount))

    return total
