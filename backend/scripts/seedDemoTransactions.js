require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const db = require('../database/connection');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const DEMO_USER_EMAIL = 'adhityabollam@gmail.com';
const DEMO_COUNT = 150;
const SEED_MARKER = { isDemoData: true };

const monthPlans = [
  { year: 2026, month: 5, days: 30, low: 18, moderate: 4, high: 2 },
  { year: 2026, month: 6, days: 31, low: 20, moderate: 7, high: 5 },
  { year: 2026, month: 7, days: 31, low: 23, moderate: 9, high: 6 },
  { year: 2026, month: 8, days: 30, low: 20, moderate: 10, high: 6 },
  { year: 2026, month: 9, days: 3, low: 9, moderate: 5, high: 6 }
];

const normalAmounts = [100, 250, 500, 750, 1000, 1500, 2000, 3000, 5000, 7500];
const moderateAmounts = [1500, 3000, 5000, 7500, 10000, 15000, 20000, 25000, 40000];
const highAmounts = [15000, 20000, 25000, 40000, 60000, 75000, 95000];
const receivers = [
  ['Aarav Mehta', 'aarav@okhdfcbank'],
  ['Meera Nair', 'meera@ybl'],
  ['Rohan Shah', 'rohan@okaxis'],
  ['Kavya Iyer', 'kavya@oksbi'],
  ['Neha Kapoor', 'neha@okicici'],
  ['Arjun Rao', 'arjun@paytm'],
  ['Ishita Sen', 'ishita@upi']
];
const purposes = ['Groceries', 'Rent payment', 'Utilities', 'Dinner', 'Travel', 'Subscription', 'Gift', 'Personal transfer'];
const cities = ['Bengaluru', 'Mumbai', 'Pune', 'Hyderabad', 'Chennai', 'Delhi'];
const categories = ['food', 'shopping', 'bills', 'transport', 'subscription'];

let randomState = 20261003;
const random = () => {
  randomState = (randomState * 1664525 + 1013904223) >>> 0;
  return randomState / 4294967296;
};
const pick = (values) => values[Math.floor(random() * values.length)];
const integer = (min, max) => Math.floor(random() * (max - min + 1)) + min;
const createId = (prefix, index) => `${prefix}${Date.now().toString(36).toUpperCase()}D${String(index).padStart(3, '0')}`;

const buildProfiles = () => {
  const profiles = [];
  monthPlans.forEach((plan) => {
    ['LOW', 'MEDIUM', 'HIGH'].forEach((riskLevel) => {
      const count = riskLevel === 'LOW' ? plan.low : riskLevel === 'MEDIUM' ? plan.moderate : plan.high;
      for (let index = 0; index < count; index += 1) {
        profiles.push({ ...plan, riskLevel });
      }
    });
  });
  return profiles;
};

const buildRiskData = (riskLevel) => {
  if (riskLevel === 'LOW') {
    const riskScore = integer(3, 28);
    return {
      riskLevel,
      riskScore,
      fraudProbability: riskScore / 100,
      predictionStatus: 'COMPLETED',
      predictionConfidence: integer(88, 98),
      deviceChanged: false,
      locationChanged: false,
      newBeneficiary: false,
      knownDevice: true,
      trustedDevice: true,
      beneficiaryFrequency: integer(8, 30),
      velocity: integer(0, 2),
      uniqueReceivers: integer(1, 3),
      behaviourDeviation: Number((random() * 0.18).toFixed(2)),
      senderAge: integer(500, 1800),
      receiverAge: integer(250, 1200),
      reasons: []
    };
  }

  if (riskLevel === 'MEDIUM') {
    const riskScore = integer(32, 49);
    const deviceChanged = random() < 0.2;
    const locationChanged = random() < 0.25;
    const newBeneficiary = random() < 0.45;
    return {
      riskLevel,
      riskScore,
      fraudProbability: riskScore / 100,
      predictionStatus: 'COMPLETED',
      predictionConfidence: integer(72, 88),
      deviceChanged,
      locationChanged,
      newBeneficiary,
      knownDevice: !deviceChanged,
      trustedDevice: !deviceChanged,
      beneficiaryFrequency: newBeneficiary ? integer(0, 4) : integer(3, 12),
      velocity: integer(2, 7),
      uniqueReceivers: integer(3, 7),
      behaviourDeviation: Number((0.25 + random() * 0.3).toFixed(2)),
      senderAge: integer(180, 700),
      receiverAge: integer(30, 300),
      reasons: ['Moderate transaction velocity']
    };
  }

  const riskScore = integer(62, 95);
  return {
    riskLevel,
    riskScore,
    fraudProbability: riskScore / 100,
    predictionStatus: 'COMPLETED',
    predictionConfidence: integer(86, 99),
    deviceChanged: true,
    locationChanged: true,
    newBeneficiary: true,
    knownDevice: false,
    trustedDevice: false,
    beneficiaryFrequency: integer(0, 1),
    velocity: integer(8, 25),
    uniqueReceivers: integer(8, 16),
    behaviourDeviation: Number((0.72 + random() * 0.27).toFixed(2)),
    senderAge: integer(5, 90),
    receiverAge: integer(1, 45),
    reasons: ['Unknown device', 'High transaction velocity', 'Location changed', 'New beneficiary']
  };
};

