import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const SENDER_EMAIL = 'muthurasu6319@gmail.com';
const APP_PASSWORD = 'qxqqgfkenwxdxdvk';
const COMPANY_TITLE = 'JSA Finance';

// Configure Nodemailer Transporter using Gmail SMTP App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SENDER_EMAIL,
    pass: APP_PASSWORD
  }
});

// Verify SMTP connection on server startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Gmail SMTP Connection Error:', error);
  } else {
    console.log('✅ Gmail SMTP Server is Ready to Send Real Emails from muthurasu6319@gmail.com!');
  }
});

// 1. Endpoint: Send Welcome Member Credentials Email
app.post('/api/send-welcome', async (req, res) => {
  const { toEmail, memberName, memberId, mobile, password } = req.body;

  if (!toEmail || !memberName) {
    return res.status(400).json({ success: false, message: 'Missing member email or name.' });
  }

  const mailOptions = {
    from: `"${COMPANY_TITLE}" <${SENDER_EMAIL}>`,
    to: toEmail,
    subject: `[JSA Finance] Welcome ${memberName}! Your Account Credentials`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #1E3A8A;">
          <h1 style="color: #1E3A8A; margin: 0; font-size: 24px; font-weight: bold;">JAI SRI AMMAN FINANCE</h1>
          <p style="color: #D97706; margin: 5px 0 0 0; font-size: 12px; font-weight: bold; text-transform: uppercase;">Welcome New Member</p>
        </div>

        <div style="padding: 20px 0;">
          <h2 style="color: #0f172a; margin-top: 0; font-size: 18px;">Welcome to Jai Sri Amman Finance!</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.5;">
            Dear <strong>${memberName}</strong>,<br/>
            Your member account has been registered successfully by JSA Finance Admin. Below are your official portal login credentials:
          </p>

          <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Member Name:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #0f172a; text-align: right;">${memberName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Member ID:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #1E3A8A; text-align: right; font-family: monospace;">${memberId || 'SAF-MEM'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Mobile Number:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #0f172a; text-align: right;">${mobile || 'Registered Mobile'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Login Email:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #0f172a; text-align: right;">${toEmail}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Portal Password:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #D97706; text-align: right; font-size: 15px;">${password || 'member@123'}</td>
              </tr>
            </table>
          </div>

          <p style="color: #475569; font-size: 13px; text-align: center; margin-top: 15px;">
            You can log in to your Member Portal on our website anytime using your Mobile Number / Email & Password.
          </p>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; color: #94a3b8; font-size: 11px;">
          &copy; ${new Date().getFullYear()} Jai Sri Amman Finance. All rights reserved.<br/>
          Sent securely via JSA Automated Mailer.
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Welcome Email Sent to ${toEmail}: ${info.messageId}`);
    return res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error('❌ Error sending welcome email:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Endpoint: Send Chit Group Scheme Enrollment Email
app.post('/api/send-chit-enrollment', async (req, res) => {
  const { toEmail, memberName, seettuName, amount, frequency, poolTarget } = req.body;

  if (!toEmail || !seettuName) {
    return res.status(400).json({ success: false, message: 'Missing scheme enrollment details.' });
  }

  const mailOptions = {
    from: `"${COMPANY_TITLE}" <${SENDER_EMAIL}>`,
    to: toEmail,
    subject: `[JSA Finance] Enrolled in Chit Scheme - ${seettuName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #1E3A8A;">
          <h1 style="color: #1E3A8A; margin: 0; font-size: 24px; font-weight: bold;">JAI SRI AMMAN FINANCE</h1>
          <p style="color: #D97706; margin: 5px 0 0 0; font-size: 12px; font-weight: bold; text-transform: uppercase;">Chit Group Enrollment</p>
        </div>

        <div style="padding: 20px 0;">
          <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 12px 16px; border-radius: 10px; color: #1e40af; font-size: 13px; font-weight: bold; margin-bottom: 20px; text-align: center;">
            🎉 Congratulations! You are enrolled in ${seettuName}
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-size: 13px;">Member Name:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #0f172a; text-align: right;">${memberName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-size: 13px;">Chit Scheme Name:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #1E3A8A; text-align: right; font-size: 14px;">${seettuName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-size: 13px;">Installment Amount:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #0f172a; text-align: right; font-size: 15px;">${amount}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-size: 13px;">Frequency:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #0f172a; text-align: right;">${frequency || 'Monthly'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-size: 13px;">Total Target Pool:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #D97706; text-align: right;">${poolTarget || 'Guaranteed Payout'}</td>
            </tr>
          </table>

          <p style="color: #475569; font-size: 13px; text-align: center; margin: 0;">
            Track your cycle payments and digital receipts online anytime!
          </p>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; color: #94a3b8; font-size: 11px;">
          &copy; ${new Date().getFullYear()} Jai Sri Amman Finance. All rights reserved.<br/>
          Sent via JSA Automated Mailer.
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Chit Enrollment Email Sent to ${toEmail}: ${info.messageId}`);
    return res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error('❌ Error sending chit enrollment email:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Endpoint: Send Upcoming Installment Due Reminder Email
app.post('/api/send-reminder', async (req, res) => {
  const { toEmail, memberName, seettuName, amount, dueDate, daysLeft } = req.body;

  if (!toEmail || !seettuName) {
    return res.status(400).json({ success: false, message: 'Missing reminder details.' });
  }

  const mailOptions = {
    from: `"${COMPANY_TITLE}" <${SENDER_EMAIL}>`,
    to: toEmail,
    subject: `[JSA Finance] Upcoming Installment Due Reminder - ${seettuName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #1E3A8A;">
          <h1 style="color: #1E3A8A; margin: 0; font-size: 24px; font-weight: bold;">JAI SRI AMMAN FINANCE</h1>
          <p style="color: #D97706; margin: 5px 0 0 0; font-size: 12px; font-weight: bold; text-transform: uppercase;">Installment Due Reminder</p>
        </div>

        <div style="padding: 20px 0;">
          <div style="background-color: #fffbeb; border: 1px solid #fde68a; padding: 14px 16px; border-radius: 10px; color: #92400e; font-size: 13px; font-weight: bold; margin-bottom: 20px; text-align: center;">
            ⏰ Reminder: Your ${seettuName} installment is due ${daysLeft ? `in ${daysLeft} days` : 'soon'} (${dueDate || 'This Cycle'})
          </div>

          <p style="color: #475569; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
            Dear <strong>${memberName}</strong>,<br/>
            This is a friendly automated reminder from JSA Finance regarding your upcoming chit installment contribution.
          </p>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #f8fafc; border-radius: 12px; padding: 10px;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 14px; color: #64748b; font-size: 13px;">Chit Scheme:</td>
              <td style="padding: 10px 14px; font-weight: bold; color: #1E3A8A; text-align: right; font-size: 14px;">${seettuName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 14px; color: #64748b; font-size: 13px;">Due Date:</td>
              <td style="padding: 10px 14px; font-weight: bold; color: #d97706; text-align: right;">${dueDate || 'Upcoming Target Date'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 14px; color: #0f172a; font-weight: bold; font-size: 14px;">Installment Amount Due:</td>
              <td style="padding: 12px 14px; font-weight: 900; color: #1E3A8A; text-align: right; font-size: 18px;">${amount}</td>
            </tr>
          </table>

          <p style="color: #475569; font-size: 13px; text-align: center; margin: 0;">
            Please make your payment on time via Cash or UPI to maintain a 100% clean track record for bonus rewards.
          </p>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; color: #94a3b8; font-size: 11px;">
          &copy; ${new Date().getFullYear()} Jai Sri Amman Finance. All rights reserved.<br/>
          Automated reminder sent via JSA Mailer.
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Due Reminder Email Sent to ${toEmail}: ${info.messageId}`);
    return res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error('❌ Error sending reminder email:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Endpoint: Send Forgot Password OTP Email
app.post('/api/send-otp', async (req, res) => {
  const { toEmail, otpCode, memberName } = req.body;

  if (!toEmail || !otpCode) {
    return res.status(400).json({ success: false, message: 'Missing recipient email or OTP code.' });
  }

  const mailOptions = {
    from: `"${COMPANY_TITLE}" <${SENDER_EMAIL}>`,
    to: toEmail,
    subject: `[JSA Finance] Password Reset OTP Code: ${otpCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #1E3A8A;">
          <h1 style="color: #1E3A8A; margin: 0; font-size: 24px; font-weight: bold;">JAI SRI AMMAN FINANCE</h1>
          <p style="color: #D97706; margin: 5px 0 0 0; font-size: 12px; font-weight: bold; text-transform: uppercase;">Official Security Portal</p>
        </div>

        <div style="padding: 25px 0; text-align: center;">
          <h2 style="color: #0f172a; margin-bottom: 10px;">Password Reset Verification</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.5; margin-bottom: 25px;">
            Hello <strong>${memberName || 'Valued Member'}</strong>,<br/>
            You requested to reset your member portal password. Please use the 6-digit OTP code below:
          </p>

          <div style="display: inline-block; background-color: #f1f5f9; border: 2px dashed #1E3A8A; padding: 15px 30px; border-radius: 12px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1E3A8A; margin-bottom: 25px;">
            ${otpCode}
          </div>

          <p style="color: #64748b; font-size: 12px;">This OTP code is valid for 10 minutes. Please do not share this code with anyone.</p>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; color: #94a3b8; font-size: 11px;">
          &copy; ${new Date().getFullYear()} Jai Sri Amman Finance. All rights reserved.<br/>
          Sent securely via JSA Automated Mailer.
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Real OTP Email Sent to ${toEmail}: ${info.messageId}`);
    return res.json({ success: true, messageId: info.messageId, message: `OTP sent successfully to ${toEmail}` });
  } catch (err) {
    console.error('❌ Error sending OTP email:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 5. Endpoint: Send Payment Receipt Email
app.post('/api/send-receipt', async (req, res) => {
  const { toEmail, receiptNo, memberName, seettuName, amount, date, method } = req.body;

  if (!toEmail || !receiptNo) {
    return res.status(400).json({ success: false, message: 'Missing receipt details.' });
  }

  const mailOptions = {
    from: `"${COMPANY_TITLE}" <${SENDER_EMAIL}>`,
    to: toEmail,
    subject: `[JSA Finance] Payment Receipt #${receiptNo} - Paid ${amount}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #1E3A8A;">
          <h1 style="color: #1E3A8A; margin: 0; font-size: 24px; font-weight: bold;">JAI SRI AMMAN FINANCE</h1>
          <p style="color: #D97706; margin: 5px 0 0 0; font-size: 12px; font-weight: bold; text-transform: uppercase;">Official Payment Receipt</p>
        </div>

        <div style="padding: 20px 0;">
          <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; padding: 12px 16px; border-radius: 10px; color: #065f46; font-size: 13px; font-weight: bold; margin-bottom: 20px; text-align: center;">
            ✓ Payment Successfully Received & Confirmed
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-size: 13px;">Receipt Number:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #1E3A8A; text-align: right; font-size: 14px; font-family: monospace;">${receiptNo}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-size: 13px;">Member Name:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #0f172a; text-align: right; font-size: 14px;">${memberName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-size: 13px;">Seettu Scheme:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #0f172a; text-align: right; font-size: 14px;">${seettuName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-size: 13px;">Payment Method:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #0f172a; text-align: right; font-size: 14px;">${method || 'Online'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-size: 13px;">Date & Time:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #334155; text-align: right; font-size: 13px;">${date}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #0f172a; font-weight: bold; font-size: 15px;">Total Amount Paid:</td>
              <td style="padding: 12px 0; font-weight: 900; color: #1E3A8A; text-align: right; font-size: 20px;">${amount}</td>
            </tr>
          </table>

          <p style="color: #475569; font-size: 13px; text-align: center; margin: 0;">
            Thank you for your prompt installment payment towards your chit scheme!
          </p>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; color: #94a3b8; font-size: 11px;">
          &copy; ${new Date().getFullYear()} Jai Sri Amman Finance. All rights reserved.<br/>
          Automated receipt generated by JSA Finance Portal.
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Real Receipt Email Sent to ${toEmail}: ${info.messageId}`);
    return res.json({ success: true, messageId: info.messageId, message: `Payment receipt sent to ${toEmail}` });
  } catch (err) {
    console.error('❌ Error sending receipt email:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 JSA Email Server running on http://localhost:${PORT}`);
});
