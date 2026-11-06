"""
XGBoost Production Training Script for UPI Fraud Detection

This script trains a production-ready XGBoost model with:
- Proper train/validation/test split
- Threshold optimization on validation set
- Final evaluation on untouched test set
- Comprehensive metrics including PR-AUC
- Strict validation and artifact saving
"""

import pandas as pd
import numpy as np
import json
import joblib
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split, RandomizedSearchCV, StratifiedKFold
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, 
    roc_auc_score, confusion_matrix, classification_report,
    roc_curve, precision_recall_curve, auc
)
from xgboost import XGBClassifier

# Configuration
RANDOM_STATE = 42
DATA_PATH = Path('dataset/upi_fraud_dataset_behavioral_v2.csv')
MODELS_DIR = Path('models')
MODELS_DIR.mkdir(exist_ok=True)

print("=" * 80)
print("XGBoost PRODUCTION TRAINING - UPI FRAUD DETECTION")
print("=" * 80)

# Record version information
print("\n" + "=" * 80)
print("VERSION INFORMATION")
print("=" * 80)
import sys
import sklearn
import xgboost as xgb
print(f"Python: {sys.version}")
print(f"scikit-learn: {sklearn.__version__}")
print(f"xgboost: {xgb.__version__}")
print(f"pandas: {pd.__version__}")
print(f"numpy: {np.__version__}")
print(f"joblib: {joblib.__version__}")

version_info = {
    "python": sys.version,
    "scikit-learn": sklearn.__version__,
    "xgboost": xgb.__version__,
    "pandas": pd.__version__,
    "numpy": np.__version__,
    "joblib": joblib.__version__
}

# Load dataset
print("\n" + "=" * 80)
print("STEP 1: LOAD DATASET")
print("=" * 80)
df = pd.read_csv(DATA_PATH)
print(f"Dataset shape: {df.shape}")
print(f"Fraud rate: {df['is_fraud'].mean():.4%}")
print(f"Target distribution:\n{df['is_fraud'].value_counts().rename(index={0: 'Legit', 1: 'Fraud'})}")

# Preprocessing function (exact same as existing pipeline)
def preprocess_data(df):
    """
    Preprocess the UPI fraud dataset - exact same logic as existing pipeline.
    """
    target_column = 'is_fraud'
    identifier_columns = [
        'transaction_id', 'customer_id', 'sender_upi', 
        'receiver_upi', 'device_id', 'ip_address', 'fraud_type'
    ]
    
    available_identifier_columns = [col for col in identifier_columns if col in df.columns]
    data = df.drop(columns=available_identifier_columns).copy()
    
    y = data[target_column].copy()
    X = data.drop(columns=[target_column]).copy()
    
    # Extract datetime features
    transaction_date = pd.to_datetime(X['transaction_date'], errors='coerce')
    X['transaction_dayofweek'] = transaction_date.dt.dayofweek
    X['transaction_day'] = transaction_date.dt.day
    X['transaction_month'] = transaction_date.dt.month
    X['transaction_year'] = transaction_date.dt.year
    X['transaction_hour'] = pd.to_datetime(X['transaction_time'], format='%H:%M:%S', errors='coerce').dt.hour
    X = X.drop(columns=['transaction_date', 'transaction_time'])
    
    # Handle missing values
    categorical_columns = X.select_dtypes(include=['object', 'bool']).columns.tolist()
    numeric_columns = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
    
    for column in categorical_columns:
        if column == 'merchant_category':
            X[column] = X[column].fillna('P2P')
        else:
            X[column] = X[column].fillna('NONE')
    
    for column in numeric_columns:
        X[column] = X[column].fillna(X[column].median())
    
    # One-hot encode categorical features
    X_encoded = pd.get_dummies(X, columns=categorical_columns, drop_first=False)
    feature_columns = X_encoded.columns.tolist()
    
    return X_encoded, y, feature_columns

# Apply preprocessing
print("\n" + "=" * 80)
print("STEP 2: PREPROCESSING")
print("=" * 80)
X_encoded, y, feature_columns = preprocess_data(df)
print(f"Processed feature shape: {X_encoded.shape}")
print(f"Expected feature count: 76")
print(f"Actual feature count: {len(feature_columns)}")
print(f"Feature count matches: {len(feature_columns) == 76}")