const buildTransaction = (profile, user, index) => {
  const risk = buildRiskData(profile.riskLevel);
  const transactionTime = new Date(Date.UTC(
    profile.year,
    profile.month,
    integer(1, profile.days),
    integer(7, 17),
    integer(0, 59),
    integer(0, 59)
  ));
  const receiver = pick(receivers);
  const amount = profile.riskLevel === 'LOW'
    ? pick(normalAmounts)
    : profile.riskLevel === 'MEDIUM'
      ? pick(moderateAmounts)
      : pick(highAmounts);
  const city = pick(cities);
  const transactionId = createId('TXN', index);
  const referenceNumber = createId('REF', index);
  const receiptNumber = createId('RCPT', index);
  const fraudReasons = risk.reasons.map((description) => ({ feature: description, impact: 0.1, description }));

  return {
    transactionId,
    referenceNumber,
    receiptNumber,
    sender: {
      userId: user._id,
      name: user.fullName || `${user.firstName} ${user.lastName}`.trim(),
      upiId: user.email,
      accountNumber: null
    },
    receiver: {
      name: receiver[0],
      upiId: receiver[1],
      accountNumber: null,
      bankName: 'Demo Bank',
      ifscCode: null
    },
    senderUpi: user.email,
    receiverUpi: receiver[1],
    beneficiary: null,
    amount,
    transactionType: random() < 0.22 ? 'P2M' : 'P2P',
    merchantCategory: random() < 0.22 ? pick(categories) : '',
    purpose: pick(purposes),
    note: 'Demo visualization transaction',
    paymentMethod: 'UPI',
    status: 'SUCCESS',
    riskScore: risk.riskScore,
    fraudProbability: risk.fraudProbability,
    riskLevel: risk.riskLevel === 'HIGH' && risk.riskScore >= 85 ? 'CRITICAL' : risk.riskLevel,
    predictionStatus: risk.predictionStatus,
    predictionConfidence: risk.predictionConfidence,
    fraudReasons,
    deviceInfo: {
      deviceId: `DEMO-DEVICE-${String(index % 12).padStart(2, '0')}`,
      deviceName: risk.knownDevice ? 'Primary mobile' : 'Unknown device',
      deviceType: 'Mobile',
      browser: 'Chrome',
      os: 'Android',
      isTrusted: risk.trustedDevice
    },
    locationInfo: { city, state: 'Demo State', country: 'India' },
    ipAddress: `10.20.${index % 20}.${(index % 240) + 10}`,
    transactionTime,
    completedAt: new Date(transactionTime.getTime() + integer(10, 90) * 1000),
    fraudAnalysis: {
      riskScore: risk.riskScore,
      fraudProbability: risk.fraudProbability,
      riskLevel: risk.riskLevel === 'HIGH' && risk.riskScore >= 85 ? 'CRITICAL' : risk.riskLevel,
      confidence: risk.predictionConfidence,
      features: {
        customerBehaviourDeviation: risk.behaviourDeviation,
        deviceChanged: risk.deviceChanged,
        newBeneficiary: risk.newBeneficiary,
        locationChanged: risk.locationChanged,
        highVelocity: risk.velocity >= 8,
        transactionFrequency: risk.velocity,
        amountLast24Hours: amount * integer(1, 4)
      },
      reasons: fraudReasons,
      modelVersion: 'Demo seeded data',
      analysisTimestamp: transactionTime
    },
    device: {
      deviceId: `DEMO-DEVICE-${String(index % 12).padStart(2, '0')}`,
      deviceName: risk.knownDevice ? 'Primary mobile' : 'Unknown device',
      deviceType: 'Mobile',
      browser: 'Chrome',
      os: 'Android',
      ipAddress: `10.20.${index % 20}.${(index % 240) + 10}`,
      location: { city, state: 'Demo State', country: 'India' },
      isTrusted: risk.trustedDevice
    },
    timing: {
      date: transactionTime,
      time: transactionTime.toLocaleTimeString('en-IN'),
      hour: transactionTime.getUTCHours(),
      dayOfWeek: transactionTime.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }),
      isBusinessHour: transactionTime.getUTCHours() >= 9 && transactionTime.getUTCHours() < 18
    },
    currency: 'INR',
    notes: 'Demo visualization transaction',
    isBeneficiarySaved: risk.riskLevel === 'LOW',
    isReported: false,
    receiptGenerated: true,
    receiptUrl: null,
    isDemoData: true
  };
};

