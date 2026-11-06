"""
Model Comparison Script for UPI Fraud Detection

This script trains and compares 7 different ML models using the same
preprocessing, train/validation/test split, and evaluation methodology
as the production XGBoost model.

Models compared:
1. Logistic Regression
2. Random Forest
3. Extra Trees
4. HistGradientBoosting
5. XGBoost
6. LightGBM
7. CatBoost

TabPFN is excluded due to compatibility issues.

All models use:
- Same dataset (100,000 transactions, 5% fraud)
- Same preprocessing (76 features)
- Same train/validation/test split (60/20/20)
- Same random_state (42)
- Same threshold optimization on validation set
- Same final evaluation on test set
"""

import pandas as pd
import numpy as np
import json
import joblib
import time
from pathlib import Path
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, 
    roc_auc_score, confusion_matrix, classification_report,
    roc_curve, precision_recall_curve, auc
)
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier, HistGradientBoostingClassifier
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from catboost import CatBoostClassifier

# Configuration
RANDOM_STATE = 42
DATA_PATH = Path('dataset/upi_fraud_dataset_behavioral_v2.csv')
MODELS_DIR = Path('models')
BENCHMARK_DIR = MODELS_DIR / 'benchmark'
BENCHMARK_DIR.mkdir(exist_ok=True, parents=True)

print("=" * 80)
print("MODEL COMPARISON - UPI FRAUD DETECTION")
print("=" * 80)
print(f"Timestamp: {datetime.now().isoformat()}")
print(f"Random State: {RANDOM_STATE}")
print(f"Benchmark Directory: {BENCHMARK_DIR}")
print()

# Record version information
print("=" * 80)
print("VERSION INFORMATION")
print("=" * 80)
import sys
import sklearn
import xgboost as xgb
import lightgbm as lgb
import catboost as cb
print(f"Python: {sys.version}")
print(f"scikit-learn: {sklearn.__version__}")
print(f"xgboost: {xgb.__version__}")
print(f"lightgbm: {lgb.__version__}")
print(f"catboost: {cb.__version__}")
print(f"pandas: {pd.__version__}")
print(f"numpy: {np.__version__}")
print(f"joblib: {joblib.__version__}")

