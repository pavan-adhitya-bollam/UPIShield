import joblib
import numpy as np
from pathlib import Path

# Load the HistGradientBoosting model
model_path = Path('models/benchmark/histgradientboosting.joblib')
model = joblib.load(model_path)

print("Model loaded successfully")
print(f"Model type: {type(model)}")
print(f"Has predict_proba: {hasattr(model, 'predict_proba')}")
print(f"Has predict: {hasattr(model, 'predict')}")

# Check feature names
if hasattr(model, 'feature_names_in_'):
    print(f"Feature count: {len(model.feature_names_in_)}")
    print(f"First 5 features: {list(model.feature_names_in_[:5])}")
else:
    print("Warning: Model does not expose feature_names_in_")

# Load feature columns
feature_columns = joblib.load(Path('models/benchmark/feature_columns.joblib'))
print(f"Loaded feature columns: {len(feature_columns)}")

# Test prediction with dummy data
dummy_data = np.random.rand(1, len(feature_columns))
print(f"\nDummy data shape: {dummy_data.shape}")

if hasattr(model, 'predict_proba'):
    proba = model.predict_proba(dummy_data)
    print(f"Predict_proba output shape: {proba.shape}")
    print(f"Probability range: {proba.min():.4f} to {proba.max():.4f}")
    print(f"Fraud probability: {proba[0, 1]:.4f}")
else:
    pred = model.predict(dummy_data)
    print(f"Predict output: {pred}")

print("\n✓ Model verification complete")
