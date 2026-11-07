const {
  buildBehavioralFeatures,
  calculateBehavioralRisk
} = require('./behavioralRisk');

const referenceTime = new Date('2026-11-07T06:00:00.000Z');

const transaction = (minutesAgo, overrides = {}) => ({
  status: 'SUCCESS',
  transactionTime: new Date(referenceTime.getTime() - minutesAgo * 60 * 1000),
  amount: 1000,
  receiverUpi: 'familiar@upi',
  deviceInfo: { deviceId: 'known-device' },
  locationInfo: { city: 'Pune' },
  ...overrides
});

describe('behavioral risk features', () => {
  test('keeps known devices out of device-change scoring', () => {
    const features = buildBehavioralFeatures(
      {
        amount: 1000,
        receiverUpi: 'familiar@upi',
        deviceId: 'known-device'
      },
      [transaction(1)],
      referenceTime
    );

    expect(features.knownDevice).toBe(true);
    expect(features.deviceChanged).toBe(false);
    expect(calculateBehavioralRisk(features).reasons).not.toContain(
      'Rapid payment from a changed device'
    );
  });

  test('scores an unfamiliar device once rapid conditions are present', () => {
    const features = buildBehavioralFeatures(
      {
        amount: 1000,
        receiverUpi: 'familiar@upi',
        deviceId: 'new-device'
      },
      [transaction(1)],
      referenceTime
    );

    expect(features.knownDevice).toBe(false);
    expect(features.deviceChanged).toBe(true);
    expect(calculateBehavioralRisk(features)).toMatchObject({
      contribution: 9,
      reasons: expect.arrayContaining(['Rapid payment from a changed device'])
    });
  });

  test('does not score a device change without rapid activity', () => {
    const features = buildBehavioralFeatures(
      {
        amount: 1000,
        receiverUpi: 'familiar@upi',
        deviceId: 'new-device'
      },
      [transaction(30)],
      referenceTime
    );

    expect(features.deviceChanged).toBe(true);
    expect(calculateBehavioralRisk(features).reasons).not.toContain(
      'Rapid payment from a changed device'
    );
  });

  test('does not add duplicate device-change points', () => {
    const features = buildBehavioralFeatures(
      {
        amount: 1000,
        receiverUpi: 'familiar@upi',
        deviceId: 'new-device'
      },
      [transaction(1)],
      referenceTime
    );

    const result = calculateBehavioralRisk(features);
    expect(result.reasons.filter((reason) => reason === 'Rapid payment from a changed device')).toHaveLength(1);
    expect(result.contribution).toBe(9);
  });
});
