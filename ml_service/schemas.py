from __future__ import annotations

from datetime import date, datetime
from typing import Any, Dict, Optional, Union

from pydantic import BaseModel, Field


class TransactionLocation(BaseModel):
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class TransactionPayload(BaseModel):
    transaction_id: Optional[str] = Field(default=None, alias="transactionId")
    transaction_date: Optional[date] = Field(default=None, alias="transactionDate")
    transaction_time: Optional[str] = Field(default=None, alias="transactionTime")
    sender_upi: Optional[str] = Field(default=None, alias="senderUpi")
    receiver_upi: Optional[str] = Field(default=None, alias="receiverUpi")
    amount: float = Field(..., ge=0)
    transaction_type: Optional[str] = Field(default=None, alias="transactionType")
    merchant_category: Optional[str] = Field(default=None, alias="merchantCategory")
    sender_account_age_days: Optional[float] = Field(default=None, alias="senderAccountAgeDays")
    receiver_account_age_days: Optional[float] = Field(default=None, alias="receiverAccountAgeDays")
    device_id: Optional[str] = Field(default=None, alias="deviceId")
    device_changed: Optional[bool] = Field(default=None, alias="deviceChanged")
    known_device: Optional[bool] = Field(default=None, alias="knownDevice")
    trusted_device: Optional[bool] = Field(default=None, alias="trustedDevice")
    os_type: Optional[str] = Field(default=None, alias="osType")
    app_name: Optional[str] = Field(default=None, alias="appName")
    ip_address: Optional[str] = Field(default=None, alias="ipAddress")
    location: Optional[Union[str, TransactionLocation]] = None
    location_changed: Optional[bool] = Field(default=None, alias="locationChanged")
    new_beneficiary: Optional[bool] = Field(default=None, alias="newBeneficiary")
    beneficiary_frequency: Optional[float] = Field(default=None, alias="beneficiaryFrequency")
    transactions_last_10_minutes: Optional[float] = Field(default=None, alias="transactionsLast10Minutes")
    transactions_last_hour: Optional[float] = Field(default=None, alias="transactionsLastHour")
    transactions_last_24_hours: Optional[float] = Field(default=None, alias="transactionsLast24Hours")
    amount_sent_last_24_hours: Optional[float] = Field(default=None, alias="amountSentLast24Hours")
    amount_received_last_24_hours: Optional[float] = Field(default=None, alias="amountReceivedLast24Hours")
    unique_receivers_today: Optional[float] = Field(default=None, alias="uniqueReceiversToday")
    balance_before: Optional[float] = Field(default=None, alias="balanceBefore")
    balance_after: Optional[float] = Field(default=None, alias="balanceAfter")
    decimal_pattern: Optional[bool] = Field(default=None, alias="decimalPattern")
    money_flow_pattern: Optional[str] = Field(default=None, alias="moneyFlowPattern")
    customer_behaviour_deviation: Optional[float] = Field(default=None, alias="customerBehaviourDeviation")
    prediction_time: Optional[datetime] = Field(default=None, alias="predictionTime")
    location_info: Optional[TransactionLocation] = Field(default=None, alias="locationInfo")

    class Config:
        populate_by_name = True
        extra = "allow"


class PredictionResponse(BaseModel):
    riskScore: int
    fraudProbability: float
    riskLevel: str
    predictionStatus: str
    predictionConfidence: int
    fraudReasons: list[str]
    recommendations: list[str]
    predictionTime: str
    modelVersion: str


class HealthResponse(BaseModel):
    modelLoaded: bool
    status: str
    version: str
    uptime: str


class ModelInfoResponse(BaseModel):
    modelName: str
    trainingDate: str
    datasetVersion: str
    threshold: float
    featureCount: int