const summarize = (rows) => ({
  count: rows.length,
  amount: rows.reduce((total, row) => total + row.amount, 0),
  riskLevels: rows.reduce((counts, row) => {
    counts[row.riskLevel] = (counts[row.riskLevel] || 0) + 1;
    return counts;
  }, {}),
  months: rows.reduce((counts, row) => {
    const month = row.transactionTime.toISOString().slice(0, 7);
    counts[month] = (counts[month] || 0) + 1;
    return counts;
  }, {})
});

const repairDemoRiskLevels = async (demoRows) => {
  const profiles = buildProfiles();
  for (const row of demoRows) {
    const match = row.transactionId.match(/D(\d{3})$/);
    const profile = match ? profiles[Number(match[1]) - 1] : null;
    if (!profile) throw new Error(`Unable to map demo transaction index: ${row.transactionId}`);
    const riskLevel = profile.riskLevel === 'HIGH' && row.riskScore >= 85 ? 'CRITICAL' : profile.riskLevel;
    const riskScore = profile.riskLevel === 'MEDIUM' ? Math.min(row.riskScore, 49) : row.riskScore;
    await Transaction.updateOne(
      { _id: row._id },
      { $set: {
        riskLevel,
        riskScore,
        fraudProbability: riskScore / 100,
        'fraudAnalysis.riskLevel': riskLevel,
        'fraudAnalysis.riskScore': riskScore,
        'fraudAnalysis.fraudProbability': riskScore / 100
      } }
    );
  }
};

const normalizeDemoDates = async (demoRows) => {
  const hasLateOctoberRecord = demoRows.some((row) => {
    const date = new Date(row.transactionTime);
    return date.getUTCFullYear() === 2026 && date.getUTCMonth() === 9 && date.getUTCDate() === 3 && date.getUTCHours() >= 18;
  });
  if (!hasLateOctoberRecord) return;

  const offset = 6 * 60 * 60 * 1000;
  for (const row of demoRows) {
    const transactionTime = new Date(new Date(row.transactionTime).getTime() - offset);
    const completedAt = row.completedAt ? new Date(new Date(row.completedAt).getTime() - offset) : null;
    await Transaction.updateOne(
      { _id: row._id },
      {
        $set: {
          transactionTime,
          completedAt,
          'fraudAnalysis.analysisTimestamp': transactionTime,
          'timing.date': transactionTime,
          'timing.time': transactionTime.toLocaleTimeString('en-IN'),
          'timing.hour': transactionTime.getUTCHours(),
          'timing.dayOfWeek': transactionTime.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })
        }
      }
    );
  }
};

