from __future__ import annotations

from contextlib import asynccontextmanager
from datetime import datetime, timezone
from time import perf_counter

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse

from .config import config
from .model_loader import clear_model_cache, load_model
from .predictor import Predictor
from .schemas import HealthResponse, ModelInfoResponse, PredictionResponse, TransactionPayload


START_TIME = datetime.now(timezone.utc)


@asynccontextmanager
async def lifespan(app: FastAPI):
    clear_model_cache()
    loaded_model = load_model()
    app.state.loaded_model = loaded_model
    app.state.predictor = Predictor(loaded_model)
    yield


app = FastAPI(
    title="UPI Fraud ML Service",
    version="2.1.0",
    lifespan=lifespan,
)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start = perf_counter()
    response = await call_next(request)
    response.headers["X-Process-Time-ms"] = str(int((perf_counter() - start) * 1000))
    return response


@app.post("/predict", response_model=PredictionResponse)
async def predict_transaction(payload: TransactionPayload):
    predictor: Predictor = app.state.predictor
    result = await predictor.predict(payload.model_dump(by_alias=False, exclude_none=True))
    return PredictionResponse(
        riskScore=result["riskScore"],
        fraudProbability=result["fraudProbability"],
        riskLevel=result["riskLevel"],
        predictionStatus=result["predictionStatus"],
        predictionConfidence=result["predictionConfidence"],
        fraudReasons=result["fraudReasons"],
        recommendations=result["recommendations"],
        predictionTime=result["predictionTime"],
        modelVersion=result["modelVersion"],
    )


@app.get("/health", response_model=HealthResponse)
async def health_check():
    loaded = hasattr(app.state, "loaded_model")
    status = "Healthy" if loaded else "Loading"
    uptime_seconds = int((datetime.now(timezone.utc) - START_TIME).total_seconds())
    return HealthResponse(
        modelLoaded=loaded,
        status=status,
        version=config.model_version,
        uptime=f"{uptime_seconds}s",
    )


@app.get("/model-info", response_model=ModelInfoResponse)
async def model_info():
    predictor: Predictor = app.state.predictor
    info = predictor.model_info()
    return ModelInfoResponse(
        modelName=info["modelName"],
        trainingDate=info["trainingDate"],
        datasetVersion=info["datasetVersion"],
        threshold=info["threshold"],
        featureCount=info["featureCount"],
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": str(exc)})
