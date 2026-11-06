// Mock data for AI Model Insights Center

export const modelOverview = {
  modelName: 'HistGradientBoosting',
  modelVersion: 'HistGradientBoosting v1.0',
  accuracy: 0.94,
  precision: 0.4229,
  recall: 0.576,
  f1Score: 0.4877,
  rocAuc: 0.8716,
  brierScore: 0.0362,
  predictionThreshold: 0.25,
  trainingDataset: 'Behavioral V2',
  trainingDate: 'September 20, 2026',
  lastUpdated: 'September 20, 2026'
}

export const confusionMatrix = {
  truePositive: 576,
  falsePositive: 786,
  trueNegative: 18214,
  falseNegative: 424
}

export const performanceMetrics = {
  rocCurve: [
    { fpr: 0, tpr: 0 },
    { fpr: 0.1, tpr: 0.85 },
    { fpr: 0.2, tpr: 0.92 },
    { fpr: 0.3, tpr: 0.95 },
    { fpr: 0.4, tpr: 0.97 },
    { fpr: 0.5, tpr: 0.98 },
    { fpr: 0.6, tpr: 0.99 },
    { fpr: 0.7, tpr: 0.99 },
    { fpr: 0.8, tpr: 0.99 },
    { fpr: 0.9, tpr: 1 },
    { fpr: 1, tpr: 1 }
  ],
  precisionRecall: [
    { recall: 0, precision: 1 },
    { recall: 0.1, precision: 0.98 },
    { recall: 0.2, precision: 0.96 },
    { recall: 0.3, precision: 0.94 },
    { recall: 0.4, precision: 0.93 },
    { recall: 0.5, precision: 0.92 },
    { recall: 0.6, precision: 0.91 },
    { recall: 0.7, precision: 0.90 },
    { recall: 0.8, precision: 0.89 },
    { recall: 0.9, precision: 0.88 },
    { recall: 1, precision: 0.85 }
  ],
  predictionDistribution: [
    { range: '0-0.2', count: 85000 },
    { range: '0.2-0.4', count: 8000 },
    { range: '0.4-0.6', count: 4000 },
    { range: '0.6-0.8', count: 2000 },
    { range: '0.8-1.0', count: 1000 }
  ],
  fraudVsGenuine: [
    { type: 'Genuine', count: 94680 },
    { type: 'Fraud', count: 4320 }
  ],
  confidenceDistribution: [
    { range: '0-20%', count: 5000 },
    { range: '20-40%', count: 15000 },
    { range: '40-60%', count: 30000 },
    { range: '60-80%', count: 35000 },
    { range: '80-100%', count: 15000 }
  ]
}

export const featureImportance = [
  {
    rank: 1,
    feature: 'Customer Behaviour Deviation',
    importance: 0.38,
    explanation: 'Deviation from normal transaction patterns is the strongest predictor of fraud'
  },
  {
    rank: 2,
    feature: 'Device Changed',
    importance: 0.21,
    explanation: 'Transactions from new devices have higher fraud probability'
  },
  {
    rank: 3,
    feature: 'New Beneficiary',
    importance: 0.14,
    explanation: 'Payments to new beneficiaries are riskier'
  },
  {
    rank: 4,
    feature: 'Location Changed',
    importance: 0.10,
    explanation: 'Unusual geographic locations indicate potential fraud'
  },
  {
    rank: 5,
    feature: 'High Transaction Velocity',
    importance: 0.08,
    explanation: 'Multiple rapid transactions suggest automated fraud'
  },
  {
    rank: 6,
    feature: 'Transaction Frequency',
    importance: 0.05,
    explanation: 'Abnormal frequency patterns indicate suspicious activity'
  },
  {
    rank: 7,
    feature: 'Merchant Category',
    importance: 0.03,
    explanation: 'Certain merchant categories have higher fraud rates'
  },
  {
    rank: 8,
    feature: 'Amount Sent Last 24 Hours',
    importance: 0.01,
    explanation: 'High cumulative amounts increase risk'
  }
]