# Train/Validation/Test Split (60/20/20)
print("\n" + "=" * 80)
print("STEP 3: TRAIN/VALIDATION/TEST SPLIT")
print("=" * 80)
# First split: 80% train+val, 20% test
X_temp, X_test, y_temp, y_test = train_test_split(
    X_encoded, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
)
# Second split: 75% train, 25% val (of the 80% = 60% total, 20% total)
X_train, X_val, y_train, y_val = train_test_split(
    X_temp, y_temp, test_size=0.25, random_state=RANDOM_STATE, stratify=y_temp
)

print(f"X_train shape: {X_train.shape} ({len(X_train)/len(df)*100:.1f}%)")
print(f"X_val shape: {X_val.shape} ({len(X_val)/len(df)*100:.1f}%)")
print(f"X_test shape: {X_test.shape} ({len(X_test)/len(df)*100:.1f}%)")
print(f"y_train fraud rate: {y_train.mean():.4%}")
print(f"y_val fraud rate: {y_val.mean():.4%}")
print(f"y_test fraud rate: {y_test.mean():.4%}")

# Calculate scale_pos_weight for class imbalance
scale_pos_weight = (y_train == 0).sum() / (y_train == 1).sum()
print(f"Scale positive weight: {scale_pos_weight:.2f}")

# Hyperparameter tuning with RandomizedSearchCV
print("\n" + "=" * 80)
print("STEP 4: HYPERPARAMETER TUNING")
print("=" * 80)
param_distributions = {
    'n_estimators': [200, 300, 400, 500],
    'max_depth': [4, 5, 6, 7, 8],
    'learning_rate': [0.05, 0.1, 0.15],
    'min_child_weight': [1, 2, 3, 4],
    'gamma': [0, 0.1, 0.2, 0.3],
    'subsample': [0.7, 0.8, 0.9, 1.0],
    'colsample_bytree': [0.7, 0.8, 0.9, 1.0],
    'reg_alpha': [0, 0.01, 0.1, 1],
    'reg_lambda': [0.01, 0.1, 1, 10]
}

xgb_base = XGBClassifier(
    tree_method='hist',
    random_state=RANDOM_STATE,
    n_jobs=-1,
    eval_metric='logloss',
    scale_pos_weight=scale_pos_weight
)

stratified_cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)

random_search = RandomizedSearchCV(
    estimator=xgb_base,
    param_distributions=param_distributions,
    n_iter=50,
    cv=stratified_cv,
    scoring='f1',
    n_jobs=-1,
    random_state=RANDOM_STATE,
    verbose=1
)

print("Starting hyperparameter tuning...")
random_search.fit(X_train, y_train)

print(f"\nBest CV F1 Score: {random_search.best_score_:.4f}")
print(f"\nBest Hyperparameters:")
best_params = random_search.best_params_
for param, value in best_params.items():
    print(f"  {param}: {value}")

# Train final model with best parameters
print("\n" + "=" * 80)
print("STEP 5: TRAIN FINAL MODEL")
print("=" * 80)
best_xgb = XGBClassifier(
    **best_params,
    tree_method='hist',
    random_state=RANDOM_STATE,
    n_jobs=-1,
    eval_metric='logloss',
    scale_pos_weight=scale_pos_weight
)

best_xgb.fit(X_train, y_train)
print("Model training completed.")

# Threshold optimization on VALIDATION set
print("\n" + "=" * 80)
print("STEP 6: THRESHOLD OPTIMIZATION (ON VALIDATION SET)")
print("=" * 80)
y_val_proba = best_xgb.predict_proba(X_val)[:, 1]

# Test thresholds from 0.25 to 0.65
thresholds = np.arange(0.25, 0.66, 0.05)
threshold_results = []

for threshold in thresholds:
    y_val_pred_thresh = (y_val_proba >= threshold).astype(int)
    precision = precision_score(y_val, y_val_pred_thresh, zero_division=0)
    recall = recall_score(y_val, y_val_pred_thresh, zero_division=0)
    f1 = f1_score(y_val, y_val_pred_thresh, zero_division=0)
    
    threshold_results.append({
        'Threshold': threshold,
        'Precision': precision,
        'Recall': recall,
        'F1 Score': f1
    })

