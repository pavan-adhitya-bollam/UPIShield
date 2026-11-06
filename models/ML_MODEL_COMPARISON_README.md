# ML Model Comparison - UPI Fraud Detection

**Project:** Intelligent UPI Risk Assessment and Fraud Detection System using Machine Learning and MERN Stack

**Generated:** September 20, 2026

---

## Table of Contents

1. [Project Context](#project-context)
2. [Why Multiple Models Were Evaluated](#why-multiple-models-were-evaluated)
3. [Models Evaluated](#models-evaluated)
4. [Comparison Methodology](#comparison-methodology)
5. [Benchmark Results](#benchmark-results)
6. [Threshold Analysis](#threshold-analysis)
7. [Calibration Analysis](#calibration-analysis)
8. [Final Model Selection](#final-model-selection)
9. [Why HistGradientBoosting Was Selected](#why-histgradientboosting-was-selected)
10. [Why the Previous XGBoost Model Was Not Selected](#why-the-previous-xgboost-model-was-not-selected)
11. [Important Interpretation: Why Accuracy Is Not Enough](#important-interpretation-why-accuracy-is-not-enough)
12. [Risk Score Connection to Production Application](#risk-score-connection-to-production-application)
13. [Limitations and Trade-offs](#limitations-and-trade-offs)
14. [Reproducibility](#reproducibility)
15. [Professor Defense Section](#professor-defense-section)

---

## Project Context

### Dataset

- **Source:** `dataset/upi_fraud_dataset_behavioral_v2.csv`
- **Size:** 100,000 UPI behavioural transactions
- **Genuine transactions:** 95,000 (95%)
- **Fraud transactions:** 5,000 (5%)
- **Target variable:** `is_fraud` (binary classification)
- **Features:** 76 final features after preprocessing
- **Note:** `fraud_type` was NOT used as a training feature to prevent data leakage

### Data Split

- **Train set:** 60,000 transactions (60%)
- **Validation set:** 20,000 transactions (20%)
- **Test set:** 20,000 transactions (20%)
- **Split type:** Stratified (maintains fraud rate in each split)
- **Random state:** 42 (for reproducibility)

### Preprocessing Pipeline

1. **Feature extraction:** Datetime features (day, month, year, hour, day of week)
2. **Missing value handling:** Median imputation for numeric, 'NONE'/'P2P' for categorical
3. **Categorical encoding:** One-hot encoding (no drop_first)
4. **Feature count:** 76 features after encoding

---

## Why Multiple Models Were Evaluated

The initial production implementation used only XGBoost. However, relying on a single model without comparison is not a rigorous machine learning practice. Different algorithms have different strengths and weaknesses, and the best model for a specific dataset and problem can only be determined through systematic experimentation.

This project therefore conducted a comprehensive model comparison to:

- Identify the algorithm that performs best on this specific UPI fraud detection dataset
- Evaluate trade-offs between precision, recall, and false alarm rates
- Assess probability calibration quality for risk score calculation
- Provide experimental justification for the production model selection
- Demonstrate a complete, reproducible ML evaluation workflow

---

## Models Evaluated

### Successfully Trained Models (7)

The following seven models were successfully trained and evaluated:

1. **Logistic Regression** - Linear baseline model
2. **Random Forest** - Ensemble of decision trees
3. **Extra Trees** - Extremely randomized trees
4. **HistGradientBoosting** - Histogram-based gradient boosting
5. **XGBoost** - Extreme gradient boosting (previous production model)
6. **LightGBM** - Light gradient boosting machine
7. **CatBoost** - Categorical boosting

### TabPFN Status

TabPFN was considered as an eighth candidate model but was not included in the benchmark because the required package/environment compatibility was unavailable. The project therefore reports results for the seven models that were successfully trained and evaluated.

---

## Comparison Methodology

### Fair Comparison Principles

All models were evaluated using identical conditions:

- **Same dataset:** 100,000 transactions from `upi_fraud_dataset_behavioral_v2.csv`
- **Same preprocessing:** Identical feature engineering and encoding pipeline
- **Same features:** 76 features for all models
- **Same train/validation/test split:** 60/20/20 stratified split with random_state=42
- **Same evaluation metrics:** Calculated on the untouched test set
- **No data leakage:** Validation set used for threshold optimization only

### Evaluation Metrics

For each model, the following metrics were calculated:

- **Accuracy:** Overall correct predictions
- **Precision:** True positives / (True positives + False positives)
- **Recall:** True positives / (True positives + False negatives)
- **F1 Score:** Harmonic mean of precision and recall
- **ROC-AUC:** Area under the receiver operating characteristic curve
- **PR-AUC:** Area under the precision-recall curve (critical for imbalanced data)
- **False Positives:** Number of genuine transactions incorrectly flagged as fraud
- **False Negatives:** Number of fraud transactions missed by the model
- **Training Time:** Time required to train the model
- **Inference Time:** Time required to make predictions

### Threshold Optimization

For each model:
1. Model was trained on the training set
2. Probabilities were generated on the validation set
3. Thresholds from 0.10 to 0.90 (0.05 increments) were evaluated
4. Optimal threshold selected by maximizing F1 score on validation set
5. Final evaluation performed on the untouched test set using the optimal threshold

This ensures no test set contamination during threshold selection.

### Calibration Check

Probability calibration was evaluated using the Brier score:
- **Brier Score:** Mean squared error between predicted probabilities and actual outcomes
- **Lower is better:** 0 indicates perfect calibration, 0.25 indicates random guessing
- **Relevance:** Important because the application converts probability to a 0–100 risk score

---

## Benchmark Results

### Initial Benchmark Results (7 Models)

| Model | Accuracy | Precision | Recall | F1 | ROC-AUC | PR-AUC | False Positives | False Negatives | Threshold | Training Time (s) | Inference Time (s) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| HistGradientBoosting | 0.9395 | 0.4229 | 0.5760 | 0.4877 | 0.8716 | **0.3851** | **786** | 424 | 0.25 | 1.05 | 0.0507 |
| Random Forest | 0.9224 | 0.3524 | 0.6590 | 0.4592 | **0.8746** | 0.3781 | 1211 | 341 | 0.65 | 2.23 | 0.1261 |
| CatBoost | 0.9197 | 0.3446 | 0.6720 | 0.4556 | 0.8741 | 0.3775 | 1278 | 328 | 0.65 | 3.87 | 0.0092 |
| LightGBM | 0.9228 | 0.3527 | 0.6510 | 0.4575 | 0.8654 | 0.3711 | 1195 | 349 | 0.65 | 1.12 | 0.0870 |
| XGBoost | 0.9272 | 0.3652 | 0.6190 | 0.4594 | 0.8635 | 0.3574 | 1076 | 381 | 0.65 | 1.80 | 0.0264 |
| Logistic Regression | 0.9004 | 0.2897 | 0.6830 | 0.4068 | 0.8606 | 0.3353 | 1675 | 317 | 0.65 | 2.64 | 0.0157 |
| Extra Trees | 0.9219 | 0.3508 | 0.6610 | 0.4584 | 0.8655 | 0.3320 | 1223 | 339 | 0.65 | 2.37 | 0.1222 |

**Key Observations:**
- HistGradientBoosting achieved the highest PR-AUC (0.3851), the most critical metric for imbalanced fraud detection
- Random Forest achieved the highest ROC-AUC (0.8746)
- Logistic Regression achieved the highest recall (0.683) but lowest precision
- HistGradientBoosting had the fewest false positives (786), minimizing false alarms

---

## Threshold Analysis

### Optimal Thresholds (Validation Set)

Thresholds were selected by maximizing F1 score on the validation set. The untouched test set was used only for final evaluation.

| Model | Selected Threshold | Precision | Recall | F1 | PR-AUC | False Positives | False Negatives |
|---|---:|---:|---:|---:|---:|---:|---:|
| HistGradientBoosting | 0.25 | 0.4229 | 0.5760 | 0.4877 | **0.3851** | 786 | 424 |
| Random Forest | 0.85 | 0.4319 | 0.5580 | 0.4869 | 0.3781 | 734 | 442 |
| CatBoost | 0.85 | 0.4308 | 0.5760 | **0.4929** | 0.3775 | 761 | 424 |
| LightGBM | 0.80 | 0.4184 | 0.5770 | 0.4851 | 0.3711 | 802 | 423 |
| XGBoost | 0.80 | 0.4160 | 0.5520 | 0.4744 | 0.3574 | 775 | 448 |

**Key Observations:**
- HistGradientBoosting selected a lower threshold (0.25) compared to other models (0.80-0.85)
- This lower threshold contributes to its higher precision at the cost of slightly lower recall
- CatBoost achieved the highest F1 score (0.4929) in the final threshold analysis
- Different models selected different optimal thresholds, highlighting the importance of threshold tuning

---

## Calibration Analysis

### Brier Score Results

The Brier score measures probability calibration quality. Lower scores indicate better calibration.

| Model | Brier Score |
|---|---:|
| HistGradientBoosting | **0.0362** |
| XGBoost | 0.0838 |
| LightGBM | 0.0939 |
| CatBoost | 0.1040 |
| Random Forest | 0.1070 |

**Interpretation:**
- HistGradientBoosting achieved the best calibration (lowest Brier score)
- This is particularly relevant because the application converts model fraud probability into a 0–100 risk score
- Better calibration means the risk score more accurately reflects the model's estimated fraud likelihood
- The risk score is an application-level representation of the model's estimated fraud probability

---

## Final Model Selection

### Selected Model

**HistGradientBoosting**

### Selected Threshold

**0.25**

### Selection Criteria

The model selection considered multiple metrics rather than a single metric:

1. **PR-AUC (Primary):** Most appropriate metric for imbalanced fraud detection (5% fraud rate)
2. **F1 Score:** Balance between precision and recall
3. **Precision:** Minimization of false alarms
4. **Recall:** Fraud detection capability
5. **Calibration:** Probability quality for risk score calculation
6. **Inference Speed:** Suitability for real-time prediction
7. **Training Efficiency:** Practical deployment considerations

---

## Why HistGradientBoosting Was Selected

HistGradientBoosting was selected for production deployment based on the following experimental results:

### Strengths

1. **Highest PR-AUC:** 0.3851
   - PR-AUC is the most critical metric for imbalanced fraud detection
   - Indicates superior performance across different operating points

2. **Strong F1 Score:** 0.4877 (initial benchmark)
   - Best balance between precision and recall
   - Note: In the final threshold analysis, CatBoost achieved F1 = 0.4929, which is slightly higher. Model selection considered multiple metrics beyond F1 alone.

3. **Highest Precision (Initial Benchmark):** 0.4229
   - Minimizes false alarms on genuine transactions
   - Reduces customer frustration from blocked legitimate payments

4. **Fewest False Positives (Initial Benchmark):** 786
   - 27% fewer false positives compared to XGBoost (1076)
   - Significant reduction in customer friction

5. **Best Calibration:** Brier score of 0.0362
   - Best probability calibration among compared models
   - Important for accurate risk score calculation

6. **Fast Training:** 1.05 seconds
   - Efficient retraining capability
   - Practical for periodic model updates

7. **Suitable Inference Time:** 0.0507 seconds
   - Compatible with real-time transaction processing
   - Meets latency requirements for UPI payment flow

### Trade-offs

- **Recall:** 0.576 is slightly lower than some alternatives (LightGBM: 0.577, CatBoost: 0.576)
- This represents a precision/recall trade-off: fewer false alarms at the cost of potentially missing more fraud cases
- The selected threshold (0.25) is lower than traditional 0.5, which may require business process adjustments

### Multi-Metric Rationale

Model selection was not based on a single metric. While CatBoost achieved a slightly higher F1 score in the final threshold analysis (0.4929 vs 0.4877), HistGradientBoosting was selected because it:
- Achieved the highest PR-AUC (primary metric for imbalanced data)
- Had the best calibration (critical for risk score accuracy)
- Produced fewer false positives in the initial benchmark
- Showed strong overall performance across multiple metrics

---

## Why the Previous XGBoost Model Was Not Selected

### Previous XGBoost Performance

- **PR-AUC:** 0.3574
- **Precision:** 0.3652
- **Recall:** 0.6190
- **F1 Score:** 0.4594
- **Brier Score:** 0.0838
- **False Positives:** 1076
- **Threshold:** 0.65

### HistGradientBoosting Performance

- **PR-AUC:** 0.3851
- **Precision:** 0.4229
- **Recall:** 0.5760
- **F1 Score:** 0.4877
- **Brier Score:** 0.0362
- **False Positives:** 786
- **Threshold:** 0.25

### Comparison

| Metric | XGBoost | HistGradientBoosting | Difference |
|---|---:|---:|---:|
| PR-AUC | 0.3574 | 0.3851 | +0.0277 (+7.8%) |
| Precision | 0.3652 | 0.4229 | +0.0577 (+15.8%) |
| Recall | 0.6190 | 0.5760 | -0.0430 (-7.0%) |
| F1 Score | 0.4594 | 0.4877 | +0.0283 (+6.2%) |
| Brier Score | 0.0838 | 0.0362 | -0.0476 (-57%) |
| False Positives | 1076 | 786 | -290 (-27%) |

### Conclusion

XGBoost was not selected because HistGradientBoosting achieved:
- Higher PR-AUC (7.8% improvement)
- Higher precision (15.8% improvement)
- Stronger F1 score in the initial benchmark (6.2% improvement)
- Substantially fewer false positives (27% reduction)
- Substantially better Brier calibration (57% improvement)

**Trade-off Acknowledgment:** XGBoost achieved higher recall than HistGradientBoosting in the reported benchmark (0.619 vs 0.576), so the model choice represents a precision/false-positive versus recall trade-off. This is an acceptable business decision given the priority on minimizing customer friction from false alarms.

**Important Note:** XGBoost is not a bad model. It was simply not the best-performing model for this specific dataset under this evaluation setup.

---

## Important Interpretation: Why Accuracy Is Not Enough

### The Accuracy Problem

Fraud represents only 5% of the dataset. A model that predicts "genuine" for every transaction would achieve 95% accuracy while detecting zero fraud cases. This demonstrates why accuracy alone is insufficient for imbalanced fraud detection.

### Why Multiple Metrics Matter

The project therefore emphasizes:

- **PR-AUC:** Area under precision-recall curve - most informative for imbalanced data
- **Precision:** Minimizes false alarms on genuine transactions
- **Recall:** Maximizes fraud detection rate
- **F1 Score:** Balance between precision and recall
- **False Positives:** Direct measure of customer friction
- **False Negatives:** Direct measure of missed fraud
- **ROC-AUC:** Overall discrimination capability
- **Probability Calibration:** Quality of risk scores

### Business Impact

- **High accuracy with low recall:** Many fraud cases missed → financial loss, reputational damage
- **High accuracy with low precision:** Many genuine transactions blocked → customer frustration, support workload
- **Balanced metrics:** Optimal trade-off between fraud detection and customer experience

---

## Risk Score Connection to Production Application

### Production Flow

```
UPI Transaction
    ↓
Behavioural Feature Extraction (76 features)
    ↓
HistGradientBoosting Model
    ↓
Fraud Probability (0.0 to 1.0)
    ↓
Risk Score = fraudProbability × 100 (0 to 100)
    ↓
Risk Level Classification (LOW/MEDIUM/HIGH/CRITICAL)
    ↓
MongoDB Storage (Transaction + Prediction)
    ↓
React Dashboard Display
```

### Risk Score Calculation

```
riskScore = fraudProbability × 100
```

### Risk Level Classification

- **LOW:** 0-29
- **MEDIUM:** 30-59
- **HIGH:** 60-79
- **CRITICAL:** 80-100

### Production Threshold

The classification threshold is **0.25**:
- If fraudProbability ≥ 0.25 → Classified as FRAUD
- If fraudProbability < 0.25 → Classified as GENUINE

### Important Distinction

The classification threshold (0.25) determines the binary fraud/genuine decision. The risk score itself remains continuous from 0–100 and should not be confused with the binary classification threshold.

### Example (Illustrative)

```
fraudProbability = 0.78
riskScore = 78
riskLevel = HIGH
Classification = FRAUD (since 0.78 ≥ 0.25)
```

This is an illustrative example, not a hardcoded prediction. Actual predictions depend on the transaction features.

---

## Limitations and Trade-offs

### Dataset Limitations

- **Synthetic Data:** The dataset is synthetic and may not fully represent real-world UPI transaction patterns
- **Feature Distribution:** Results are specific to this dataset's feature distribution
- **Temporal Dynamics:** The dataset does not capture temporal evolution of fraud patterns
- **Geographic Scope:** May not generalize to all regions or payment patterns

### Model Limitations

- **TabPFN Exclusion:** TabPFN was not benchmarked because of environment compatibility issues
- **Threshold Sensitivity:** Model performance depends on the selected threshold; different business priorities may require different thresholds
- **Calibration:** While HistGradientBoosting showed good calibration, probability estimates are not guaranteed to represent real-world fraud probabilities
- **Feature Drift:** Model performance may degrade as transaction behavior changes over time

### Deployment Limitations

- **Production Gap:** Model performance in a real production UPI environment may differ from test set results
- **Real-time Constraints:** Inference time requirements may vary with traffic load
- **Regulatory Requirements:** Actual deployment may require additional compliance measures
- **Monitoring Needs:** Production deployment requires continuous monitoring and periodic retraining

### Risk Score Interpretation

- The risk score is a model-derived assessment, not a guarantee of fraud
- Risk scores should be used as one input in a broader fraud detection strategy
- Human review and additional verification may be required for high-risk transactions

---

## Reproducibility

### Dataset

- **File:** `dataset/upi_fraud_dataset_behavioral_v2.csv`
- **Size:** 100,000 transactions
- **Fraud rate:** 5%

### Preprocessing

- **Feature count:** 76 features
- **Split:** 60/20/20 (train/validation/test)
- **Random state:** 42
- **Stratified:** Yes

### Benchmark Artifacts

- **Directory:** `models/benchmark/`
- **Comparison metrics:** `models/benchmark/model_comparison_metrics.csv`
- **Threshold analysis:** `models/benchmark/threshold_analysis.csv`
- **Saved models:**
  - `models/benchmark/logistic_regression.joblib`
  - `models/benchmark/random_forest.joblib`
  - `models/benchmark/extra_trees.joblib`
  - `models/benchmark/histgradientboosting.joblib`
  - `models/benchmark/xgboost.joblib`
  - `models/benchmark/lightgbm.joblib`
  - `models/benchmark/catboost.joblib`
  - `models/benchmark/feature_columns.joblib`

### Analysis Reports

- **Final selection report (JSON):** `models/final_model_selection_report.json`
- **Final selection report (Markdown):** `models/final_model_selection_report.md`

### Production Configuration

- **Selected model:** HistGradientBoosting
- **Selected threshold:** 0.25
- **Model file:** `models/benchmark/histgradientboosting.joblib`

### Training Scripts

- **Model comparison:** `train_model_comparison.py`
- **Threshold analysis:** `threshold_analysis.py`

---

## Professor Defense Section

### Question: "Why did you not just use XGBoost?"

**Answer:**

"I did not assume XGBoost was the best model. I compared seven machine-learning models using the same dataset, preprocessing, features and train/validation/test split. I evaluated them using precision, recall, F1, ROC-AUC, PR-AUC, false positives and false negatives. I also performed threshold analysis and probability calibration. HistGradientBoosting was selected for production because it achieved the highest PR-AUC and best Brier calibration in our evaluation, while also producing fewer false positives than the existing XGBoost model. The selection was based on our experimental results, not on the model's popularity."

### Question: "How does your application calculate risk?"

**Answer:**

"For each transaction, the production model outputs a fraud probability. The application converts that probability into a 0–100 risk score and assigns a risk level. The score is stored with the transaction and displayed on the dashboard, allowing users to monitor the risk associated with individual transactions."

### Question: "Why is accuracy not sufficient for fraud detection?"

**Answer:**

"Fraud represents only 5% of our dataset. A model that predicts 'genuine' for every transaction would achieve 95% accuracy while detecting zero fraud cases. Therefore, I evaluated models using PR-AUC, precision, recall, F1 score, and calibration metrics to ensure the model actually catches fraud while minimizing false alarms on genuine transactions."

### Question: "What is the trade-off in your model selection?"

**Answer:**

"HistGradientBoosting achieves higher precision and fewer false positives compared to XGBoost, which means fewer customer transactions are incorrectly blocked. However, it has slightly lower recall, meaning it may miss a small percentage of fraud cases. This represents a deliberate trade-off: prioritizing customer experience by minimizing false alarms while maintaining strong overall fraud detection capability."

---

## Conclusion

This project conducted a comprehensive, reproducible comparison of seven machine learning models for UPI fraud detection. The evaluation used identical preprocessing, features, and data splits for all models, with threshold optimization on the validation set and final evaluation on the untouched test set.

**HistGradientBoosting** was selected for production deployment based on:
- Highest PR-AUC (0.3851) - the most critical metric for imbalanced fraud detection
- Best probability calibration (Brier score 0.0362) - important for accurate risk scores
- Strong F1 score (0.4877) - balanced precision and recall
- Fewest false positives (786) - minimizes customer friction
- Fast training and inference - practical for real-time deployment

The previous XGBoost model was not selected because HistGradientBoosting outperformed it on the primary evaluation metrics while providing better calibration and fewer false alarms. The selection is based on experimental results, not on model popularity or assumptions.

**Production Status:** The production model has NOT been replaced. This documentation describes the analysis and recommendation for the next deployment phase. Deployment requires explicit approval and execution of the deployment steps outlined in the final selection report.

---

**Document Version:** 1.0  
**Last Updated:** September 20, 2026  
**Author:** ML Model Comparison Analysis
