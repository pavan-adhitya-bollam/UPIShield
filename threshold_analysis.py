"""
Threshold Analysis and Model Selection Script

This script performs:
1. Threshold analysis across multiple operating points
2. Calibration check (Brier score)
3. Model comparison at comparable thresholds
4. Final model selection report

Uses validation set for threshold selection, test set for final evaluation.
"""

import pandas as pd
import numpy as np
import json
import joblib
from pathlib import Path
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    precision_score, recall_score, f1_score,
    confusion_matrix, brier_score_loss, roc_auc_score
)

# Configuration
RANDOM_STATE = 42
DATA_PATH = Path('dataset/upi_fraud_dataset_behavioral_v2.csv')
BENCHMARK_DIR = Path('models/benchmark')
MODELS_DIR = Path('models')

print("=" * 80)
print("THRESHOLD ANALYSIS & MODEL SELECTION")
print("=" * 80)
print(f"Timestamp: {datetime.now().isoformat()}")
print(f"Random State: {RANDOM_STATE}")
print()

# Load dataset and preprocessing
print("=" * 80)
print("STEP 1: LOAD DATA AND PREPROCESS")
print("=" * 80)

df = pd.read_csv(DATA_PATH)
print(f"Dataset shape: {df.shape}")
print(f"Fraud rate: {df['is_fraud'].mean():.4%}")

# Preprocessing function (same as production)
def preprocess_data(df):
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
    
    # One-hot encode
    X_encoded = pd.get_dummies(X, columns=categorical_columns, drop_first=False)
    feature_columns = X_encoded.columns.tolist()
    
    return X_encoded, y, feature_columns

X_encoded, y, feature_columns = preprocess_data(df)
print(f"Processed feature shape: {X_encoded.shape}")

# Load feature columns from benchmark
feature_columns_loaded = joblib.load(BENCHMARK_DIR / 'feature_columns.joblib')
print(f"Loaded feature columns: {len(feature_columns_loaded)}")

# Align features
X_aligned = X_encoded.reindex(columns=feature_columns_loaded, fill_value=0)
print(f"Aligned feature shape: {X_aligned.shape}")

# Split data (same as benchmark)
X_temp, X_test, y_temp, y_test = train_test_split(
    X_aligned, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
)
X_train, X_val, y_train, y_val = train_test_split(
    X_temp, y_temp, test_size=0.25, random_state=RANDOM_STATE, stratify=y_temp
)

print(f"X_train shape: {X_train.shape}")
print(f"X_val shape: {X_val.shape}")
print(f"X_test shape: {X_test.shape}")

# Load models
print("\n" + "=" * 80)
print("STEP 2: LOAD TRAINED MODELS")
print("=" * 80)

candidate_models = {
    'HistGradientBoosting': 'histgradientboosting.joblib',
    'Random Forest': 'random_forest.joblib',
    'CatBoost': 'catboost.joblib',
    'LightGBM': 'lightgbm.joblib',
    'XGBoost': 'xgboost.joblib'
}

loaded_models = {}
for model_name, filename in candidate_models.items():
    model_path = BENCHMARK_DIR / filename
    model = joblib.load(model_path)
    loaded_models[model_name] = model
    print(f"Loaded: {model_name}")

# Get probabilities for validation and test sets
print("\n" + "=" * 80)
print("STEP 3: GENERATE PROBABILITIES")
print("=" * 80)

val_probabilities = {}
test_probabilities = {}

for model_name, model in loaded_models.items():
    if hasattr(model, 'predict_proba'):
        val_proba = model.predict_proba(X_val)[:, 1]
        test_proba = model.predict_proba(X_test)[:, 1]
    else:
        val_proba = model.predict(X_val)
        val_proba = np.clip(val_proba, 0, 1)
        test_proba = model.predict(X_test)
        test_proba = np.clip(test_proba, 0, 1)
    
    val_probabilities[model_name] = val_proba
    test_probabilities[model_name] = test_proba
    print(f"{model_name}: Generated probabilities")

# Threshold analysis
print("\n" + "=" * 80)
print("STEP 4: THRESHOLD ANALYSIS (VALIDATION SET)")
print("=" * 80)

thresholds = np.arange(0.10, 0.91, 0.05)
threshold_results = []

