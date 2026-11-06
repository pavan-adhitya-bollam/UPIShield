from __future__ import annotations

import re
from datetime import datetime
from typing import Any


KNOWN_LOCATIONS = [
    "Ahmedabad",
    "Bengaluru",
    "Chennai",
    "Delhi",
    "Hyderabad",
    "Jaipur",
    "Kolkata",
    "Lucknow",
    "Mumbai",
    "Nagpur",
    "Pune",
    "Surat",
]

KNOWN_APP_NAMES = ["AmazonPay", "BHIM", "GPay", "Paytm", "PhonePe"]
KNOWN_MONEY_FLOW_PATTERNS = [
    "Bills Payment",
    "Business Transfer",
    "Education Payment",
    "Gift",
    "Loan Repayment",
    "Merchant Payment",
    "Personal Transfer",
    "Refund",
    "Shopping and Lifestyle",
    "Travel Payment",
]
KNOWN_MERCHANT_CATEGORIES = [
    "Business Payment",
    "Education",
    "Electronics",
    "Entertainment",
    "Food",
    "Fuel",
    "Grocery",
    "Insurance",
    "Loan Repayment",
    "Merchant Payment",
    "P2P",
    "Pharmacy",
    "Rent",
    "Travel",
    "Utilities",
]


def parse_bool(value: Any, default: bool = False) -> bool:
    if value is None:
        return default
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return bool(value)
    text = str(value).strip().lower()
    return text in {"true", "1", "yes", "y", "t"}


def parse_datetime_parts(transaction_date: Any, transaction_time: Any):
    if transaction_date:
        try:
            date_obj = datetime.fromisoformat(str(transaction_date)).date()
        except ValueError:
            date_obj = datetime.utcnow().date()
    else:
        date_obj = datetime.utcnow().date()

    if transaction_time:
        time_text = str(transaction_time)
        try:
            time_obj = datetime.strptime(time_text, "%H:%M:%S")
            hour = time_obj.hour
        except ValueError:
            hour = datetime.utcnow().hour
    else:
        hour = datetime.utcnow().hour

    return date_obj, hour


def infer_transaction_type(payload: dict[str, Any]) -> str:
    value = payload.get("transaction_type") or payload.get("transactionType")
    if value:
        normalized = str(value).upper()
        if normalized in {"P2P", "P2M"}:
            return normalized
        return "P2P"

    if payload.get("merchant_category") or payload.get("merchantCategory"):
        return "P2M"
    return "P2P"


def infer_merchant_category(payload: dict[str, Any]) -> str:
    value = payload.get("merchant_category") or payload.get("merchantCategory") or ""
    if value in KNOWN_MERCHANT_CATEGORIES:
        return value

    purpose = str(payload.get("purpose") or "").lower()
    if "edu" in purpose:
        return "Education"
    if any(word in purpose for word in ["rent", "house"]):
        return "Rent"
    if any(word in purpose for word in ["fuel", "petrol"]):
        return "Fuel"
    if any(word in purpose for word in ["grocery", "mart", "supermarket"]):
        return "Grocery"
    if any(word in purpose for word in ["travel", "ticket"]):
        return "Travel"
    if any(word in purpose for word in ["merchant", "purchase", "shopping"]):
        return "Merchant Payment"
    return value or "P2P"


def infer_money_flow_pattern(payload: dict[str, Any]) -> str:
    value = payload.get("money_flow_pattern") or payload.get("moneyFlowPattern")
    if value in KNOWN_MONEY_FLOW_PATTERNS:
        return value

    merchant_category = infer_merchant_category(payload)
    mapping = {
        "Business Payment": "Business Transfer",
        "Education": "Education Payment",
        "Electronics": "Shopping and Lifestyle",
        "Entertainment": "Shopping and Lifestyle",
        "Food": "Shopping and Lifestyle",
        "Fuel": "Travel Payment",
        "Grocery": "Shopping and Lifestyle",
        "Insurance": "Bills Payment",
        "Loan Repayment": "Loan Repayment",
        "Merchant Payment": "Merchant Payment",
        "P2P": "Personal Transfer",
        "Pharmacy": "Bills Payment",
        "Rent": "Bills Payment",
        "Travel": "Travel Payment",
        "Utilities": "Bills Payment",
    }
    return mapping.get(merchant_category, "Personal Transfer")


