import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || 'AutoCommerce AI <onboarding@resend.dev>';

interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

async function sendEmail(to: string, subject: string, html: string): Promise<EmailResult> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Resend] RESEND_API_KEY not configured, email not sent');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('[Resend] Failed to send email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error('[Resend] Exception sending email:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

function emailWrapper(content: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .order-id { background: #fff; border: 1px solid #e0e0e0; border-radius: 4px; padding: 12px 16px; font-family: monospace; font-size: 16px; margin: 16px 0; }
          .status { display: inline-block; padding: 6px 12px; border-radius: 4px; font-weight: 600; }
          .status.refund { background: #fef3c7; color: #92400e; }
          .status.shipped { background: #d1fae5; color: #065f46; }
          .status.delivered { background: #dbeafe; color: #1e40af; }
          .status.pending { background: #f3f4f6; color: #4b5563; }
          .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin:0;">AutoCommerce AI</h1>
          <p style="margin: 8px 0 0;">Intelligent Customer Support</p>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>Powered by AutoCommerce AI</p>
        </div>
      </body>
    </html>
  `;
}

export async function sendRefundConfirmation(to: string, orderId: string, amount?: string) {
  const html = emailWrapper(`
    <h2 style="margin-top:0;">Refund Initiated</h2>
    <p>We have initiated a refund for your recent order.</p>
    <div class="order-id">Order: ${orderId}</div>
    ${amount ? `<p>Refund Amount: <strong>${amount}</strong></p>` : ''}
    <p>You should see the funds reflected in your account within <strong>5-10 business days</strong>, depending on your payment provider.</p>
    <p>If you have any questions, please don't hesitate to contact our support team.</p>
  `);

  return sendEmail(to, `Refund Initiated: ${orderId}`, html);
}

export async function sendOrderUpdate(to: string, orderId: string, status: string, details?: string) {
  const statusClass = status.toLowerCase().includes('refund') ? 'refund'
    : status.toLowerCase().includes('ship') ? 'shipped'
    : status.toLowerCase().includes('deliver') ? 'delivered'
    : 'pending';

  const html = emailWrapper(`
    <h2 style="margin-top:0;">Order Update</h2>
    <p>Your order status has been updated.</p>
    <div class="order-id">Order: ${orderId}</div>
    <p>New Status: <span class="status ${statusClass}">${status}</span></p>
    ${details ? `<p>${details}</p>` : ''}
    <p>You can track your order anytime using our AI support chat.</p>
  `);

  return sendEmail(to, `Order Update: ${orderId}`, html);
}

export async function sendShippingNotification(to: string, orderId: string, trackingUrl?: string, carrier?: string) {
  const html = emailWrapper(`
    <h2 style="margin-top:0;">Your Order Has Shipped!</h2>
    <p>Great news! Your order is on its way.</p>
    <div class="order-id">Order: ${orderId}</div>
    ${carrier ? `<p>Carrier: <strong>${carrier}</strong></p>` : ''}
    ${trackingUrl ? `<p><a href="${trackingUrl}" style="color:#667eea;">Track Your Package</a></p>` : ''}
    <p>You'll receive another notification when it's delivered.</p>
  `);

  return sendEmail(to, `Your Order Has Shipped: ${orderId}`, html);
}

export async function sendWelcomeEmail(to: string, shopName?: string) {
  const shop = shopName ? ` from ${shopName}` : '';
  const html = emailWrapper(`
    <h2 style="margin-top:0;">Welcome to AutoCommerce AI!</h2>
    <p>Thank you for connecting your store${shop}.</p>
    <p>You can now use our AI-powered customer support to:</p>
    <ul>
      <li>Look up orders instantly</li>
      <li>Check shipping status</li>
      <li>Process refunds</li>
      <li>And more!</li>
    </ul>
    <p>Get started by chatting with our AI assistant.</p>
  `);

  return sendEmail(to, 'Welcome to AutoCommerce AI!', html);
}