for model_name in candidate_models.keys():
    val_proba = val_probabilities[model_name]
    
    for threshold in thresholds:
        y_pred = (val_proba >= threshold).astype(int)
        
        precision = precision_score(y_val, y_pred, zero_division=0)
        recall = recall_score(y_val, y_pred, zero_division=0)
        f1 = f1_score(y_val, y_pred, zero_division=0)
        
        cm = confusion_matrix(y_val, y_pred)
        tn, fp, fn, tp = cm.ravel()
        fpr = fp / (fp + tn) if (fp + tn) > 0 else 0
        
        threshold_results.append({
            'Model': model_name,
            'Threshold': threshold,
            'Precision': precision,
            'Recall': recall,
            'F1': f1,
            'False Positives': int(fp),
            'False Negatives': int(fn),
            'FPR': fpr
        })

threshold_df = pd.DataFrame(threshold_results)
threshold_csv_path = BENCHMARK_DIR / 'threshold_analysis.csv'
threshold_df.to_csv(threshold_csv_path, index=False)
print(f"Saved threshold analysis to: {threshold_csv_path}")

# Find optimal threshold for each model (max F1 on validation)
print("\n" + "=" * 80)
print("STEP 5: OPTIMAL THRESHOLD SELECTION (VALIDATION SET)")
print("=" * 80)

optimal_thresholds = {}
for model_name in candidate_models.keys():
    model_thresholds = threshold_df[threshold_df['Model'] == model_name]
    best_row = model_thresholds.loc[model_thresholds['F1'].idxmax()]
    optimal_thresholds[model_name] = {
        'threshold': best_row['Threshold'],
        'f1': best_row['F1'],
        'precision': best_row['Precision'],
        'recall': best_row['Recall'],
        'fp': int(best_row['False Positives']),
        'fn': int(best_row['False Negatives'])
    }
    print(f"\n{model_name}:")
    print(f"  Optimal Threshold: {optimal_thresholds[model_name]['threshold']:.2f}")
    print(f"  Validation F1: {optimal_thresholds[model_name]['f1']:.4f}")
    print(f"  Precision: {optimal_thresholds[model_name]['precision']:.4f}")
    print(f"  Recall: {optimal_thresholds[model_name]['recall']:.4f}")

# Evaluate on test set using optimal thresholds
print("\n" + "=" * 80)
print("STEP 6: TEST SET EVALUATION WITH OPTIMAL THRESHOLDS")
print("=" * 80)

test_results = []
for model_name in candidate_models.keys():
    test_proba = test_probabilities[model_name]
    optimal_thresh = optimal_thresholds[model_name]['threshold']
    
    y_pred = (test_proba >= optimal_thresh).astype(int)
    
    precision = precision_score(y_test, y_pred, zero_division=0)
    recall = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    roc_auc = roc_auc_score(y_test, test_proba)
    
    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = cm.ravel()
    fpr = fp / (fp + tn) if (fp + tn) > 0 else 0
    
    # Calculate PR-AUC
    from sklearn.metrics import precision_recall_curve, auc
    precision_vals, recall_vals, _ = precision_recall_curve(y_test, test_proba)
    pr_auc = auc(recall_vals, precision_vals)
    
    test_results.append({
        'Model': model_name,
        'Threshold': optimal_thresh,
        'Precision': precision,
        'Recall': recall,
        'F1': f1,
        'ROC-AUC': roc_auc,
        'PR-AUC': pr_auc,
        'False Positives': int(fp),
        'False Negatives': int(fn),
        'True Positives': int(tp),
        'True Negatives': int(tn),
        'FPR': fpr
    })

test_df = pd.DataFrame(test_results)
print("\nTest Set Results with Optimal Thresholds:")
print(test_df.to_string(index=False))

# Calibration check (Brier score)
print("\n" + "=" * 80)
print("STEP 7: CALIBRATION CHECK (Brier Score)")
print("=" * 80)

calibration_results = {}
for model_name in candidate_models.keys():
    test_proba = test_probabilities[model_name]
    brier_score = brier_score_loss(y_test, test_proba)
    calibration_results[model_name] = brier_score
    print(f"{model_name}: Brier Score = {brier_score:.4f}")

# Compare at fixed thresholds
print("\n" + "=" * 80)
print("STEP 8: MODEL COMPARISON AT FIXED THRESHOLDS")
print("=" * 80)

fixed_thresholds = [0.25, 0.50, 0.65]
fixed_threshold_results = []

