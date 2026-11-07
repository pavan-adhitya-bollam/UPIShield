require('dotenv').config();
const nodemailer = require('nodemailer');
const axios = require('axios');
const logger = require('../middlewares/logger');
const ApiError = require('../utils/ApiError');

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
let cachedTransporter = null;
let lastTransporterConfigKey = null;

/**
 * Retrieve Brevo configuration dynamically from environment variables
 */
const getSmtpConfig = () => {
  const host = process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com';
  const port = Number(process.env.BREVO_SMTP_PORT || 587);
  const secure = port === 465;
  const user = process.env.BREVO_SMTP_USER || process.env.BREVO_SMTP_LOGIN || process.env.BREVO_USER;
  const pass = process.env.BREVO_SMTP_KEY || process.env.BREVO_SMTP_PASSWORD || process.env.BREVO_SMTP_PASS || process.env.BREVO_PASSWORD;
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = (process.env.BREVO_FROM_EMAIL || process.env.FROM_EMAIL || 'upishieldweb@gmail.com').trim();
  const fromName = (process.env.BREVO_FROM_NAME || process.env.FROM_NAME || 'UPI Shield').trim();

  return {
    host,
    port,
    secure,
    user,
    pass,
    apiKey,
    fromEmail,
    fromName
  };
};

/**
 * Check if the given key is a Brevo API v3 key format (xkeysib-...)
 */
const isBrevoApiKey = (key) => typeof key === 'string' && key.trim().startsWith('xkeysib-');

/**
 * Reset cached transporter (useful when env changes or during tests)
 */
const resetTransporter = () => {
  cachedTransporter = null;
  lastTransporterConfigKey = null;
};

/**
 * Get or create the Nodemailer transporter instance
 */
const getTransporter = () => {
  const config = getSmtpConfig();
  const configKey = `${config.host}:${config.port}:${config.user}:${config.pass}`;

  if (cachedTransporter && lastTransporterConfigKey === configKey) {
    return cachedTransporter;
  }

  if (!config.host || !config.user || !config.pass) {
    const errorMessage = 'Brevo SMTP is not configured. Set BREVO_SMTP_HOST, BREVO_SMTP_PORT, BREVO_SMTP_USER, and BREVO_SMTP_KEY in backend/.env';
    logger.error(errorMessage, { host: config.host, hasUser: !!config.user, hasKey: !!config.pass });
    throw ApiError.serviceUnavailable('Email service is not configured. Please contact support.');
  }

  cachedTransporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    tls: {
      rejectUnauthorized: false
    }
  });
  lastTransporterConfigKey = configKey;

  return cachedTransporter;
};

/**
 * Send email via Brevo REST API v3 over HTTPS (Port 443)
 * Avoids outbound SMTP port blocking on cloud hosts like Render Free tier
 */
const sendViaBrevoApi = async ({ to, subject, text, html, senderEmail, senderName, apiKey }) => {
  const recipients = (Array.isArray(to) ? to : [to]).map((recipient) => {
    if (typeof recipient === 'string') {
      return { email: recipient.trim() };
    }
    return { email: recipient.email?.trim(), name: recipient.name };
  });

  const payload = {
    sender: {
      name: senderName,
      email: senderEmail
    },
    to: recipients,
    subject,
    htmlContent: html,
    textContent: text
  };

  const response = await axios.post(BREVO_API_URL, payload, {
    headers: {
      accept: 'application/json',
      'api-key': apiKey.trim(),
      'content-type': 'application/json'
    },
    timeout: 10000
  });

  return {
    success: true,
    provider: 'brevo-api',
    accepted: true,
    messageId: response.data?.messageId || null,
    statusCode: response.status
  };
};

/**
 * Send email via Nodemailer SMTP Relay
 */
const sendViaSmtp = async ({ to, subject, text, html, senderEmail, senderName }) => {
  const message = {
    to,
    from: {
      name: senderName,
      address: senderEmail
    },
    sender: senderEmail,
    replyTo: senderEmail,
    envelope: {
      from: senderEmail,
      to: Array.isArray(to) ? to : [to]
    },
    subject,
    text: text || 'UPI Shield notification',
    html
  };

  const transporter = getTransporter();
  const response = await transporter.sendMail(message);

  return {
    success: true,
    provider: 'brevo-smtp',
    accepted: true,
    messageId: response.messageId || null,
    response: response.response
  };
};

/**
 * Verify SMTP connection or Brevo API credentials
 */
const verifyConnection = async () => {
  const config = getSmtpConfig();

  // If a Brevo API key is available, verify via Brevo API v3
  if (isBrevoApiKey(config.apiKey)) {
    try {
      const response = await axios.get('https://api.brevo.com/v3/account', {
        headers: {
          accept: 'application/json',
          'api-key': config.apiKey.trim()
        },
        timeout: 5000
      });
      return { verified: true, provider: 'brevo-api', email: response.data?.email };
    } catch (apiErr) {
      logger.warn('Brevo API verification check warning', { message: apiErr.message });
      if (!config.user || !config.pass) {
        throw apiErr;
      }
    }
  }

  // Otherwise, verify SMTP connection
  try {
    const transporter = getTransporter();
    const result = await transporter.verify();
    return result;
  } catch (error) {
    cachedTransporter = null;
    throw error;
  }
};

/**
 * Send an email using Brevo (HTTPS REST API or SMTP relay)
 */
