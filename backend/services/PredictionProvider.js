const logger = require('../middlewares/logger');
const MockPredictionProvider = require('./MockPredictionProvider');
const FastAPIClient = require('./FastAPIClient');

const DEFAULT_TIMEOUT_MS = Number(process.env.FASTAPI_TIMEOUT_MS || 5000);

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const hasPredictionShape = (value) => {
  if (!isObject(value)) {
    return false;
  }

  const requiredKeys = [
    'riskScore',
    'fraudProbability',
    'riskLevel',
    'predictionStatus',
    'predictionConfidence',
    'fraudReasons',
    'predictionTime',
    'modelVersion'
  ];

  return requiredKeys.every((key) => Object.prototype.hasOwnProperty.call(value, key));
};

const isRetryableError = (error) => {
  const status = error?.response?.status;
  return !status || status >= 500 || status === 408 || status === 429;
};

class PredictionProvider {
  constructor(options = {}) {
    this.preferredProvider = String(options.provider || process.env.FRAUD_PREDICTION_PROVIDER || 'fastapi').toLowerCase();
    this.retryCount = Number(options.retryCount ?? 1);
    this.timeoutMs = Number(options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
    this.fastApiClient = options.fastApiClient || new FastAPIClient({
      baseURL: options.baseURL || process.env.FASTAPI_URL,
      timeout: this.timeoutMs
    });
    this.mockProvider = options.mockProvider || new MockPredictionProvider({
      modelName: process.env.FRAUD_MODEL_NAME || 'Behavioral Fraud Risk Engine',
      modelVersion: process.env.FRAUD_MODEL_VERSION || 'XGBoost v2.1',
      datasetVersion: process.env.FRAUD_DATASET_VERSION || 'Behavioral V2',
      threshold: Number(process.env.FRAUD_MODEL_THRESHOLD || 0.6)
    });
  }

  async _withRetry(operation) {
    let lastError = null;

    for (let attempt = 0; attempt <= this.retryCount; attempt += 1) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (attempt < this.retryCount && isRetryableError(error)) {
          continue;
        }
        throw error;
      }
    }

    throw lastError;
  }

  _normalizePredictionResponse(response, providerName) {
    if (!hasPredictionShape(response)) {
      throw new Error('Invalid prediction response from provider');
    }

    const parsedProcessingTime = Number.parseInt(String(response.predictionTime), 10);
    const safeProcessingTime = Number.isFinite(parsedProcessingTime) ? parsedProcessingTime : undefined;
    const riskLevel = String(response.riskLevel || 'LOW').toUpperCase();
    const isFraud = typeof response.isFraud === 'boolean'
      ? response.isFraud
      : ['HIGH', 'CRITICAL'].includes(riskLevel);

    return {
      ...response,
      isFraud,
      predictionTime: new Date(),
      processingTime: safeProcessingTime,
      provider: providerName
    };
  }

  async _callFastApiPredict(payload) {
    const response = await this._withRetry(() => this.fastApiClient.predict(payload));
    return this._normalizePredictionResponse(response, 'fastapi');
  }

  async _callFastApiAnalyze(payload) {
    return this._callFastApiPredict(payload);
  }

  async _callFastApiHealth() {
    const response = await this._withRetry(() => this.fastApiClient.health());
    if (!isObject(response)) {
      throw new Error('Invalid health response from provider');
    }

    return {
      ...response,
      provider: 'fastapi'
    };
  }

  async _callFastApiModelStatus() {
    const response = await this._withRetry(() => this.fastApiClient.modelStatus());
    if (!isObject(response)) {
      throw new Error('Invalid model status response from provider');
    }

    return {
      ...response,
      provider: 'fastapi'
    };
  }

  async _fallback(method, payload) {
    logger.warn('Falling back to mock fraud provider', {
      method,
      reason: 'FastAPI unavailable or returned invalid response'
    });

    if (method === 'predict') {
      return this.mockProvider.predict(payload);
    }

    if (method === 'analyze') {
      return this.mockProvider.analyze(payload);
    }

    if (method === 'health') {
      return this.mockProvider.health();
    }

    if (method === 'modelStatus') {
      return this.mockProvider.modelStatus();
    }

    throw new Error(`Unsupported fallback method: ${method}`);
  }

  async predict(transactionPayload = {}) {
    if (this.preferredProvider === 'mock') {
      return this.mockProvider.predict(transactionPayload);
    }

    try {
      return await this._callFastApiPredict(transactionPayload);
    } catch (error) {
      logger.error('FastAPI prediction failed', {
        message: error.message,
        code: error.code,
        status: error.response?.status
      });

      throw error;
    }
  }

  async analyze(transactionPayload = {}) {
    if (this.preferredProvider === 'mock') {
      return this.mockProvider.analyze(transactionPayload);
    }

    try {
      return await this._callFastApiAnalyze(transactionPayload);
    } catch (error) {
      logger.error('FastAPI analysis failed', {
        message: error.message,
        code: error.code,
        status: error.response?.status
      });

      throw error;
    }
  }

  async health() {
    if (this.preferredProvider === 'mock') {
      return this.mockProvider.health();
    }

    try {
      return await this._callFastApiHealth();
    } catch (error) {
      logger.error('FastAPI health check failed', {
        message: error.message,
        code: error.code,
        status: error.response?.status
      });

      return this._fallback('health');
    }
  }

  async modelStatus() {
    if (this.preferredProvider === 'mock') {
      return this.mockProvider.modelStatus();
    }

    try {
      return await this._callFastApiModelStatus();
    } catch (error) {
      logger.error('FastAPI model status failed', {
        message: error.message,
        code: error.code,
        status: error.response?.status
      });

      return this._fallback('modelStatus');
    }
  }
}

module.exports = new PredictionProvider();