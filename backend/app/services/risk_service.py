from app.models import Invoice


def calculate_risk_level(invoices: list[Invoice]) -> str:
    overdue_count = sum(1 for invoice in invoices if invoice.status.lower() == "overdue")

    if overdue_count >= 3:
        return "High"

    if overdue_count >= 1:
        return "Medium"

    return "Low"
