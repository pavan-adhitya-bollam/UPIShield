const RISK_LEVELS = [
  { minimum: 80, level: 'CRITICAL' },
  { minimum: 60, level: 'HIGH' },
  { minimum: 30, level: 'MEDIUM' },
  { minimum: 0, level: 'LOW' }
];

const getTransactionTime = (transaction) => {
  const value = transaction.transactionTime || transaction.createdAt;
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
};

const isCompletedTransaction = (transaction) => (
  transaction.status === 'SUCCESS'
);

const buildBehavioralFeatures = (transactionData, previousTransactions, referenceTime = new Date()) => {
  const transactionAmount = Number(transactionData.amount || 0);
  const history = previousTransactions
    .filter(isCompletedTransaction)
    .map((transaction) => ({ transaction, time: getTransactionTime(transaction) }))
    .filter(({ time }) => time && time <= referenceTime)
    .sort((left, right) => right.time - left.time);
  const inWindow = (milliseconds) => history.filter(({ time }) => (
    referenceTime - time <= milliseconds
  ));
  const lastMinute = inWindow(60 * 1000);
  const lastFiveMinutes = inWindow(5 * 60 * 1000);
  const lastTenMinutes = inWindow(10 * 60 * 1000);
  const lastHour = inWindow(60 * 60 * 1000);
  const lastDay = inWindow(24 * 60 * 60 * 1000);
  const historicalAmounts = history
    .map(({ transaction }) => Number(transaction.amount))
    .filter((amount) => Number.isFinite(amount) && amount > 0);
  const averageAmount = historicalAmounts.length
    ? historicalAmounts.reduce((sum, amount) => sum + amount, 0) / historicalAmounts.length
    : 0;
  const previous = history[0]?.transaction;
  const previousTime = history[0]?.time;
  const receiversInWindow = new Set(
    lastTenMinutes
      .map(({ transaction }) => transaction.receiverUpi)
      .filter(Boolean)
  );
  const receiversToday = new Set(
    history
      .filter(({ time }) => time.toDateString() === referenceTime.toDateString())
      .map(({ transaction }) => transaction.receiverUpi)
      .filter(Boolean)
  );
  const amountLastFiveMinutes = lastFiveMinutes.reduce(
    (sum, { transaction }) => sum + Number(transaction.amount || 0),
    0
  );
  const amountLast24Hours = lastDay.reduce(
    (sum, { transaction }) => sum + Number(transaction.amount || 0),
    0
  );
  const timeSincePreviousTransaction = previousTime
    ? Math.max(0, referenceTime - previousTime)
    : null;
  const newBeneficiary = !history.some(({ transaction }) => (
    transaction.receiverUpi === transactionData.receiverUpi
  ));
  const knownDevice = Boolean(transactionData.deviceId) && history.some(({ transaction }) => (
    transaction.deviceInfo?.deviceId === transactionData.deviceId
  ));
  const deviceChanged = Boolean(transactionData.deviceId) && !knownDevice;
  const locationChanged = Boolean(transactionData.location?.city) &&
    Boolean(previous?.locationInfo?.city) &&
    previous.locationInfo.city !== transactionData.location.city;
  const deviation = averageAmount > 0
    ? Math.min(transactionAmount / averageAmount, 10)
    : 0;

  return {
    ...transactionData,
    transactionTime: referenceTime,
    transactionsLast1Minute: lastMinute.length,
    transactionsLast5Minutes: lastFiveMinutes.length,
    transactionsLast10Minutes: lastTenMinutes.length,
    transactionsLastHour: lastHour.length,
    amountSentLast5Minutes: amountLastFiveMinutes,
    amountSentLast24Hours: amountLast24Hours,
    uniqueReceiversLast10Minutes: receiversInWindow.size,
    uniqueReceiversToday: receiversToday.size,
    historicalAverageAmount: averageAmount,
    timeSincePreviousTransactionMs: timeSincePreviousTransaction,
    transactionFrequencyPerHour: lastHour.length,
    customerBehaviourDeviation: deviation,
    knownDevice,
    deviceChanged,
    locationChanged,
    newBeneficiary,
    decimalPattern: Math.round(transactionAmount * 100) % 100 !== 0,
    previousTransactionCount: history.length
  };
};

const calculateBehavioralRisk = (features) => {
  const amount = Number(features.amount || 0);
  const average = Number(features.historicalAverageAmount || 0);
  const deviation = Number(features.customerBehaviourDeviation || 0);
  const rapid = features.transactionsLast1Minute > 0 || features.transactionsLast5Minutes >= 2;
  let contribution = 0;
  const reasons = [];

  if (features.transactionsLast1Minute > 0) {
    contribution += 4;
    reasons.push('Transaction immediately follows another payment');
  }
  if (features.transactionsLast5Minutes >= 2) {
    contribution += 8;
    reasons.push('Multiple transactions within five minutes');
  }
  if (features.transactionsLast10Minutes >= 3) {
    contribution += 8;
    reasons.push('High transaction velocity within ten minutes');
  }
  if (features.transactionsLastHour >= 5) {
    contribution += 6;
    reasons.push('High transaction frequency within one hour');
  }
  if (features.amountSentLast5Minutes >= 50000 || (rapid && features.amountSentLast5Minutes >= 2 * Math.max(average, 1))) {
    contribution += 6;
    reasons.push('High cumulative amount in a short period');
  }
  if (deviation >= 5) {
    contribution += 10;
    reasons.push('Amount is highly unusual for this account');
  } else if (deviation >= 3) {
    contribution += 6;
    reasons.push('Amount is unusually high for this account');
  }
  if (features.uniqueReceiversLast10Minutes >= 2) {
    contribution += 4;
    reasons.push('Multiple recipients in a short period');
  }
  if (features.newBeneficiary && rapid) {
    contribution += 4;
    reasons.push('Rapid payment to a new recipient');
  }
  if (features.deviceChanged && rapid) {
    contribution += 5;
    reasons.push('Rapid payment from a changed device');
  }
  if (features.locationChanged && rapid) {
    contribution += 4;
    reasons.push('Rapid payment from a changed location');
  }
  if (features.decimalPattern && contribution > 0) {
    contribution += 1;
    reasons.push('Unusual decimal amount pattern');
  }

  return {
    contribution: Math.min(contribution, 40),
    reasons,
    signals: {
      rapid,
      amount,
      historicalAverageAmount: average,
      deviation
    }
  };
};

const classifyRiskLevel = (score) => (
  RISK_LEVELS.find(({ minimum }) => score >= minimum).level
);

module.exports = {
  buildBehavioralFeatures,
  calculateBehavioralRisk,
  classifyRiskLevel,
  isCompletedTransaction
};