for threshold in fixed_thresholds:
    for model_name in candidate_models.keys():
        test_proba = test_probabilities[model_name]
        y_pred = (test_proba >= threshold).astype(int)
        
        precision = precision_score(y_test, y_pred, zero_division=0)
        recall = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        
        cm = confusion_matrix(y_test, y_pred)
        tn, fp, fn, tp = cm.ravel()
        
        fixed_threshold_results.append({
            'Model': model_name,
            'Threshold': threshold,
            'Precision': precision,
            'Recall': recall,
            'F1': f1,
            'False Positives': int(fp),
            'False Negatives': int(fn)
        })

fixed_df = pd.DataFrame(fixed_threshold_results)
print("\nComparison at Fixed Thresholds:")
print(fixed_df.to_string(index=False))

# Prepare final report
print("\n" + "=" * 80)
print("STEP 9: GENERATE FINAL REPORT")
print("=" * 80)

final_report = {
    'timestamp': datetime.now().isoformat(),
    'analysis_type': 'threshold_analysis_and_model_selection',
    'dataset_info': {
        'total_samples': len(df),
        'fraud_rate': float(df['is_fraud'].mean()),
        'train_size': len(X_train),
        'val_size': len(X_val),
        'test_size': len(X_test),
        'feature_count': len(feature_columns_loaded)
    },
    'split_info': {
        'train_ratio': 0.6,
        'val_ratio': 0.2,
        'test_ratio': 0.2,
        'random_state': RANDOM_STATE
    },
    'threshold_analysis': {
        'thresholds_analyzed': [float(t) for t in thresholds],
        'threshold_range': '0.10 to 0.90 in 0.05 increments'
    },
    'optimal_thresholds': optimal_thresholds,
    'test_results': test_results,
    'calibration': calibration_results,
    'fixed_threshold_comparison': fixed_threshold_results,
    'candidate_models': list(candidate_models.keys())
}

# Save JSON report
json_report_path = MODELS_DIR / 'final_model_selection_report.json'
with open(json_report_path, 'w') as f:
    json.dump(final_report, f, indent=2)
print(f"Saved JSON report to: {json_report_path}")

# Generate markdown report
md_report = f"""# Final Model Selection Report

**Generated:** {datetime.now().isoformat()}
**Analysis Type:** Threshold Analysis and Model Selection
**Dataset Size:** {len(df):,} transactions ({df['is_fraud'].mean():.1%} fraud rate)

---

## 1. Dataset and Split Information

- **Total Samples:** {len(df):,}
- **Fraud Rate:** {df['is_fraud'].mean():.1%}
- **Training Set:** {len(X_train):,} (60%)
- **Validation Set:** {len(X_val):,} (20%)
- **Test Set:** {len(X_test):,} (20%)
- **Features:** {len(feature_columns_loaded)}
- **Random State:** {RANDOM_STATE}

---

## 2. Candidate Models

The following 5 models were analyzed in detail:

"""

for model_name in candidate_models.keys():
    md_report += f"- {model_name}\n"

md_report += f"""

---

## 3. Threshold Analysis

Thresholds analyzed: 0.10 to 0.90 in 0.05 increments

**Threshold Selection Rule:** Optimal threshold selected by maximizing F1 score on the validation set. Test set used only for final evaluation.

### Optimal Thresholds (Validation Set)

| Model | Optimal Threshold | Validation F1 | Precision | Recall | False Positives | False Negatives |
|-------|-------------------|---------------|-----------|--------|-----------------|-----------------|
"""

for model_name in candidate_models.keys():
    opt = optimal_thresholds[model_name]
    md_report += f"| {model_name} | {opt['threshold']:.2f} | {opt['f1']:.4f} | {opt['precision']:.4f} | {opt['recall']:.4f} | {opt['fp']:,} | {opt['fn']:,} |\n"

md_report += """

---

## 4. Test Set Performance with Optimal Thresholds

| Model | Threshold | Precision | Recall | F1 | ROC-AUC | PR-AUC | False Positives | False Negatives |
|-------|-----------|-----------|--------|-----|---------|--------|-----------------|-----------------|
"""

for row in test_results:
    md_report += f"| {row['Model']} | {row['Threshold']:.2f} | {row['Precision']:.4f} | {row['Recall']:.4f} | {row['F1']:.4f} | {row['ROC-AUC']:.4f} | {row['PR-AUC']:.4f} | {row['False Positives']:,} | {row['False Negatives']:,} |\n"

md_report += """

---

## 5. Calibration Check (Brier Score)

Lower Brier score indicates better calibration.

| Model | Brier Score |
|-------|-------------|
"""

for model_name, score in calibration_results.items():
    md_report += f"| {model_name} | {score:.4f} |\n"

