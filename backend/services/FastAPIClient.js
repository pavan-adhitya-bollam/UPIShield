const axios = require('axios');

class FastAPIClient {
  constructor(options = {}) {
    this.baseURL = options.baseURL || process.env.FASTAPI_URL || 'http://localhost:8000';
    this.http = axios.create({
      baseURL: this.baseURL,
      timeout: options.timeout || 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async predict(transactionPayload = {}) {
    const response = await this.http.post('/predict', transactionPayload);
    return response.data;
  }

  async analyze(transactionPayload = {}) {
    const response = await this.http.post('/predict', transactionPayload);
    return response.data;
  }

  async health() {
    const response = await this.http.get('/health');
    return response.data;
  }

  async modelStatus() {
    const [modelInfoResponse, healthResponse] = await Promise.all([
      this.http.get('/model-info'),
      this.http.get('/health')
    ]);

    return {
      ...modelInfoResponse.data,
      status: healthResponse.data?.status || 'Healthy',
      healthy: Boolean(healthResponse.data?.modelLoaded),
      provider: 'fastapi',
      version: modelInfoResponse.data?.modelVersion || modelInfoResponse.data?.modelName || 'unknown',
      inferenceTime: healthResponse.data?.inferenceTime || 'unknown',
      lastUpdated: healthResponse.data?.lastUpdated || new Date().toISOString()
    };
  }
}

module.exports = FastAPIClient;