export const shapAnalysis = {
  exampleTransaction: {
    id: 'TXN001234567',
    riskScore: 0.91,
    confidence: 0.94
  },
  positiveContributors: [
    { feature: 'Customer Behaviour Deviation', contribution: 0.38 },
    { feature: 'New Beneficiary', contribution: 0.21 },
    { feature: 'Device Changed', contribution: 0.14 },
    { feature: 'Location Changed', contribution: 0.10 },
    { feature: 'High Velocity', contribution: 0.08 }
  ],
  negativeContributors: [
    { feature: 'Trusted Device', contribution: -0.15 },
    { feature: 'Known Location', contribution: -0.12 },
    { feature: 'Frequent Beneficiary', contribution: -0.08 }
  ]
}

export const predictionMonitor = {
  todayPredictions: 24589,
  fraudDetected: 127,
  falsePositives: 23,
  falseNegatives: 8,
  averagePredictionTime: 45,
  averageConfidence: 0.87
}

export const modelHealth = {
  status: 'Healthy',
  latency: 45,
  memoryUsage: 512,
  cpuUsage: 35,
  inferenceTime: 42,
  lastPrediction: '2 seconds ago',
  modelAvailability: 99.9
}

export const datasetInfo = {
  datasetName: 'Behavioral V2',
  rows: 100000,
  columns: 35,
  fraudRatio: 0.05,
  trainingFeatures: 76,
  testSetRows: 20000,
  missingValues: 0.02,
  datasetVersion: 'v2.0'
}

export const thresholdSimulation = {
  threshold: 0.65,
  results: {
    '0.10': { precision: 0.75, recall: 0.98, f1: 0.85 },
    '0.20': { precision: 0.82, recall: 0.96, f1: 0.88 },
    '0.30': { precision: 0.86, recall: 0.94, f1: 0.90 },
    '0.40': { precision: 0.88, recall: 0.92, f1: 0.90 },
    '0.50': { precision: 0.90, recall: 0.90, f1: 0.90 },
    '0.60': { precision: 0.91, recall: 0.88, f1: 0.89 },
    '0.65': { precision: 0.92, recall: 0.89, f1: 0.90 },
    '0.70': { precision: 0.93, recall: 0.85, f1: 0.89 },
    '0.80': { precision: 0.94, recall: 0.78, f1: 0.85 },
    '0.90': { precision: 0.96, recall: 0.65, f1: 0.77 }
  }
}

export const versionHistory = [
  {
    version: 'v2.1',
    accuracy: 0.94,
    trainingDate: 'January 10, 2024',
    dataset: 'Behavioral V2',
    status: 'Active'
  },
  {
    version: 'v2.0',
    accuracy: 0.92,
    trainingDate: 'December 15, 2023',
    dataset: 'Behavioral V1.5',
    status: 'Deprecated'
  },
  {
    version: 'v1.9',
    accuracy: 0.90,
    trainingDate: 'November 20, 2023',
    dataset: 'Behavioral V1',
    status: 'Deprecated'
  },
  {
    version: 'v1.8',
    accuracy: 0.88,
    trainingDate: 'October 25, 2023',
    dataset: 'Behavioral V0.8',
    status: 'Deprecated'
  }
]

export const recommendations = [
  {
    id: 1,
    type: 'Optimization',
    title: 'Increase threshold to reduce false positives',
    description: 'Current threshold of 0.65 produces 23 false positives daily. Increasing to 0.70 could reduce this by 40% with minimal impact on recall.',
    priority: 'High',
    impact: 'Medium'
  },
  {
    id: 2,
    type: 'Training',
    title: 'Retrain model after collecting 50,000 more transactions',
    description: 'Model performance has plateaued. Retraining with additional data could improve accuracy by 2-3%.',
    priority: 'Medium',
    impact: 'High'
  },
  {
    id: 3,
    type: 'Feature',
    title: 'Behaviour deviation contributes most to fraud',
    description: 'Customer behaviour deviation accounts for 38% of feature importance. Consider adding more behavioral features.',
    priority: 'High',
    impact: 'High'
  },
  {
    id: 4,
    type: 'Performance',
    title: 'Optimize inference time for real-time predictions',
    description: 'Current inference time of 42ms is acceptable but could be reduced to under 30ms with model quantization.',
    priority: 'Low',
    impact: 'Medium'
  },
  {
    id: 5,
    type: 'Data',
    title: 'Address class imbalance in training data',
    description: '5% fraud ratio is realistic but consider using SMOTE or weighted loss for better minority class learning.',
    priority: 'Medium',
    impact: 'High'
  }
]