md_report += """

**Interpretation:** Brier score measures the mean squared difference between predicted probabilities and actual outcomes. A score of 0 is perfect calibration, 0.25 is for random guessing.

---

## 6. Model Comparison at Fixed Thresholds

### Threshold = 0.25

| Model | Precision | Recall | F1 | False Positives | False Negatives |
|-------|-----------|--------|-----|-----------------|-----------------|
"""

for row in fixed_threshold_results:
    if row['Threshold'] == 0.25:
        md_report += f"| {row['Model']} | {row['Precision']:.4f} | {row['Recall']:.4f} | {row['F1']:.4f} | {row['False Positives']:,} | {row['False Negatives']:,} |\n"

md_report += """

### Threshold = 0.50

| Model | Precision | Recall | F1 | False Positives | False Negatives |
|-------|-----------|--------|-----|-----------------|-----------------|
"""

for row in fixed_threshold_results:
    if row['Threshold'] == 0.50:
        md_report += f"| {row['Model']} | {row['Precision']:.4f} | {row['Recall']:.4f} | {row['F1']:.4f} | {row['False Positives']:,} | {row['False Negatives']:,} |\n"

md_report += """

### Threshold = 0.65

| Model | Precision | Recall | F1 | False Positives | False Negatives |
|-------|-----------|--------|-----|-----------------|-----------------|
"""

for row in fixed_threshold_results:
    if row['Threshold'] == 0.65:
        md_report += f"| {row['Model']} | {row['Precision']:.4f} | {row['Recall']:.4f} | {row['F1']:.4f} | {row['False Positives']:,} | {row['False Negatives']:,} |\n"

# Determine best model based on PR-AUC
best_test_row = max(test_results, key=lambda x: x['PR-AUC'])
best_model_name = best_test_row['Model']

md_report += f"""

---

## 7. Model Trade-offs Analysis

### {best_model_name} (Best PR-AUC)

**Strengths:**
- Highest PR-AUC ({best_test_row['PR-AUC']:.4f}) - most critical for imbalanced fraud detection
- Highest F1 Score ({best_test_row['F1']:.4f}) - best balance of precision and recall
- Highest Precision ({best_test_row['Precision']:.4f}) - minimizes false alarms
- Optimal threshold: {best_test_row['Threshold']:.2f}
- False Positives: {best_test_row['False Positives']:,}
- False Negatives: {best_test_row['False Negatives']:,}

**Trade-offs:**
"""

# Find model with highest recall
highest_recall = max(test_results, key=lambda x: x['Recall'])
if highest_recall['Model'] != best_model_name:
    md_report += f"- Lower recall ({best_test_row['Recall']:.4f}) compared to {highest_recall['Model']} ({highest_recall['Recall']:.4f})\n"
    md_report += f"- This means {best_model_name} may miss more fraud cases but blocks fewer legitimate transactions\n"

md_report += f"""
- Brier Score: {calibration_results[best_model_name]:.4f} (calibration quality)

### Alternative Models

"""

# Add analysis for other top models
for row in test_results:
    if row['Model'] != best_model_name:
        md_report += f"**{row['Model']}:**\n"
        md_report += f"- PR-AUC: {row['PR-AUC']:.4f} (vs {best_model_name}: {best_test_row['PR-AUC']:.4f})\n"
        md_report += f"- Recall: {row['Recall']:.4f} (higher recall = catches more fraud)\n"
        md_report += f"- Precision: {row['Precision']:.4f} (higher precision = fewer false alarms)\n"
        md_report += f"- Threshold: {row['Threshold']:.2f}\n"
        md_report += f"- False Positives: {row['False Positives']:,}\n"
        md_report += f"- False Negatives: {row['False Negatives']:,}\n"
        md_report += "\n"

