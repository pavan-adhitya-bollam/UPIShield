from __future__ import annotations

import os
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
MODEL_PATH = Path(os.getenv("MODEL_PATH", PROJECT_ROOT / "models" / "best_histgradientboosting_model.joblib"))


@dataclass(frozen=True)
class AppConfig:
    app_name: str = os.getenv("APP_NAME", "upi-fraud-ml-service")
    model_name: str = os.getenv("MODEL_NAME", "HistGradientBoosting")
    model_version: str = os.getenv("MODEL_VERSION", "HistGradientBoosting v1.0")
    dataset_version: str = os.getenv("DATASET_VERSION", "Behavioral V2")
    threshold: float = float(os.getenv("MODEL_THRESHOLD", "0.25"))
    model_path: Path = MODEL_PATH
    training_date: str = os.getenv("MODEL_TRAINING_DATE", "")
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))

    def resolved_training_date(self) -> str:
        if self.training_date:
            return self.training_date

        if self.model_path.exists():
          mtime = datetime.fromtimestamp(self.model_path.stat().st_mtime)
          return mtime.isoformat(timespec="seconds")

        return datetime.utcnow().isoformat(timespec="seconds")


config = AppConfig()
