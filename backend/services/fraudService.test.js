jest.mock('../models/FraudPrediction', () => ({}));
jest.mock('../models/User', () => ({}));

const Transaction = require('../models/Transaction');
const predictionProvider = require('./PredictionProvider');
const { assessTransaction } = require('./fraudService');

const referenceTime = new Date();

const transaction = (minutesAgo, amount = 1000, receiver = 'familiar@upi') => ({
  status: 'SUCCESS',
  transactionTime: new Date(referenceTime.getTime() - minutesAgo * 60 * 1000),
  amount,
  receiverUpi: receiver,
  deviceInfo: { deviceId: 'known-device' },
  locationInfo: { city: 'Pune' }
});

const setHistory = (history) => {
  Transaction.find = jest.fn(() => ({
    sort: jest.fn(() => ({
      lean: jest.fn().mockResolvedValue(history)
    }))
  }));
};

describe('fraud assessment history gating', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('keeps normal new-account activity at zero below ten transactions', async () => {
    predictionProvider.predict = jest.fn();

    for (const history of [
      [],
      [transaction(30)],
      [transaction(60), transaction(30)],
      [transaction(90), transaction(60), transaction(30)]
    ]) {
      setHistory(history);
      const result = await assessTransaction({
        userId: 'user-1',
        amount: 1000,
        receiverUpi: 'familiar@upi',
        transactionTime: referenceTime
      });

      expect(result).toMatchObject({
        riskScore: 0,
        riskLevel: 'NO_HISTORY',
        assessmentStatus: 'INSUFFICIENT_TRANSACTION_HISTORY'
      });
    }
    expect(predictionProvider.predict).not.toHaveBeenCalled();
  });

  test('keeps rapid suspicious activity as behavioral-only below ten transactions', async () => {
    predictionProvider.predict = jest.fn();

    const assessments = [];
    for (const [history, receiver] of [
      [[], 'one@upi'],
      [[transaction(0.1, 15000, 'one@upi')], 'two@upi'],
      [[transaction(0.1, 15000, 'one@upi'), transaction(0.2, 15000, 'two@upi')], 'three@upi']
    ]) {
      setHistory(history);
      assessments.push(await assessTransaction({
        userId: 'user-1',
        amount: 15000,
        receiverUpi: receiver,
        transactionTime: referenceTime
      }));
    }

    expect(assessments.map(({ behavioralRiskContribution }) => behavioralRiskContribution))
      .toEqual([0, 8, 26]);
    expect(assessments[1].assessmentStrategy).toBe('BEHAVIORAL_RULES');
    expect(assessments[2].riskScore).toBeGreaterThan(assessments[1].riskScore);
    expect(predictionProvider.predict).not.toHaveBeenCalled();
  });

  test('invokes ML only after ten completed transactions', async () => {
    setHistory(Array.from({ length: 10 }, (_, index) => transaction(30 + index * 30)));
    predictionProvider.predict = jest.fn().mockResolvedValue({
      riskScore: 12,
      fraudProbability: 0.12,
      riskLevel: 'LOW',
      predictionStatus: 'COMPLETED',
      predictionConfidence: 90,
      isFraud: false,
      fraudReasons: []
    });

    const result = await assessTransaction({
      userId: 'user-1',
      amount: 1000,
      receiverUpi: 'familiar@upi',
      transactionTime: referenceTime
    });

    expect(predictionProvider.predict).toHaveBeenCalledTimes(1);
    expect(result.riskScore).toBe(12);
  });
});
