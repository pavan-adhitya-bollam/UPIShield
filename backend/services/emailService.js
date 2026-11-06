require('dotenv').config();
const nodemailer = require('nodemailer');
const logger = require('../middlewares/logger');
const ApiError = require('../utils/ApiError');

let cachedTransporter = null;

/**
 * Retrieve SMTP configuration dynamically from environment variables
 */
const getSmtpConfig = () => {
  const host = process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com';
  const port = Number(process.env.BREVO_SMTP_PORT || 587);
  const secure = port === 465;
  const user = process.env.BREVO_SMTP_USER;
  const pass = process.env.BREVO_SMTP_KEY;
  const fromEmail = process.env.BREVO_FROM_EMAIL || 'upishieldweb@gmail.com';
  const fromName = process.env.BREVO_FROM_NAME || 'UPI Shield';

  return {
    host,
    port,
    secure,
    user,
    pass,
    fromEmail,
    fromName
  };
};

/**
 * Get or create the Nodemailer transporter instance
 */
const getTransporter = () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const config = getSmtpConfig();

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
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000
  });

  return cachedTransporter;
};

/**
 * Verify SMTP connection and credentials
 */
const verifyConnection = async () => {
  try {
    const transporter = getTransporter();
    const result = await transporter.verify();
    return result;
  } catch (error) {
    cachedTransporter = null; // Reset on verification error so next attempt tries fresh
    throw error;
  }
};

/**
 * Send an email using Brevo SMTP relay
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
    html: html || `
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
    `
  };

  try {
    const transporter = getTransporter();
    const response = await transporter.sendMail(message);

    logger.info('Brevo SMTP email accepted', {
      subject,
      response: response.response,
      messageId: response.messageId || null
    });

    return {
      success: true,
      provider: 'brevo-smtp',
      accepted: true,
      messageId: response.messageId || null,
      response: response.response
    };
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
      throw ApiError.serviceUnavailable('Brevo email service connection timed out or network error. Please try again.');
    }

    const safeErrorDetail = (error?.response || error?.message || 'SMTP delivery rejected')
      .replace(/key|pass(word)?|token|secret/gi, '[REDACTED]');

    throw ApiError.serviceUnavailable(`Brevo email delivery failed: ${safeErrorDetail}`);
  }
};

module.exports = {
  sendEmail,
  verifyConnection,
  getSmtpConfig
};