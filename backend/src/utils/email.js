/**
 * Email utility — uses nodemailer with SMTP.
 *
 * Configure these env vars:
 *   SMTP_HOST     e.g. smtp.resend.com  or  smtp.sendgrid.net
 *   SMTP_PORT     e.g. 465 (SSL) or 587 (TLS)
 *   SMTP_USER     your SMTP username / API key
 *   SMTP_PASS     your SMTP password / API key
 *   SMTP_FROM     e.g. "ChilaloShop <noreply@yourdomain.com>"
 *
 * For local dev without SMTP configured, emails are logged to console.
 */

let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null; // No SMTP configured — fall back to console logging
  }

  // Lazy-load nodemailer only when SMTP is configured
  const nodemailer = await import('nodemailer');
  transporter = nodemailer.default.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587'),
    secure: parseInt(SMTP_PORT || '587') === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return transporter;
}

/**
 * Send an email.
 * @param {{ to: string, subject: string, html: string, text?: string }} options
 */
export async function sendEmail({ to, subject, html, text }) {
  const from = process.env.SMTP_FROM || 'ChilaloShop <noreply@chilaloshop.com>';

  try {
    const t = await getTransporter();

    if (!t) {
      // Dev fallback — log to console
      console.log('\n📧 [EMAIL — no SMTP configured]');
      console.log(`   To:      ${to}`);
      console.log(`   Subject: ${subject}`);
      console.log(`   Body:    ${text || html.replace(/<[^>]+>/g, ' ').trim().slice(0, 200)}`);
      console.log('');
      return;
    }

    await t.sendMail({ from, to, subject, html, text });
    console.log(`📧 Email sent to ${to}: ${subject}`);
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err.message);
    throw err;
  }
}
