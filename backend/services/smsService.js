require('dotenv').config();
const axios = require('axios');
const logger = require('../middlewares/logger');
const ApiError = require('../utils/ApiError');

const BREVO_SMS_URL = 'https://api.brevo.com/v3/transactionalSMS/send';

const formatIndianPhoneNumber = (phone) => {
  const value = String(phone || '').trim();
  const digits = value.replace(/\D/g, '');

  if (/^\+91\d{10}$/.test(value)) {
    return value;
  }

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }

  throw ApiError.badRequest('Please provide a valid Indian mobile number');
};

const getProviderErrorMessage = (error) => {
  const providerMessage = error?.response?.data?.message || error?.response?.data?.code;
  if (error?.response?.status === 401 || error?.response?.status === 403) {
    return 'SMS service authentication or sender configuration failed. Check the Brevo API key and approved sender ID.';
  }
  if (error?.response?.status === 402) {
    return 'SMS service has insufficient credits. Please add Brevo SMS credits.';
  }
  if (error?.response?.status === 429) {
    return 'SMS service rate limit reached. Please try again later.';
  }
  if (providerMessage && /invalid|mobile|phone|recipient|country/i.test(providerMessage)) {
    return 'The mobile number is invalid or SMS delivery is not available in this country.';
  }
  if (!error?.response) {
    return 'SMS service is temporarily unavailable. Please try again later.';
  }
  return 'The SMS provider rejected this message. Check the sender, template, credits, and country restrictions.';
};

const sendSms = async ({ recipient, content, tag }) => {
  const apiKey = process.env.BREVO_API_KEY;
  const sender = process.env.BREVO_SMS_SENDER;

  if (!apiKey) {
    throw ApiError.serviceUnavailable('SMS service is not configured. Set BREVO_API_KEY in backend/.env');
  }
  if (!sender) {
    throw ApiError.serviceUnavailable('SMS sender is not configured. Set BREVO_SMS_SENDER in backend/.env');
  }

  const formattedRecipient = formatIndianPhoneNumber(recipient);

  try {
    const response = await axios.post(
      BREVO_SMS_URL,
      {
        sender,
        recipient: formattedRecipient,
        content,
        ...(tag ? { tag } : {})
      },
      {
        headers: {
          accept: 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json'
        },
        timeout: 10000
      }
    );

    logger.info('Brevo SMS accepted by provider', {
      statusCode: response.status,
      messageId: response.data?.messageId || null,
      recipient: `${formattedRecipient.slice(0, 3)}******${formattedRecipient.slice(-2)}`
    });

    return {
      success: true,
      provider: 'brevo',
      accepted: true,
      statusCode: response.status,
      messageId: response.data?.messageId || null
    };
  } catch (error) {
    logger.error('Brevo SMS send failed', {
      statusCode: error?.response?.status,
      code: error?.response?.data?.code || error?.code,
      message: error?.message
    });
    throw ApiError.serviceUnavailable(getProviderErrorMessage(error));
  }
};

module.exports = {
  sendSms,
  formatIndianPhoneNumber
};
