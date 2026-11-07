from __future__ import annotations

from dataclasses import asdict
from typing import Any
from time import perf_counter

import numpy as np

from .model_loader import LoadedModel
from .preprocessing import build_analysis_summary, build_feature_frame
from .utils import build_fraud_reasons, classify_prediction_status, classify_risk_level, build_recommendations


class Predictor:
    def __init__(self, loaded_model: LoadedModel):
        self.loaded_model = loaded_model

    def _predict_internal(self, payload: dict[str, Any]) -> dict[str, Any]:
        start = perf_counter()
        frame = build_feature_frame(payload, self.loaded_model.feature_names)
        model = self.loaded_model.model

        if hasattr(model, "predict_proba"):
            probability = float(model.predict_proba(frame)[:, 1][0])
        else:
            raw_prediction = model.predict(frame)
            probability = float(np.clip(raw_prediction[0], 0, 1))

        risk_score = int(round(probability * 100))
        risk_level = classify_risk_level(risk_score)
        prediction_status = classify_prediction_status(risk_score)
        prediction_confidence = int(round(max(60, 100 - abs(risk_score - 50))))
        fraud_reasons = build_fraud_reasons(risk_level, payload)
        recommendations = build_recommendations(risk_level)
        elapsed_ms = int((perf_counter() - start) * 1000)

        return {
            "riskScore": risk_score,
            "fraudProbability": probability,
            "riskLevel": risk_level,
            "predictionStatus": prediction_status,
            "predictionConfidence": prediction_confidence,
            "fraudReasons": fraud_reasons,
            "recommendations": recommendations,
            "predictionTime": f"{elapsed_ms}ms",
            "modelVersion": self.loaded_model.version,
            "feature_frame": frame,
            "elapsed_ms": elapsed_ms,
        }

    async def predict(self, payload: dict[str, Any]) -> dict[str, Any]:
        return self._predict_internal(payload)

    async def analyze(self, payload: dict[str, Any]) -> dict[str, Any]:
        prediction = self._predict_internal(payload)
        analysis = build_analysis_summary(payload, prediction["riskScore"], prediction["riskLevel"])
        return {
            **prediction,
            **analysis,
        }

    def model_info(self) -> dict[str, Any]:
        return {
            "modelName": self.loaded_model.model_name,
            "trainingDate": self.loaded_model.training_date,
            "datasetVersion": self.loaded_model.dataset_version,
            "threshold": self.loaded_model.threshold,
            "featureCount": len(self.loaded_model.feature_names),
            "modelVersion": self.loaded_model.version,
        }
