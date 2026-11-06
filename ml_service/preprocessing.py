from __future__ import annotations

from datetime import datetime
from typing import Any

import pandas as pd

from .utils import (
    build_fraud_reasons,
    classify_prediction_status,
    classify_risk_level,
    infer_app_name,
    infer_decimal_pattern,
    infer_device_changed,
    infer_location,
    infer_location_changed,
    infer_merchant_category,
    infer_money_flow_pattern,
    infer_new_beneficiary,
    infer_os_type,
    infer_transaction_type,
    parse_bool,
    parse_datetime_parts,
    sanitize_text,
    build_recommendations,
)


IDENTIFIER_COLUMNS = [
    "transaction_id",
    "customer_id",
    "sender_upi",
    "receiver_upi",
    "device_id",
    "ip_address",
    "fraud_type",
]


def _normalize_raw_payload(payload: dict[str, Any]) -> dict[str, Any]:
    data = dict(payload)
    amount = float(data.get("amount") or 0)
    transaction_date = data.get("transaction_date") or data.get("transactionDate")
    transaction_time = data.get("transaction_time") or data.get("transactionTime")
    tx_date, tx_hour = parse_datetime_parts(transaction_date, transaction_time)

    sender_upi = data.get("sender_upi") or data.get("senderUpi") or data.get("senderUpiId") or "unknown@upi"
    receiver_upi = data.get("receiver_upi") or data.get("receiverUpi") or data.get("receiverUpiId") or "unknown@upi"
    transaction_type = infer_transaction_type(data)
    merchant_category = infer_merchant_category(data)
    money_flow_pattern = infer_money_flow_pattern(data)
    location = infer_location(data)
    os_type = infer_os_type(data)
    app_name = infer_app_name(data)
    device_changed = infer_device_changed(data)
    location_changed = infer_location_changed(data)
    new_beneficiary = infer_new_beneficiary(data)
    decimal_pattern = parse_bool(data.get("decimal_pattern") or data.get("decimalPattern"), infer_decimal_pattern(amount))

    sender_account_age_days = float(data.get("sender_account_age_days") or data.get("senderAccountAgeDays") or 365)
    receiver_account_age_days = float(data.get("receiver_account_age_days") or data.get("receiverAccountAgeDays") or 180)
    beneficiary_frequency = float(data.get("beneficiary_frequency") or data.get("beneficiaryFrequency") or (0 if new_beneficiary else 3))
    transactions_last_10_minutes = float(data.get("transactions_last_10_minutes") or data.get("transactionsLast10Minutes") or 0)
    transactions_last_hour = float(data.get("transactions_last_hour") or data.get("transactionsLastHour") or 0)
    transactions_last_24_hours = float(data.get("transactions_last_24_hours") or data.get("transactionsLast24Hours") or 0)
    amount_sent_last_24_hours = float(data.get("amount_sent_last_24_hours") or data.get("amountSentLast24Hours") or amount)
    amount_received_last_24_hours = float(data.get("amount_received_last_24_hours") or data.get("amountReceivedLast24Hours") or 0)
    unique_receivers_today = float(data.get("unique_receivers_today") or data.get("uniqueReceiversToday") or 1)
    balance_before = float(data.get("balance_before") or data.get("balanceBefore") or (amount * 10))
    balance_after = float(data.get("balance_after") or data.get("balanceAfter") or max(0, balance_before - amount))
    customer_behaviour_deviation = float(data.get("customer_behaviour_deviation") or data.get("customerBehaviourDeviation") or (0.8 if amount >= 50000 else 0.2))

    feature_row = {
        "amount": amount,
        "sender_account_age_days": sender_account_age_days,
        "receiver_account_age_days": receiver_account_age_days,
        "beneficiary_frequency": beneficiary_frequency,
        "transactions_last_10_minutes": transactions_last_10_minutes,
        "transactions_last_hour": transactions_last_hour,
        "transactions_last_24_hours": transactions_last_24_hours,
        "amount_sent_last_24_hours": amount_sent_last_24_hours,
        "amount_received_last_24_hours": amount_received_last_24_hours,
        "unique_receivers_today": unique_receivers_today,
        "balance_before": balance_before,
        "balance_after": balance_after,
        "customer_behaviour_deviation": customer_behaviour_deviation,
        "transaction_dayofweek": tx_date.weekday(),
        "transaction_day": tx_date.day,
        "transaction_month": tx_date.month,
        "transaction_year": tx_date.year,
        "transaction_hour": tx_hour,
        "transaction_type": transaction_type,
        "merchant_category": merchant_category,
        "device_changed": device_changed,
        "known_device": parse_bool(data.get("known_device") or data.get("knownDevice"), not device_changed),
        "trusted_device": parse_bool(data.get("trusted_device") or data.get("trustedDevice"), not device_changed),
        "os_type": os_type,
        "app_name": app_name,
        "location": location,
        "location_changed": location_changed,
        "new_beneficiary": new_beneficiary,
        "decimal_pattern": decimal_pattern,
        "money_flow_pattern": money_flow_pattern,
        "sender_upi": sender_upi,
        "receiver_upi": receiver_upi,
        "transaction_date": tx_date.isoformat(),
        "transaction_time": datetime.utcnow().strftime("%H:%M:%S"),
        "ip_address": sanitize_text(data.get("ip_address") or data.get("ipAddress"), "0.0.0.0"),
    }

    return feature_row


