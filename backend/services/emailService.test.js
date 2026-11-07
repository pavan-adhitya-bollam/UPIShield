const axios = require('axios');
const nodemailer = require('nodemailer');
const { sendEmail, getSmtpConfig, resetTransporter } = require('./emailService');

jest.mock('axios');
jest.mock('nodemailer');
jest.mock('../middlewares/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}));

describe('emailService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    resetTransporter();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('reads configuration from environment variables with aliases', () => {
    process.env.BREVO_SMTP_LOGIN = 'alias-user@example.com';
    process.env.BREVO_SMTP_PASSWORD = 'alias-password';
    process.env.FROM_EMAIL = 'custom@example.com';
    delete process.env.BREVO_SMTP_USER;
    delete process.env.BREVO_SMTP_KEY;
    delete process.env.BREVO_FROM_EMAIL;

    const config = getSmtpConfig();
    expect(config.user).toBe('alias-user@example.com');
    expect(config.pass).toBe('alias-password');
    expect(config.fromEmail).toBe('custom@example.com');
  });

  test('delivers via Brevo HTTPS REST API when BREVO_API_KEY is configured with xkeysib', async () => {
    process.env.BREVO_API_KEY = 'xkeysib-test-api-key-12345';
    process.env.BREVO_FROM_EMAIL = 'support@upishield.com';

    axios.post.mockResolvedValueOnce({
      status: 201,
      data: { messageId: '<test-message-id@smtp-relay.mailin.fr>' }
    });

    const result = await sendEmail({
      to: 'recipient@example.com',
      subject: 'Password Reset OTP',
      text: 'Your OTP is 123456'
    });

    expect(result.success).toBe(true);
    expect(result.provider).toBe('brevo-api');
    expect(result.messageId).toBe('<test-message-id@smtp-relay.mailin.fr>');
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.brevo.com/v3/smtp/email',
      expect.objectContaining({
        sender: { name: 'UPI Shield', email: 'support@upishield.com' },
        to: [{ email: 'recipient@example.com' }],
        subject: 'Password Reset OTP'
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          'api-key': 'xkeysib-test-api-key-12345'
        })
      })
    );
    expect(nodemailer.createTransport).not.toHaveBeenCalled();
  });

  test('falls back to SMTP when Brevo API is not an xkeysib key', async () => {
    delete process.env.BREVO_API_KEY;
    process.env.BREVO_SMTP_HOST = 'smtp-relay.brevo.com';
    process.env.BREVO_SMTP_PORT = '587';
    process.env.BREVO_SMTP_USER = 'smtp-user@example.com';
    process.env.BREVO_SMTP_KEY = 'xsmtpsib-smtp-key';
    process.env.BREVO_FROM_EMAIL = 'support@upishield.com';

    const sendMailMock = jest.fn().mockResolvedValueOnce({
      response: '250 Message accepted',
      messageId: 'smtp-msg-1'
    });

    nodemailer.createTransport.mockReturnValueOnce({
      sendMail: sendMailMock
    });

    const result = await sendEmail({
      to: 'user@example.com',
      subject: 'Verification OTP',
      text: 'Your code is 654321'
    });

    expect(result.success).toBe(true);
    expect(result.provider).toBe('brevo-smtp');
    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });

  test('returns 503 with Render timeout explanation when SMTP times out', async () => {
    delete process.env.BREVO_API_KEY;
    process.env.BREVO_SMTP_USER = 'smtp-user@example.com';
    process.env.BREVO_SMTP_KEY = 'xsmtpsib-smtp-key';

    const timeoutError = new Error('Connection timeout');
    timeoutError.code = 'ETIMEDOUT';

    nodemailer.createTransport.mockReturnValueOnce({
      sendMail: jest.fn().mockRejectedValueOnce(timeoutError)
    });

    await expect(sendEmail({
      to: 'user@example.com',
      subject: 'Reset Password',
      text: 'Code: 111222'
    })).rejects.toMatchObject({
      statusCode: 503,
      message: expect.stringContaining('Render')
    });
  });
});