def infer_location(payload: dict[str, Any]) -> str:
    location = payload.get("location")
    if isinstance(location, dict):
        value = location.get("city")
    else:
        location_info = payload.get("locationInfo")
        value = location or (location_info.get("city") if isinstance(location_info, dict) else None)
    if value in KNOWN_LOCATIONS:
        return value
    return value or "Pune"


def infer_os_type(payload: dict[str, Any]) -> str:
    value = payload.get("os_type") or payload.get("osType")
    if value in {"Android", "iOS"}:
        return value

    app_name = str(payload.get("app_name") or payload.get("appName") or "").lower()
    if "iphone" in app_name or "ios" in app_name:
        return "iOS"
    return "Android"


def infer_app_name(payload: dict[str, Any]) -> str:
    value = payload.get("app_name") or payload.get("appName")
    if value in KNOWN_APP_NAMES:
        return value

    raw = str(payload.get("paymentMethod") or payload.get("payment_method") or "").lower()
    if "phonepe" in raw:
        return "PhonePe"
    if "gpay" in raw or "google" in raw:
        return "GPay"
    if "paytm" in raw:
        return "Paytm"
    if "bhim" in raw:
        return "BHIM"
    return "PhonePe"


def infer_device_changed(payload: dict[str, Any]) -> bool:
    if "device_changed" in payload:
        return parse_bool(payload.get("device_changed"))
    if "deviceChanged" in payload:
        return parse_bool(payload.get("deviceChanged"))
    return not bool(payload.get("device_id") or payload.get("deviceId"))


def infer_location_changed(payload: dict[str, Any]) -> bool:
    if "location_changed" in payload:
        return parse_bool(payload.get("location_changed"))
    if "locationChanged" in payload:
        return parse_bool(payload.get("locationChanged"))
    return not bool(payload.get("location") or payload.get("locationInfo"))


def infer_new_beneficiary(payload: dict[str, Any]) -> bool:
    if "new_beneficiary" in payload:
        return parse_bool(payload.get("new_beneficiary"))
    if "newBeneficiary" in payload:
        return parse_bool(payload.get("newBeneficiary"))
    receiver_upi = payload.get("receiver_upi") or payload.get("receiverUpi")
    return not bool(receiver_upi)


def infer_decimal_pattern(amount: float) -> bool:
    return round(amount, 2) != round(float(int(amount)), 2)


def sanitize_text(value: Any, fallback: str = "NONE") -> str:
    if value is None:
        return fallback
    text = str(value).strip()
    return text or fallback


def classify_risk_level(score: int) -> str:
    if score >= 80:
        return "CRITICAL"
    if score >= 60:
        return "HIGH"
    if score >= 30:
        return "MEDIUM"
    return "LOW"


def classify_prediction_status(score: int) -> str:
    return "FRAUD" if score >= 60 else "GENUINE"


def build_recommendations(risk_level: str):
    if risk_level == "CRITICAL":
        return ["Block Transaction", "Manual Review", "Contact Customer"]
    if risk_level == "HIGH":
        return ["OTP Verification", "Manual Review", "Contact Customer"]
    if risk_level == "MEDIUM":
        return ["OTP Verification", "Allow Transaction"]
    return ["Allow Transaction"]


def build_fraud_reasons(risk_level: str, payload: dict[str, Any]):
    reasons: list[str] = []
    amount = float(payload.get("amount") or 0)
    if amount >= 100000:
        reasons.append("Large Transaction")
    if infer_device_changed(payload):
        reasons.append("Unknown Device")
        reasons.append("Device Changed")
    if infer_location_changed(payload):
        reasons.append("Location Changed")
    if infer_new_beneficiary(payload):
        reasons.append("New Beneficiary")
    if amount >= 50000:
        reasons.append("High Transaction Velocity")
    if risk_level in {"HIGH", "CRITICAL"}:
        reasons.append("Customer Behaviour Deviation")
    return list(dict.fromkeys(reasons))


def feature_count_for_model(feature_names: list[str]) -> int:
    return len(feature_names)
