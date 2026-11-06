import joblib
from pathlib import Path

model_path = Path("models/best_fraud_model.joblib")
model = joblib.load(model_path)

print(f"Model Class: {type(model).__name__}")
print(f"Model Module: {type(model).__module__}")
print(f"Model String: {str(model)}")

if hasattr(model, 'feature_names_in_'):
    print(f"Feature Names: {list(model.feature_names_in_)}")
    print(f"Feature Count: {len(model.feature_names_in_)}")
else:
    print("No feature_names_in_ attribute found")

if hasattr(model, 'n_features_in_'):
    print(f"Expected Features: {model.n_features_in_}")

if hasattr(model, 'classes_'):
    print(f"Classes: {model.classes_}")

if hasattr(model, 'predict_proba'):
    print("Has predict_proba: YES")
else:
    print("Has predict_proba: NO")