version_info = {
    "python": sys.version,
    "scikit-learn": sklearn.__version__,
    "xgboost": xgb.__version__,
    "lightgbm": lgb.__version__,
    "catboost": cb.__version__,
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

# Preprocessing function (exact same as production pipeline)
def preprocess_data(df):
    """
    Preprocess the UPI fraud dataset - exact same logic as production pipeline.
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
print(f"Feature count: {len(feature_columns)}")
print(f"Expected feature count: 76")
print(f"Feature count matches: {len(feature_columns) == 76}")

# Save feature columns
feature_columns_path = BENCHMARK_DIR / 'feature_columns.joblib'
joblib.dump(feature_columns, feature_columns_path)
print(f"Saved feature columns to: {feature_columns_path}")

# Train/Validation/Test Split (60/20/20) - same as production
print("\n" + "=" * 80)
print("STEP 3: TRAIN/VALIDATION/TEST SPLIT (60/20/20)")
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

# Calculate class weight for imbalanced data
scale_pos_weight = (y_train == 0).sum() / (y_train == 1).sum()
print(f"Scale positive weight: {scale_pos_weight:.2f}")

# Define models with reasonable hyperparameters
print("\n" + "=" * 80)
print("STEP 4: DEFINE MODELS")
print("=" * 80)

models_config = {
    'Logistic Regression': {
        'model': LogisticRegression(
            max_iter=5000,
            solver='liblinear',
            class_weight='balanced',
            random_state=RANDOM_STATE,
            n_jobs=-1
        ),
        'tunable': False
    },
    'Random Forest': {
        'model': RandomForestClassifier(
            n_estimators=200,
            max_depth=10,
            min_samples_split=10,
            min_samples_leaf=5,
            class_weight='balanced',
            random_state=RANDOM_STATE,
            n_jobs=-1
        ),
        'tunable': True
    },
    'Extra Trees': {
        'model': ExtraTreesClassifier(
            n_estimators=200,
            max_depth=10,
            min_samples_split=10,
            min_samples_leaf=5,
            class_weight='balanced',
            random_state=RANDOM_STATE,
            n_jobs=-1
        ),
        'tunable': True
    },
    'HistGradientBoosting': {
        'model': HistGradientBoostingClassifier(
            max_iter=200,
            max_depth=6,
            learning_rate=0.1,
            random_state=RANDOM_STATE
        ),
        'tunable': False
    },
    'XGBoost': {
        'model': XGBClassifier(
            n_estimators=300,
            max_depth=6,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=RANDOM_STATE,
            n_jobs=-1,
            eval_metric='logloss',
            scale_pos_weight=scale_pos_weight,
            tree_method='hist'
        ),
        'tunable': True
    },
    'LightGBM': {
        'model': LGBMClassifier(
            n_estimators=300,
            max_depth=6,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=RANDOM_STATE,
            n_jobs=-1,
            class_weight='balanced',
            verbose=-1
        ),
        'tunable': True
    },
    'CatBoost': {
        'model': CatBoostClassifier(
            iterations=300,
            depth=6,
            learning_rate=0.05,
            random_seed=RANDOM_STATE,
            class_weights=[1, scale_pos_weight],
            verbose=False,
            allow_writing_files=False
        ),
        'tunable': True
    }
}

print(f"Models to compare: {len(models_config)}")
for name, config in models_config.items():
    print(f"  - {name}")

# Threshold optimization function
def optimize_threshold(y_true, y_proba):
    """Find optimal threshold on validation set using F1 score."""
    thresholds = np.arange(0.25, 0.66, 0.05)
    best_threshold = 0.5
    best_f1 = 0
    
    for threshold in thresholds:
        y_pred = (y_proba >= threshold).astype(int)
        f1 = f1_score(y_true, y_pred, zero_division=0)
        if f1 > best_f1:
            best_f1 = f1
            best_threshold = threshold
    
    return best_threshold, best_f1

# Train and evaluate each model
print("\n" + "=" * 80)
print("STEP 5: TRAIN AND EVALUATE MODELS")
print("=" * 80)

results = []

for model_name, config in models_config.items():
    print(f"\n{'=' * 80}")
    print(f"Training: {model_name}")
    print('=' * 80)
    
    model = config['model']
    
    # Train model
    start_time = time.time()
    model.fit(X_train, y_train)
    training_time = time.time() - start_time
    print(f"Training time: {training_time:.2f} seconds")
    
    # Get validation probabilities
    start_time = time.time()
    if hasattr(model, 'predict_proba'):
        y_val_proba = model.predict_proba(X_val)[:, 1]
    else:
        y_val_proba = model.predict(X_val)
        y_val_proba = np.clip(y_val_proba, 0, 1)
    inference_time_val = time.time() - start_time
    
    # Optimize threshold on validation set
    optimal_threshold, val_f1 = optimize_threshold(y_val, y_val_proba)
    print(f"Optimal threshold (validation): {optimal_threshold:.2f}")
    print(f"Validation F1 at optimal threshold: {val_f1:.4f}")
    
    # Evaluate on test set
    start_time = time.time()
    if hasattr(model, 'predict_proba'):
        y_test_proba = model.predict_proba(X_test)[:, 1]
    else:
        y_test_proba = model.predict(X_test)
        y_test_proba = np.clip(y_test_proba, 0, 1)
    inference_time_test = time.time() - start_time
    
    y_test_pred = (y_test_proba >= optimal_threshold).astype(int)
    
    # Calculate metrics
    accuracy = accuracy_score(y_test, y_test_pred)
    precision = precision_score(y_test, y_test_pred, zero_division=0)
    recall = recall_score(y_test, y_test_pred, zero_division=0)
    f1 = f1_score(y_test, y_test_pred, zero_division=0)
    roc_auc = roc_auc_score(y_test, y_test_proba)
    
    # Calculate PR-AUC
    precision_vals, recall_vals, _ = precision_recall_curve(y_test, y_test_proba)
    pr_auc = auc(recall_vals, precision_vals)
    
    # Confusion matrix
    cm = confusion_matrix(y_test, y_test_pred)
    tn, fp, fn, tp = cm.ravel()
    
    print(f"\nTest Set Metrics:")
    print(f"  Accuracy: {accuracy:.4f}")
    print(f"  Precision: {precision:.4f}")
    print(f"  Recall: {recall:.4f}")
    print(f"  F1 Score: {f1:.4f}")
    print(f"  ROC-AUC: {roc_auc:.4f}")
    print(f"  PR-AUC: {pr_auc:.4f}")
    print(f"  False Positives: {fp}")
    print(f"  False Negatives: {fn}")
    print(f"  Inference Time: {inference_time_test:.4f} seconds")
    
    # Save model
    model_filename = model_name.lower().replace(' ', '_') + '.joblib'
    model_path = BENCHMARK_DIR / model_filename
    joblib.dump(model, model_path)
    print(f"Saved model to: {model_path}")
    
    # Store results
    results.append({
        'Model': model_name,
        'Accuracy': accuracy,
        'Precision': precision,
        'Recall': recall,
        'F1': f1,
        'ROC-AUC': roc_auc,
        'PR-AUC': pr_auc,
        'False Positives': int(fp),
        'False Negatives': int(fn),
        'Threshold': float(optimal_threshold),
        'Training Time (s)': training_time,
        'Inference Time (s)': inference_time_test,
        'True Positives': int(tp),
        'True Negatives': int(tn),
        'Validation F1': val_f1
    })

# Create comparison DataFrame
print("\n" + "=" * 80)
print("STEP 6: MODEL COMPARISON RESULTS")
print("=" * 80)

comparison_df = pd.DataFrame(results)
comparison_df = comparison_df.sort_values(by=['PR-AUC', 'F1', 'Recall'], ascending=False).reset_index(drop=True)

print("\nModel Comparison (sorted by PR-AUC, F1, Recall):")
print(comparison_df.to_string(index=False))

# Save comparison metrics as CSV
csv_path = BENCHMARK_DIR / 'model_comparison_metrics.csv'
comparison_df.to_csv(csv_path, index=False)
print(f"\nSaved comparison metrics to: {csv_path}")

# Save detailed report as JSON
report = {
    'timestamp': datetime.now().isoformat(),
    'version_info': version_info,
    'dataset_info': {
        'shape': df.shape,
        'fraud_rate': float(df['is_fraud'].mean()),
        'train_size': len(X_train),
        'val_size': len(X_val),
        'test_size': len(X_test),
        'feature_count': len(feature_columns)
    },
    'split_info': {
        'train_ratio': 0.6,
        'val_ratio': 0.2,
        'test_ratio': 0.2,
        'random_state': RANDOM_STATE
    },
    'models': results,
    'comparison': comparison_df.to_dict(orient='records')
}

report_path = BENCHMARK_DIR / 'model_comparison_report.json'
with open(report_path, 'w') as f:
    json.dump(report, f, indent=2)
print(f"Saved detailed report to: {report_path}")

# Select provisional best model
print("\n" + "=" * 80)
print("STEP 7: PROVISIONAL BEST MODEL SELECTION")
print("=" * 80)

best_model_row = comparison_df.iloc[0]
best_model_name = best_model_row['Model']

print(f"\nProvisional Best Model: {best_model_name}")
print(f"\nPerformance Metrics:")
print(f"  PR-AUC: {best_model_row['PR-AUC']:.4f}")
print(f"  F1 Score: {best_model_row['F1']:.4f}")
print(f"  Recall: {best_model_row['Recall']:.4f}")
print(f"  Precision: {best_model_row['Precision']:.4f}")
print(f"  ROC-AUC: {best_model_row['ROC-AUC']:.4f}")
print(f"  Accuracy: {best_model_row['Accuracy']:.4f}")
print(f"  Threshold: {best_model_row['Threshold']:.2f}")
print(f"  False Positives: {best_model_row['False Positives']}")
print(f"  False Negatives: {best_model_row['False Negatives']}")
print(f"  Training Time: {best_model_row['Training Time (s)']:.2f}s")
print(f"  Inference Time: {best_model_row['Inference Time (s)']:.4f}s")

print("\nTrade-offs Analysis:")
print(f"  - {best_model_name} has the highest PR-AUC, which is critical for imbalanced fraud detection")
print(f"  - F1 Score balances precision and recall")
print(f"  - Recall indicates ability to catch fraud (minimize false negatives)")
print(f"  - Precision indicates ability to avoid false alarms (minimize false positives)")
print(f"  - Inference time affects real-time prediction performance")

# Compare with current production XGBoost
print("\n" + "=" * 80)
print("STEP 8: COMPARISON WITH CURRENT PRODUCTION XGBOOST")
print("=" * 80)

production_xgb_row = comparison_df[comparison_df['Model'] == 'XGBoost']
if not production_xgb_row.empty:
    prod_xgb = production_xgb_row.iloc[0]
    print(f"\nCurrent Production XGBoost Performance:")
    print(f"  PR-AUC: {prod_xgb['PR-AUC']:.4f}")
    print(f"  F1 Score: {prod_xgb['F1']:.4f}")
    print(f"  Recall: {prod_xgb['Recall']:.4f}")
    print(f"  Precision: {prod_xgb['Precision']:.4f}")
    print(f"  ROC-AUC: {prod_xgb['ROC-AUC']:.4f}")
    
    if best_model_name != 'XGBoost':
        print(f"\n{best_model_name} vs Production XGBoost:")
        pr_auc_diff = best_model_row['PR-AUC'] - prod_xgb['PR-AUC']
        f1_diff = best_model_row['F1'] - prod_xgb['F1']
        recall_diff = best_model_row['Recall'] - prod_xgb['Recall']
        
        print(f"  PR-AUC difference: {pr_auc_diff:+.4f}")
        print(f"  F1 Score difference: {f1_diff:+.4f}")
        print(f"  Recall difference: {recall_diff:+.4f}")
        
        if pr_auc_diff > 0.01:
            print(f"  → {best_model_name} shows meaningful improvement in PR-AUC")
        elif pr_auc_diff < -0.01:
            print(f"  → Production XGBoost performs better in PR-AUC")
        else:
            print(f"  → Performance is comparable (PR-AUC difference < 0.01)")
    else:
        print(f"\nProduction XGBoost remains the best model based on current comparison")
else:
    print("XGBoost not found in comparison results")

# Final summary
print("\n" + "=" * 80)
print("BENCHMARKING COMPLETE")
print("=" * 80)
print(f"\nModels successfully trained: {len(results)}")
print(f"Models failed: 0")
print(f"\nFiles created:")
print(f"  - {csv_path}")
print(f"  - {report_path}")
print(f"  - {BENCHMARK_DIR / 'feature_columns.joblib'}")
for model_name in models_config.keys():
    model_filename = model_name.lower().replace(' ', '_') + '.joblib'
    print(f"  - {BENCHMARK_DIR / model_filename}")

print(f"\nIMPORTANT:")
print(f"  - Production model (models/best_xgboost_model.joblib) was NOT modified")
print(f"  - Production metadata (models/xgboost_metadata.json) was NOT modified")
print(f"  - All benchmark models saved to: {BENCHMARK_DIR}")
print(f"  - Provisional best model: {best_model_name}")
print(f"  - DO NOT deploy until review and approval")

print("\n" + "=" * 80)