def build_feature_frame(payload: dict[str, Any], feature_names: list[str]) -> pd.DataFrame:
    normalized = _normalize_raw_payload(payload)
    df = pd.DataFrame([normalized])

    categorical_columns = [
        "transaction_type",
        "merchant_category",
        "device_changed",
        "known_device",
        "trusted_device",
        "os_type",
        "app_name",
        "location",
        "location_changed",
        "new_beneficiary",
        "decimal_pattern",
        "money_flow_pattern",
    ]

    for column in categorical_columns:
        if column in df.columns:
            if column == "merchant_category" and df[column].isna().any():
                df[column] = df[column].fillna("P2P")
            else:
                df[column] = df[column].fillna("NONE")

    for column in df.select_dtypes(include=["object"]).columns:
        if column not in categorical_columns:
            df[column] = df[column].fillna("NONE")

    df_encoded = pd.get_dummies(df, columns=[col for col in categorical_columns if col in df.columns], drop_first=False)

    for feature in feature_names:
        if feature not in df_encoded.columns:
            df_encoded[feature] = 0

    df_encoded = df_encoded[feature_names]
    return df_encoded


def build_analysis_summary(payload: dict[str, Any], risk_score: int, risk_level: str):
    amount = float(payload.get("amount") or 0)
    device_changed = infer_device_changed(payload)
    location_changed = infer_location_changed(payload)
    new_beneficiary = infer_new_beneficiary(payload)

    return {
        "featureContributions": [
            {"feature": "Amount", "contribution": round(min(amount / 100000, 1.0), 2)},
            {"feature": "Device", "contribution": 0.15 if device_changed else 0.0},
            {"feature": "Location", "contribution": 0.1 if location_changed else 0.0},
            {"feature": "Beneficiary", "contribution": 0.1 if new_beneficiary else 0.0},
        ],
        "deviceAnalysis": {
            "deviceChanged": device_changed,
            "trustedDevice": not device_changed,
            "deviceType": payload.get("deviceType") or payload.get("device_type") or "Unknown",
            "browser": payload.get("browser") or "Unknown",
            "os": payload.get("os") or payload.get("osType") or "Unknown",
        },
        "locationAnalysis": {
            "locationChanged": location_changed,
            "city": (payload.get("locationInfo") or {}).get("city") if isinstance(payload.get("locationInfo"), dict) else payload.get("location"),
            "country": (payload.get("locationInfo") or {}).get("country") if isinstance(payload.get("locationInfo"), dict) else None,
        },
        "behaviourAnalysis": {
            "customerBehaviourDeviation": risk_score >= 40,
            "summary": "Behaviour deviates from baseline" if risk_score >= 40 else "Behaviour appears normal",
        },
        "velocityAnalysis": {
            "highTransactionVelocity": amount >= 50000,
            "transactionsLastHour": float(payload.get("transactionsLastHour") or payload.get("transactions_last_hour") or 0),
            "transactionsLast24Hours": float(payload.get("transactionsLast24Hours") or payload.get("transactions_last_24_hours") or 0),
        },
        "beneficiaryAnalysis": {
            "newBeneficiary": new_beneficiary,
            "beneficiaryFrequency": float(payload.get("beneficiaryFrequency") or payload.get("beneficiary_frequency") or 0),
        },
        "recommendations": build_recommendations(risk_level),
    }
