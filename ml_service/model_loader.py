from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any

import joblib

from .config import config


@dataclass
class LoadedModel:
    model: Any
    feature_names: list[str]
    version: str
    model_name: str
    training_date: str
    dataset_version: str
    threshold: float
    model_path: Path


@lru_cache(maxsize=1)
def load_model() -> LoadedModel:
    model = joblib.load(config.model_path)
    feature_names = list(getattr(model, "feature_names_in_", []))
    if not feature_names:
        raise RuntimeError("Loaded model does not expose feature_names_in_.")

    return LoadedModel(
        model=model,
        feature_names=feature_names,
        version=config.model_version,
        model_name=config.model_name,
        training_date=config.resolved_training_date(),
        dataset_version=config.dataset_version,
        threshold=config.threshold,
        model_path=config.model_path,
    )


def clear_model_cache() -> None:
    load_model.cache_clear()