const run = async () => {
  await db.connect(process.env.MONGODB_URI);
  const user = await User.findOne({ email: DEMO_USER_EMAIL });
  if (!user || !user.isEmailVerified) {
    throw new Error(`Verified demo user not found: ${DEMO_USER_EMAIL}`);
  }

  const before = await Transaction.find({ 'sender.userId': user._id }).lean();
  const existingDemo = before.filter((row) => row.isDemoData === true);
  if (existingDemo.length === DEMO_COUNT) {
    await normalizeDemoDates(existingDemo);
    const expectedRiskCounts = { LOW: 90, MEDIUM: 35, HIGH: 0, CRITICAL: 0 };
    const currentRiskCounts = summarize(existingDemo).riskLevels;
    const currentHighRiskCount = (currentRiskCounts.HIGH || 0) + (currentRiskCounts.CRITICAL || 0);
    const currentDemoFraudCount = existingDemo.filter((row) => row.riskLevel === 'HIGH' || row.riskLevel === 'CRITICAL' || row.fraudProbability >= 0.5).length;
    if (currentRiskCounts.LOW !== expectedRiskCounts.LOW || currentRiskCounts.MEDIUM !== expectedRiskCounts.MEDIUM || currentHighRiskCount !== 25 || currentDemoFraudCount !== 25) {
      await repairDemoRiskLevels(existingDemo);
    }
    console.log(`Demo dataset already exists for ${DEMO_USER_EMAIL}; no records inserted.`);
    console.log(JSON.stringify({ existingRecords: before.length, demoRecords: existingDemo.length }, null, 2));
    return;
  }
  if (existingDemo.length > 0) {
    throw new Error(`Refusing to seed: found ${existingDemo.length} partial demo records; expected 0 or ${DEMO_COUNT}.`);
  }

  const realBefore = before.filter((row) => row.isDemoData !== true);
  const profiles = buildProfiles();
  if (profiles.length !== DEMO_COUNT) {
    throw new Error(`Seed plan generated ${profiles.length} records instead of ${DEMO_COUNT}.`);
  }

  const transactions = profiles.map((profile, index) => buildTransaction(profile, user, index + 1));
  const existingTransactionIds = new Set(before.map((row) => row.transactionId));
  if (transactions.some((row) => existingTransactionIds.has(row.transactionId))) {
    throw new Error('Refusing to seed: generated transaction ID collides with existing data.');
  }

  const inserted = await Transaction.insertMany(transactions, { ordered: true });
  const after = await Transaction.find({ 'sender.userId': user._id }).lean();
  const demoAfter = after.filter((row) => row.isDemoData === true);
  const realAfter = after.filter((row) => row.isDemoData !== true);
  const uniqueMongoIds = new Set(after.map((row) => String(row._id))).size;
  const uniqueTransactionIds = new Set(after.map((row) => row.transactionId)).size;
  const realUnchanged = realBefore.every((original) => {
    const current = realAfter.find((row) => String(row._id) === String(original._id));
    return current && current.transactionId === original.transactionId && current.amount === original.amount && String(current.updatedAt) === String(original.updatedAt);
  });

  if (inserted.length !== DEMO_COUNT || demoAfter.length !== DEMO_COUNT || after.length !== before.length + DEMO_COUNT || uniqueMongoIds !== after.length || uniqueTransactionIds !== after.length || realAfter.length !== realBefore.length || !realUnchanged) {
    throw new Error('Post-seed verification failed; inspect the database before retrying.');
  }

  console.log('Demo seed completed successfully.');
  console.log(JSON.stringify({
    user: DEMO_USER_EMAIL,
    existingRecordsBefore: before.length,
    newDemoRecords: inserted.length,
    existingRealRecordsPreserved: realAfter.length,
    finalRecords: after.length,
    uniqueMongoIds,
    uniqueTransactionIds,
    duplicateTransactionIds: after.length - uniqueTransactionIds,
    demoSummary: summarize(inserted)
  }, null, 2));
};

run()
  .catch((error) => {
    console.error(`Demo seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (db.isConnected()) await db.disconnect();
  });
