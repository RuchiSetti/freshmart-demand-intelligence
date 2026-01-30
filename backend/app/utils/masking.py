from typing import Any, Optional


def mask_price_for_role(unit_price: Any, role: str) -> Optional[float]:
    """
    Example masking policy:
    - admin: sees unit_price
    - others: unit_price hidden (None)
    """
    if role == "admin":
        try:
            return float(unit_price) if unit_price is not None else None
        except Exception:
            return None
    return None