const sendEmail = async ({ to, subject, text, html, from, fromName }) => {
  const config = getSmtpConfig();

  const senderEmail = (from || config.fromEmail || 'upishieldweb@gmail.com').trim();
  const senderName = (fromName || config.fromName || 'UPI Shield').trim();

  if (!senderEmail) {
    const errorMessage = 'Brevo sender email is missing. Set BREVO_FROM_EMAIL in backend/.env';
    logger.error(errorMessage, { subject });
    throw ApiError.serviceUnavailable('Email service is not configured. Please contact support.');
  }

  const defaultHtml = html || `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
      <div style="max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff;">
        <div style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 12px;">UPI Shield</div>
        <p style="margin: 0 0 12px; font-size: 16px;">Your one-time password (OTP) is below.</p>
        <div style="padding: 20px; border-radius: 10px; background: #f3f4f6; text-align: center; margin: 18px 0; font-size: 32px; letter-spacing: 4px; font-weight: 700; color: #111827;">
          ${text ? text.match(/\d{6}/)?.[0] || '******' : '******'}
        </div>
        <p style="margin: 0; font-size: 14px; color: #4b5563;">This code expires in 10 minutes. Do not share it with anyone.</p>
      </div>
    </div>
  `;

  const hasApiKey = isBrevoApiKey(config.apiKey);
  const hasSmtpConfig = Boolean(config.host && config.user && config.pass);

  if (!hasApiKey && !hasSmtpConfig) {
    const errorMessage = 'Email service is not configured. Set BREVO_API_KEY (recommended on Render) or BREVO_SMTP_USER & BREVO_SMTP_KEY in environment variables.';
    logger.error(errorMessage);
    throw ApiError.serviceUnavailable('Email service is not configured. Please contact support.');
  }

  // 1. Prefer Brevo HTTPS API (Port 443) when a valid API key is present — avoids SMTP port 587/465 blocks on cloud platforms
  if (hasApiKey) {
    try {
      const result = await sendViaBrevoApi({
        to,
        subject,
        text: text || 'UPI Shield notification',
        html: defaultHtml,
        senderEmail,
        senderName,
        apiKey: config.apiKey
      });

      logger.info('Brevo API email accepted', {
        subject,
        messageId: result.messageId,
        provider: 'brevo-api'
      });

      return result;
    } catch (apiError) {
      logger.warn('Brevo API delivery attempt failed', {
        statusCode: apiError?.response?.status,
        message: apiError?.response?.data?.message || apiError?.message
      });

      if (apiError?.response?.status === 401 || apiError?.response?.status === 403) {
        throw ApiError.serviceUnavailable('Brevo API authentication failed. Verify BREVO_API_KEY (must start with xkeysib-) in environment variables.');
      }
      if (apiError?.response?.status === 400 && /sender/i.test(apiError?.response?.data?.message || '')) {
        throw ApiError.serviceUnavailable(`Brevo rejected sender address (${senderEmail}). Ensure this sender is verified in your Brevo account under Senders & IP.`);
      }

      if (!hasSmtpConfig) {
        throw ApiError.serviceUnavailable(`Brevo email delivery failed: ${apiError?.response?.data?.message || apiError?.message}`);
      }
      logger.info('Falling back to Brevo SMTP relay');
    }
  }

  // 2. SMTP Delivery (default or fallback from API)
  try {
    const result = await sendViaSmtp({
      to,
      subject,
      text: text || 'UPI Shield notification',
      html: defaultHtml,
      senderEmail,
      senderName
    });

    logger.info('Brevo SMTP email accepted', {
      subject,
      response: result.response,
      messageId: result.messageId
    });

    return result;
  } catch (error) {
    cachedTransporter = null; // Invalidate cached transporter on error to reconnect cleanly

    const recipientDomain = String(to || '').split('@')[1] || '';
    const maskedRecipient = to
      ? `${String(to).split('@')[0].slice(0, 3)}***@${recipientDomain}`
      : 'unknown';

    logger.error('Brevo SMTP email send failed', {
      subject,
      recipient: maskedRecipient,
      code: error?.code,
      responseCode: error?.responseCode,
      command: error?.command,
      errorMessage: error?.message
    });

    if (error?.code === 'EAUTH' || error?.responseCode === 535) {
      throw ApiError.serviceUnavailable('Brevo SMTP authentication failed. Please verify BREVO_SMTP_USER and BREVO_SMTP_KEY.');
    }

    if (
      error?.code === 'EENVELOPE' ||
      [451, 550, 553].includes(error?.responseCode) ||
      /invalid\s+from|sender/i.test(error?.message || '')
    ) {
      throw ApiError.serviceUnavailable(
        `Brevo rejected sender address (${senderEmail}). Ensure this sender is verified in your Brevo account.`
      );
    }

    if (['ETIMEDOUT', 'ECONNECTION', 'ECONNREFUSED', 'ESOCKET', 'ENOTFOUND'].includes(error?.code)) {
      const isSmtpKeyInApiKeySlot = typeof config.apiKey === 'string' && config.apiKey.trim().startsWith('xsmtpsib-');
      const apiKeyAdvice = isSmtpKeyInApiKeySlot
        ? 'Your BREVO_API_KEY is currently set to an SMTP key (starts with xsmtpsib-). Replace it with a Brevo API v3 key (starts with xkeysib-) from Brevo Dashboard → SMTP & API → API Keys to deliver via HTTPS (port 443).'
        : 'set BREVO_API_KEY (starts with xkeysib-) in Render to deliver via HTTPS (port 443).';

      throw ApiError.serviceUnavailable(
        `Brevo email service connection timed out. On cloud hosts like Render Free tier, SMTP ports (587/465) are blocked; ${apiKeyAdvice}`
      );
    }

    const safeErrorDetail = (error?.response || error?.message || 'SMTP delivery rejected')
      .replace(/key|pass(word)?|token|secret/gi, '[REDACTED]');

    throw ApiError.serviceUnavailable(`Brevo email delivery failed: ${safeErrorDetail}`);
  }
};

module.exports = {
  sendEmail,
  verifyConnection,
  getSmtpConfig,
  resetTransporter
};