threshold_df = pd.DataFrame(threshold_results)
print('Threshold Optimization Results (Validation Set):')
print(threshold_df.to_string(index=False))

# Select best threshold based on F1 score
best_threshold_row = threshold_df.loc[threshold_df['F1 Score'].idxmax()]
best_threshold = best_threshold_row['Threshold']
print(f'\nBest Threshold (from validation): {best_threshold:.2f}')
print(f'Best Validation F1 Score: {best_threshold_row["F1 Score"]:.4f}')

# Final evaluation on TEST set (unseen during training and threshold selection)
print("\n" + "=" * 80)
print("STEP 7: FINAL EVALUATION ON TEST SET")
print("=" * 80)
y_test_proba = best_xgb.predict_proba(X_test)[:, 1]
y_test_pred = (y_test_proba >= best_threshold).astype(int)

# Calculate all metrics
test_metrics = {
    'Accuracy': accuracy_score(y_test, y_test_pred),
    'Precision': precision_score(y_test, y_test_pred, zero_division=0),
    'Recall': recall_score(y_test, y_test_pred, zero_division=0),
    'F1 Score': f1_score(y_test, y_test_pred, zero_division=0),
    'ROC-AUC': roc_auc_score(y_test, y_test_proba),
}

# Calculate PR-AUC
precision_vals, recall_vals, _ = precision_recall_curve(y_test, y_test_proba)
pr_auc = auc(recall_vals, precision_vals)
test_metrics['PR-AUC'] = pr_auc

print('\nFinal Test Set Metrics:')
for metric, value in test_metrics.items():
    print(f'  {metric}: {value:.4f}')

print('\nClassification Report (Test Set):')
print(classification_report(y_test, y_test_pred, zero_division=0))

# Confusion Matrix
cm = confusion_matrix(y_test, y_test_pred)
print('\nConfusion Matrix (Test Set):')
print(cm)
print(f'True Negatives: {cm[0,0]}, False Positives: {cm[0,1]}')
print(f'False Negatives: {cm[1,0]}, True Positives: {cm[1,1]}')

# Save artifacts
print("\n" + "=" * 80)
print("STEP 8: SAVE PRODUCTION ARTIFACTS")
print("=" * 80)

# Save the XGBoost model
model_path = MODELS_DIR / 'best_xgboost_model.joblib'
joblib.dump(best_xgb, model_path)
print(f'✓ Saved XGBoost model to: {model_path}')

# Save feature columns
feature_columns_path = MODELS_DIR / 'feature_columns.joblib'
joblib.dump(feature_columns, feature_columns_path)
print(f'✓ Saved feature columns to: {feature_columns_path}')

# Save threshold and metadata
metadata = {
    'model_type': 'XGBoost',
    'model_class': 'XGBClassifier',
    'optimal_threshold': float(best_threshold),
    'thresholds_tested': thresholds.tolist(),
    'threshold_results': threshold_results,
    'test_metrics': {k: float(v) for k, v in test_metrics.items()},
    'confusion_matrix': cm.tolist(),
    'feature_count': len(feature_columns),
    'random_state': RANDOM_STATE,
    'scale_pos_weight': float(scale_pos_weight),
    'best_params': best_params,
    'version_info': version_info,
    'dataset_shape': df.shape,
    'train_shape': X_train.shape,
    'val_shape': X_val.shape,
    'test_shape': X_test.shape
}

metadata_path = MODELS_DIR / 'xgboost_metadata.json'
with open(metadata_path, 'w') as f:
    json.dump(metadata, f, indent=2)
print(f'✓ Saved metadata to: {metadata_path}')

print("\n" + "=" * 80)
print("TRAINING COMPLETED SUCCESSFULLY")
print("=" * 80)
print(f"\nModel saved as: {model_path}")
print(f"Feature count: {len(feature_columns)}")
print(f"Model class: {type(best_xgb).__name__}")
print(f"Optimal threshold: {best_threshold:.2f}")
print(f"Test F1 Score: {test_metrics['F1 Score']:.4f}")
print(f"Test ROC-AUC: {test_metrics['ROC-AUC']:.4f}")
print(f"Test PR-AUC: {test_metrics['PR-AUC']:.4f}")