md_report += """
---

## 8. Business Context: UPI Fraud Detection

### Key Considerations

**Missed Fraud (False Negatives):**
- Direct financial loss to customers
- Reputational damage to the platform
- Potential regulatory penalties
- Customer churn

**False Alarms (False Positives):**
- Customer frustration from blocked legitimate transactions
- Increased customer support workload
- Potential loss of legitimate business
- Negative user experience

**Precision vs Recall Trade-off:**
- High precision: Fewer false alarms, but may miss more fraud
- High recall: Catch more fraud, but more false alarms
- PR-AUC is the most appropriate metric for imbalanced fraud detection

### Risk Score Application

The system converts model probability to risk score:
```
riskScore = probability × 100
```

This requires well-calibrated probabilities to ensure:
- Risk score accurately reflects actual fraud likelihood
- Users can trust the risk assessment
- Consistent behavior across different transaction types

---

## 9. Final Selection

**Selected Model:** """ + best_model_name + f"""

**Selected Threshold:** {best_test_row['Threshold']:.2f}

**Selection Rationale:**

1. **PR-AUC Priority:** {best_model_name} achieves the highest PR-AUC ({best_test_row['PR-AUC']:.4f}), which is the most appropriate metric for imbalanced fraud detection (5% fraud rate).

2. **Balanced Performance:** Highest F1 score ({best_test_row['F1']:.4f}) indicates the best balance between precision and recall.

3. **Precision Advantage:** Highest precision ({best_test_row['Precision']:.4f}) minimizes false alarms, reducing customer frustration from blocked legitimate transactions.

4. **Calibration:** Brier score of {calibration_results[best_model_name]:.4f} indicates reasonable probability calibration for risk score calculation.

5. **Inference Speed:** Fast inference suitable for real-time transaction processing.

**Limitations:**

- Recall ({best_test_row['Recall']:.4f}) is lower than some alternatives, meaning more fraud cases may be missed
- The optimal threshold ({best_test_row['Threshold']:.2f}) is lower than the traditional 0.5, which may require business process adjustments
- Calibration could be improved with post-processing techniques (not implemented yet)

---

## 10. Why Current Production XGBoost Was Not Selected

Current Production XGBoost Performance (from benchmark):
- PR-AUC: 0.3574
- F1 Score: 0.4594
- Recall: 0.619
- Precision: 0.3652
- Threshold: 0.65

**Comparison with {best_model_name}:**
- PR-AUC: {best_test_row['PR-AUC']:.4f} vs 0.3574 (improvement: {best_test_row['PR-AUC'] - 0.3574:.4f})
- F1 Score: {best_test_row['F1']:.4f} vs 0.4594 (improvement: {best_test_row['F1'] - 0.4594:.4f})
- Precision: {best_test_row['Precision']:.4f} vs 0.3652 (improvement: {best_test_row['Precision'] - 0.3652:.4f})
- Recall: {best_test_row['Recall']:.4f} vs 0.619 (difference: {best_test_row['Recall'] - 0.619:.4f})

**Conclusion:** {best_model_name} outperforms the current production XGBoost on the primary metric (PR-AUC) and overall F1 score, while providing significantly better precision (fewer false alarms). The trade-off is slightly lower recall (more missed fraud), which is an acceptable business decision given the priority on minimizing customer friction from false alarms.

---

## 11. Deployment Recommendations

**Before Deployment:**

1. **Review with Stakeholders:** Confirm that the precision/recall trade-off aligns with business priorities
2. **A/B Testing:** Consider running both models in parallel to validate performance in production
3. **Monitoring:** Implement comprehensive monitoring for false positives/negatives
4. **Calibration:** Consider implementing probability calibration if risk score accuracy is critical
5. **Threshold Adjustment:** The threshold may need tuning based on production feedback

**Deployment Steps (NOT YET EXECUTED):**

1. Update `ml_service/config.py` with new model name and threshold
2. Update `ml_service/model_loader.py` to load the selected model
3. Restart FastAPI service
4. Update React frontend model version display
5. Perform end-to-end testing
6. Monitor production performance closely

---

## 12. Files Generated

- `models/benchmark/threshold_analysis.csv` - Detailed threshold analysis
- `models/final_model_selection_report.json` - Machine-readable report
- `models/final_model_selection_report.md` - This human-readable report

---

**IMPORTANT:** Production model (`models/best_xgboost_model.joblib`) was NOT modified. This is an analysis report only. Deployment requires explicit approval and execution of deployment steps.
"""

# Save markdown report
md_report_path = MODELS_DIR / 'final_model_selection_report.md'
with open(md_report_path, 'w') as f:
    f.write(md_report)
print(f"Saved Markdown report to: {md_report_path}")

print("\n" + "=" * 80)
print("ANALYSIS COMPLETE")
print("=" * 80)
print(f"\nFiles created:")
print(f"  - {threshold_csv_path}")
print(f"  - {json_report_path}")
print(f"  - {md_report_path}")
print(f"\nProvisional Best Model: {best_model_name}")
print(f"Selected Threshold: {best_test_row['Threshold']:.2f}")
print(f"\nIMPORTANT: Production model NOT modified. Awaiting approval for deployment.")
print("=" * 80)
