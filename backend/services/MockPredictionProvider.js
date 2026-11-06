const crypto = require('crypto');

const riskLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

class MockPredictionProvider {
  constructor(options = {}) {
    this.modelName = options.modelName || 'Behavioral Fraud Risk Engine';
    this.modelVersion = options.modelVersion || 'behavioral-v2.0';
    this.datasetVersion = options.datasetVersion || 'Behavioral V2';
    this.threshold = options.threshold ?? 0.6;
    this.lastUpdated = options.lastUpdated || new Date();
  }

  createSeed(transactionPayload = {}) {
    const seedSource = JSON.stringify({
      transactionId: transactionPayload.transactionId,
      senderUpiId: transactionPayload.senderUpiId,
      receiverUpiId: transactionPayload.receiverUpiId,
      amount: transactionPayload.amount,
      deviceId: transactionPayload.deviceId,
      ipAddress: transactionPayload.ipAddress,
      location: transactionPayload.location
    });

    return crypto.createHash('sha256').update(seedSource).digest('hex');
  }

  computeScore(transactionPayload = {}) {
    const amount = Number(transactionPayload.amount || 0);
    const hasDevice = Boolean(transactionPayload.deviceId);
    const hasLocation = Boolean(transactionPayload.location);
    const hasBeneficiary = Boolean(transactionPayload.receiverUpiId);
    const largeAmount = amount >= 100000;
    const highAmount = amount >= 50000;
    const mediumAmount = amount >= 10000;

    let riskScore = 10;
    if (largeAmount) riskScore += 50;
    else if (highAmount) riskScore += 35;
    else if (mediumAmount) riskScore += 20;
    else if (amount > 0) riskScore += 8;

    if (!hasDevice) riskScore += 15;
    if (!hasLocation) riskScore += 10;
    if (!hasBeneficiary) riskScore += 5;

    return Math.min(100, riskScore);
  }

  buildReasons(transactionPayload = {}, riskScore) {
    const reasons = [];
    const amount = Number(transactionPayload.amount || 0);

    if (amount >= 100000) reasons.push('Large Transaction');
    if (!transactionPayload.deviceId) reasons.push('Unknown Device');
    if (!transactionPayload.location) reasons.push('Location Changed');
    if (amount >= 50000) reasons.push('High Transaction Velocity');
    if (!transactionPayload.receiverUpiId) reasons.push('New Beneficiary');
    if (riskScore >= 40) reasons.push('Customer Behaviour Deviation');
    if (transactionPayload.ipAddress && riskScore >= 30) reasons.push('Device Changed');

    return Array.from(new Set(reasons));
  }

  buildRecommendations(riskLevel, reasons = []) {
    if (riskLevel === 'CRITICAL') {
      return ['Block Transaction', 'Manual Review', 'Contact Customer'];
    }

    if (riskLevel === 'HIGH') {
      return ['OTP Verification', 'Manual Review', 'Contact Customer'];
    }

    if (riskLevel === 'MEDIUM') {
      return ['OTP Verification', 'Allow Transaction'];
    }

    return ['Allow Transaction'];
  }

  buildContributionDetails(transactionPayload = {}, riskScore) {
    return {
      featureContributions: [
        {
          feature: 'Amount',
          contribution: Number((riskScore / 100).toFixed(2))
        },
        {
          feature: 'Device',
          contribution: transactionPayload.deviceId ? 0 : 0.15
        },
        {
          feature: 'Location',
          contribution: transactionPayload.location ? 0 : 0.1
        },
        {
          feature: 'Beneficiary',
          contribution: transactionPayload.receiverUpiId ? 0.05 : 0.1
        }
      ],
      deviceAnalysis: {
        trustedDevice: Boolean(transactionPayload.deviceId),
        deviceChanged: !transactionPayload.deviceId,
        deviceType: transactionPayload.deviceType || 'Unknown',
        browser: transactionPayload.browser || 'Unknown',
        os: transactionPayload.os || 'Unknown'
      },
      locationAnalysis: {
        knownLocation: Boolean(transactionPayload.location),
        locationChanged: !transactionPayload.location,
        city: transactionPayload.location?.city || null,
        country: transactionPayload.location?.country || null
      },
      behaviourAnalysis: {
        customerBehaviourDeviation: riskScore >= 40,
        riskDriver: riskScore >= 40 ? 'Behavioural deviation detected' : 'Normal behaviour'
      },
      velocityAnalysis: {
        highTransactionVelocity: Number(transactionPayload.amount || 0) >= 50000,
        largeTransaction: Number(transactionPayload.amount || 0) >= 100000
      },
      beneficiaryAnalysis: {
        newBeneficiary: !transactionPayload.receiverUpiId,
        beneficiaryKnown: Boolean(transactionPayload.receiverUpiId)
      }
    };
  }

  buildPrediction(transactionPayload = {}) {
    const riskScore = this.computeScore(transactionPayload);
    const fraudProbability = Number((riskScore / 100).toFixed(2));
    const riskLevel = riskLevels.find((level) => {
      if (level === 'CRITICAL') return riskScore >= 80;
      if (level === 'HIGH') return riskScore >= 60;
      if (level === 'MEDIUM') return riskScore >= 30;
      return riskScore < 30;
    }) || 'LOW';
    const predictionConfidence = Math.max(60, 100 - riskScore);
    const fraudReasons = this.buildReasons(transactionPayload, riskScore);
    const recommendations = this.buildRecommendations(riskLevel, fraudReasons);

    return {
      riskScore,
      fraudProbability,
      riskLevel,
      predictionStatus: 'COMPLETED',
      predictionConfidence,
      fraudReasons,
      recommendations,
      predictionTime: new Date(),
      modelVersion: this.modelVersion,
      modelName: this.modelName,
      threshold: this.threshold,
      isFraud: riskLevel === 'HIGH' || riskLevel === 'CRITICAL',
      ...this.buildContributionDetails(transactionPayload, riskScore)
    };
  }

  async predict(transactionPayload = {}) {
    const prediction = this.buildPrediction(transactionPayload);

    return {
      ...prediction,
      provider: 'mock'
    };
  }

  async analyze(transactionPayload = {}) {
    const prediction = this.buildPrediction(transactionPayload);

    return {
      ...prediction,
      provider: 'mock'
    };
  }

  async health() {
    return {
      status: 'healthy',
      provider: 'mock',
      modelName: this.modelName,
      modelVersion: this.modelVersion,
      datasetVersion: this.datasetVersion,
      threshold: this.threshold,
      inferenceTime: '12ms',
      lastUpdated: this.lastUpdated,
      healthy: true
    };
  }

  async modelStatus() {
    return {
      modelName: this.modelName,
      modelVersion: this.modelVersion,
      status: 'Healthy',
      healthy: true,
      datasetVersion: this.datasetVersion,
      threshold: this.threshold,
      inferenceTime: '12ms',
      lastUpdated: this.lastUpdated,
      provider: 'mock'
    };
  }
}

module.exports = MockPredictionProvider;