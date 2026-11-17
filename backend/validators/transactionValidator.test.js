const { validationResult } = require('express-validator');
const { sendMoneyValidation } = require('./transactionValidator');

// Helper to run express-validator middleware chain against mock request
const runValidation = async (req) => {
  for (const middleware of sendMoneyValidation) {
    await middleware(req, {}, () => {});
  }
  return validationResult(req);
};

describe('sendMoneyValidation - all transaction types and payment methods', () => {
  const transactionTypes = ['P2P', 'P2M', 'TRANSFER', 'person', 'merchant', 'bank'];
  const paymentMethods = ['UPI', 'BANK_ACCOUNT', 'DEBIT_CARD', 'bank', 'card', 'upi'];

  test.each([
    // All 9 core combinations using canonical names
    ['P2P', 'UPI'],
    ['P2P', 'BANK_ACCOUNT'],
    ['P2P', 'DEBIT_CARD'],
    ['P2M', 'UPI'],
    ['P2M', 'BANK_ACCOUNT'],
    ['P2M', 'DEBIT_CARD'],
    ['TRANSFER', 'UPI'],
    ['TRANSFER', 'BANK_ACCOUNT'],
    ['TRANSFER', 'DEBIT_CARD'],
    // All combinations using frontend raw values
    ['person', 'upi'],
    ['person', 'bank'],
    ['person', 'card'],
    ['merchant', 'upi'],
    ['merchant', 'bank'],
    ['merchant', 'card'],
    ['bank', 'upi'],
    ['bank', 'bank'],
    ['bank', 'card']
  ])('accepts transactionType=%s and paymentMethod=%s', async (transactionType, paymentMethod) => {
    const req = {
      body: {
        receiverUpi: 'receiver@upi',
        amount: 500,
        transactionType,
        paymentMethod
      }
    };

    const result = await runValidation(req);
    expect(result.isEmpty()).toBe(true);
  });

  test('accepts receiverUpi as a 12-digit bank account number for bank transfers', async () => {
    const req = {
      body: {
        receiverUpi: '123456789012',
        amount: 1000,
        transactionType: 'bank',
        paymentMethod: 'bank'
      }
    };

    const result = await runValidation(req);
    expect(result.isEmpty()).toBe(true);
    expect(req.body.transactionType).toBe('TRANSFER');
    expect(req.body.paymentMethod).toBe('BANK_ACCOUNT');
  });

  test('normalizes raw frontend values correctly', async () => {
    const req = {
      body: {
        receiverUpi: 'john@okhdfcbank',
        amount: 250,
        transactionType: 'bank',
        paymentMethod: 'card'
      }
    };

    const result = await runValidation(req);
    expect(result.isEmpty()).toBe(true);
    expect(req.body.transactionType).toBe('TRANSFER');
    expect(req.body.paymentMethod).toBe('DEBIT_CARD');
  });

  test('rejects invalid receiver and negative amounts', async () => {
    const req = {
      body: {
        receiverUpi: 'not-a-valid-upi-or-account',
        amount: -10,
        transactionType: 'P2P',
        paymentMethod: 'UPI'
      }
    };

    const result = await runValidation(req);
    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(errors.some(e => e.path === 'receiverUpi')).toBe(true);
    expect(errors.some(e => e.path === 'amount')).toBe(true);
  });
});
