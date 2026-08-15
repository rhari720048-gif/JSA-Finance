import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import webpush from 'web-push';

dotenv.config();

// Web Push Configuration
const PUBLIC_VAPID_KEY = process.env.PUBLIC_VAPID_KEY || 'BA9-0ZQlBcziK6UjV34VgI9Kh-jf2Cl0aFSjLA56ABaBOfFwy1Lfx_6n0ErTrudjh5NHu7wiENXD8mWxwOALc4E';
const PRIVATE_VAPID_KEY = process.env.PRIVATE_VAPID_KEY || '6LF4lAzZRz58oy3KrS6XR5PBJPAB3n-451QKx9gcjXk';
webpush.setVapidDetails('mailto:admin@sriammanfinance.com', PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY);

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const SENDER_EMAIL = process.env.SENDER_EMAIL || 'muthurasu6319@gmail.com';
const APP_PASSWORD = process.env.APP_PASSWORD || 'qxqqgfkenwxdxdvk';
const COMPANY_TITLE = process.env.COMPANY_TITLE || 'JSA Finance';

// Configure Nodemailer Transporter using Gmail SMTP App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SENDER_EMAIL,
    pass: APP_PASSWORD
  }
});

// Configure MySQL Database Pool using TiDB Cloud Credentials
const dbPool = mysql.createPool({
  host: process.env.DB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  port: Number(process.env.DB_PORT || 4000),
  user: process.env.DB_USER || '2jfg5VSYFYcSWGr.root',
  password: process.env.DB_PASSWORD || 'gR4KsIRdLUdeMVe4',
  database: process.env.DB_NAME || 'jsa-finance',
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: false
  },
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test MySQL Database Connection & Initialize Tables
async function initDatabaseTables() {
  try {
    const connection = await dbPool.getConnection();
    console.log('✅ Successfully Connected to TiDB Cloud MySQL Database (jsa-finance)!');

    // 1. Members Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS members (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        mobile VARCHAR(32) NOT NULL,
        email VARCHAR(255),
        password VARCHAR(255) DEFAULT 'member@123',
        address TEXT,
        status VARCHAR(32) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Seettu Schemes Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS seettu_schemes (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        monthly INT NOT NULL,
        total_pool INT NOT NULL,
        duration INT NOT NULL,
        members_count INT DEFAULT 0,
        collected INT DEFAULT 0,
        pending INT DEFAULT 0,
        status VARCHAR(32) DEFAULT 'Active',
        frequency VARCHAR(32) DEFAULT 'Monthly',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Payments Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(64) PRIMARY KEY,
        member_id VARCHAR(64) NOT NULL,
        member_name VARCHAR(255) NOT NULL,
        seettu_name VARCHAR(255) NOT NULL,
        month VARCHAR(64) NOT NULL,
        due_amount INT NOT NULL,
        paid INT DEFAULT 0,
        balance INT DEFAULT 0,
        status VARCHAR(32) DEFAULT 'Pending',
        payment_date VARCHAR(128) DEFAULT 'Due Today',
        payment_method VARCHAR(64) DEFAULT 'N/A',
        receipt_no VARCHAR(64) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Member-Seettu Mapping Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS member_seettu_map (
        id INT AUTO_INCREMENT PRIMARY KEY,
        member_id VARCHAR(64) NOT NULL,
        seettu_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Push Subscriptions Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        member_id VARCHAR(64) NOT NULL,
        subscription JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_member_sub (member_id)
      );
    `);

    console.log('✅ MySQL Database Schema Verified & Ready!');
    connection.release();
  } catch (err) {
    console.error('❌ TiDB Cloud MySQL Initialization Error:', err.message);
  }
}

initDatabaseTables();

// Helper: Format Indian Currency
function formatIndianCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '0';
  return Number(amount).toLocaleString('en-IN');
}

// -------------------------------------------------------------
// REST API ENDPOINTS CONNECTED TO MYSQL (TiDB Cloud)
// -------------------------------------------------------------

// 1. Get All Bootstrap Data (Members, Schemes, Payments)
app.get('/api/bootstrap-data', async (req, res) => {
  try {
    const [members] = await dbPool.query('SELECT * FROM members ORDER BY created_at DESC');
    const [schemes] = await dbPool.query('SELECT * FROM seettu_schemes ORDER BY created_at DESC');
    const [payments] = await dbPool.query('SELECT * FROM payments ORDER BY created_at DESC');
    const [mappings] = await dbPool.query('SELECT * FROM member_seettu_map');

    // Build rich frontend member objects with payment history and enrolled schemes
    const formattedMembers = members.map(m => {
      const memberMaps = mappings.filter(map => map.member_id === m.id).map(map => ({ name: map.seettu_name }));
      const memberPayments = payments.filter(p => p.member_id === m.id || p.member_name.toLowerCase() === m.name.toLowerCase());
      
      const history = memberPayments.map(p => ({
        seettu: p.seettu_name,
        month: p.month,
        amount: `₹${formatIndianCurrency(p.paid || p.due_amount)}`,
        date: p.payment_date,
        method: p.payment_method,
        status: p.status,
        receiptNo: p.receipt_no
      }));

      return {
        id: m.id,
        name: m.name,
        mobile: m.mobile,
        email: m.email,
        password: m.password || 'member@123',
        address: m.address,
        status: m.status,
        seettuDetails: memberMaps,
        paymentHistory: history
      };
    });

    // Build rich scheme objects with roster
    const formattedSchemes = schemes.map(s => {
      const schemeMembers = mappings.filter(map => map.seettu_name === s.name);
      const roster = schemeMembers.map(map => {
        const mObj = members.find(mem => mem.id === map.member_id);
        const mPayment = payments.find(p => p.member_id === map.member_id && p.seettu_name === s.name);
        return {
          id: map.member_id,
          name: mObj?.name || 'Member',
          status: mPayment?.status || 'Pending',
          paidAmount: `₹${formatIndianCurrency(mPayment?.paid || 0)}`
        };
      });

      return {
        id: s.id,
        name: s.name,
        monthly: s.monthly,
        totalPool: s.total_pool,
        duration: s.duration,
        membersCount: s.members_count || roster.length,
        collected: s.collected || 0,
        pending: s.pending || 0,
        status: s.status,
        frequency: s.frequency || 'Monthly',
        membersList: roster
      };
    });

    const formattedPayments = payments.map(p => ({
      id: p.id,
      member: p.member_name,
      memberId: p.member_id,
      seettu: p.seettu_name,
      month: p.month,
      dueAmount: p.due_amount,
      paid: p.paid,
      balance: p.balance,
      status: p.status,
      paymentDate: p.payment_date,
      paymentMethod: p.payment_method,
      receiptNo: p.receipt_no
    }));

    return res.json({
      success: true,
      membersList: formattedMembers,
      seettuList: formattedSchemes,
      paymentsList: formattedPayments
    });
  } catch (err) {
    console.error('❌ Error fetching bootstrap data from MySQL:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Add New Member to MySQL
app.post('/api/members', async (req, res) => {
  const { id, name, mobile, email, password, address, seettuDetails } = req.body;
  const memberId = id || `SAF-MEM-${Math.floor(1000 + Math.random() * 9000)}`;
  const memberPassword = password || 'member@123';

  try {
    await dbPool.query(
      'INSERT INTO members (id, name, mobile, email, password, address, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [memberId, name, mobile, email, memberPassword, address || '', 'Active']
    );

    if (seettuDetails && seettuDetails.length > 0) {
      for (const detail of seettuDetails) {
        await dbPool.query(
          'INSERT INTO member_seettu_map (member_id, seettu_name) VALUES (?, ?)',
          [memberId, detail.name]
        );

        // Fetch scheme monthly due
        const [schemes] = await dbPool.query('SELECT * FROM seettu_schemes WHERE name = ?', [detail.name]);
        const due = schemes.length > 0 ? schemes[0].monthly : 2000;
        const payId = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;

        await dbPool.query(
          'INSERT INTO payments (id, member_id, member_name, seettu_name, month, due_amount, paid, balance, status, payment_date, payment_method, receipt_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [payId, memberId, name, detail.name, 'August 2026', due, 0, due, 'Pending', 'Due Today', 'N/A', 'Pending']
        );
      }
    }

    // Send Welcome Email
    if (email) {
      transporter.sendMail({
        from: `"${COMPANY_TITLE}" <${SENDER_EMAIL}>`,
        to: email,
        subject: `[JSA Finance] Welcome ${name}! Your Account Credentials`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #1E3A8A;">
              <h1 style="color: #1E3A8A; margin: 0; font-size: 24px; font-weight: bold;">JAI SRI AMMAN FINANCE</h1>
              <p style="color: #D97706; margin: 5px 0 0 0; font-size: 12px; font-weight: bold; text-transform: uppercase;">Welcome New Member</p>
            </div>
            <div style="padding: 20px 0;">
              <h2 style="color: #0f172a; margin-top: 0; font-size: 18px;">Welcome to Jai Sri Amman Finance!</h2>
              <p style="color: #475569; font-size: 14px;">Your member account is created. Credentials:</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr><td style="padding: 8px 0; color: #64748b;">Member ID:</td><td style="font-weight: bold; color: #1E3A8A; font-family: monospace;">${memberId}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b;">Mobile:</td><td style="font-weight: bold; color: #0f172a;">${mobile}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b;">Password:</td><td style="font-weight: bold; color: #D97706;">${memberPassword}</td></tr>
              </table>
            </div>
          </div>
        `
      }).catch(err => console.error('Welcome email send error:', err));
    }

    // Send Welcome Push Notification
    await sendPushNotificationToMember(memberId, {
      title: 'Welcome to JSA Finance',
      body: `Hi ${name}, your member account has been successfully created. ID: ${memberId}`
    });

    return res.json({ success: true, memberId, message: 'Member created successfully in TiDB Cloud MySQL!' });
  } catch (err) {
    console.error('❌ Error adding member to MySQL:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Update Member in MySQL
app.put('/api/members/:id', async (req, res) => {
  const { name, mobile, email, password, address, status } = req.body;
  try {
    await dbPool.query(
      'UPDATE members SET name = COALESCE(?, name), mobile = COALESCE(?, mobile), email = COALESCE(?, email), password = COALESCE(?, password), address = COALESCE(?, address), status = COALESCE(?, status) WHERE id = ?',
      [name || null, mobile || null, email || null, password || null, address || null, status || null, req.params.id]
    );
    console.log(`✅ Member ${req.params.id} updated in TiDB Cloud MySQL!`);
    return res.json({ success: true, message: 'Member updated in MySQL' });
  } catch (err) {
    console.error('❌ Error updating member in MySQL:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 3.5. Add newly enrolled Seettu for existing member
app.post('/api/members/:id/seettu', async (req, res) => {
  const { seettuDetails, memberName } = req.body;
  const memberId = req.params.id;

  try {
    if (seettuDetails && seettuDetails.length > 0) {
      for (const detail of seettuDetails) {
        await dbPool.query(
          'INSERT INTO member_seettu_map (member_id, seettu_name) VALUES (?, ?)',
          [memberId, detail.name]
        );

        const [schemes] = await dbPool.query('SELECT * FROM seettu_schemes WHERE name = ?', [detail.name]);
        const due = schemes.length > 0 ? schemes[0].monthly : 2000;
        const payId = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;

        await dbPool.query(
          'INSERT INTO payments (id, member_id, member_name, seettu_name, month, due_amount, paid, balance, status, payment_date, payment_method, receipt_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [payId, memberId, memberName, detail.name, 'August 2026', due, 0, due, 'Pending', 'Due Today', 'N/A', 'Pending']
        );
      }
    }
    
    // Send Push Notification for New Schemes
    await sendPushNotificationToMember(memberId, {
      title: 'New Chit Scheme Added',
      body: `Hi ${memberName}, you have been enrolled in new chit schemes successfully.`
    });

    return res.json({ success: true, message: 'New chits mapped successfully' });
  } catch (err) {
    console.error('❌ Error mapping new seettu:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 3.6. Remove Seettu for existing member
app.delete('/api/members/:id/seettu', async (req, res) => {
  const { seettuNames } = req.body;
  const memberId = req.params.id;

  try {
    if (seettuNames && seettuNames.length > 0) {
      for (const name of seettuNames) {
        await dbPool.query('DELETE FROM member_seettu_map WHERE member_id = ? AND seettu_name = ?', [memberId, name]);
        await dbPool.query('DELETE FROM payments WHERE member_id = ? AND seettu_name = ? AND status = ?', [memberId, name, 'Pending']);
      }
    }
    
    await sendPushNotificationToMember(memberId, {
      title: 'Chit Scheme Removed',
      body: `You have been removed from the selected chit schemes.`
    });

    return res.json({ success: true, message: 'Chits removed successfully' });
  } catch (err) {
    console.error('❌ Error removing seettu:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Delete Member from MySQL
app.delete('/api/members/:id', async (req, res) => {
  try {
    await dbPool.query('DELETE FROM members WHERE id = ?', [req.params.id]);
    await dbPool.query('DELETE FROM member_seettu_map WHERE member_id = ?', [req.params.id]);
    await dbPool.query('DELETE FROM payments WHERE member_id = ?', [req.params.id]);
    return res.json({ success: true, message: 'Member deleted from MySQL' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 5. Add New Seettu Scheme to MySQL
app.post('/api/seettu', async (req, res) => {
  const { id, name, monthly, totalPool, duration, frequency } = req.body;
  const schemeId = id || `SCHEME-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    await dbPool.query(
      'INSERT INTO seettu_schemes (id, name, monthly, total_pool, duration, members_count, collected, pending, status, frequency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [schemeId, name, monthly, totalPool, duration, 0, 0, monthly * duration, 'Active', frequency || 'Monthly']
    );
    return res.json({ success: true, schemeId, message: 'Seettu scheme created in MySQL' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 6. Mark Payment as Paid in MySQL
app.post('/api/payments/pay', async (req, res) => {
  const { paymentId, paymentMode } = req.body;
  const newReceiptNo = `JSA-RCP-${Math.floor(1000 + Math.random() * 9000)}`;
  const nowTimestamp = new Date().toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  });

  try {
    const [rows] = await dbPool.query('SELECT * FROM payments WHERE id = ?', [paymentId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    const pay = rows[0];
    await dbPool.query(
      'UPDATE payments SET paid = ?, balance = 0, status = ?, payment_date = ?, payment_method = ?, receipt_no = ? WHERE id = ?',
      [pay.due_amount, 'Paid', nowTimestamp, paymentMode || 'UPI', newReceiptNo, paymentId]
    );

    // Get Member Email for Receipt
    const [mRows] = await dbPool.query('SELECT email FROM members WHERE id = ? OR name = ?', [pay.member_id, pay.member_name]);
    const memberEmail = mRows[0]?.email || `${pay.member_name.toLowerCase().replace(/\s+/g, '')}@gmail.com`;

    // Dispatch Real Receipt Email
    transporter.sendMail({
      from: `"${COMPANY_TITLE}" <${SENDER_EMAIL}>`,
      to: memberEmail,
      subject: `[JSA Finance] Payment Receipt #${newReceiptNo} - Paid ₹${formatIndianCurrency(pay.due_amount)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #1E3A8A;">
            <h1 style="color: #1E3A8A; margin: 0; font-size: 24px;">JAI SRI AMMAN FINANCE</h1>
            <p style="color: #D97706; margin: 5px 0 0 0; font-size: 12px; font-weight: bold;">Official Payment Receipt</p>
          </div>
          <div style="padding: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #64748b;">Receipt No:</td><td style="font-weight: bold; color: #1E3A8A; font-family: monospace; text-align: right;">${newReceiptNo}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Member:</td><td style="font-weight: bold; color: #0f172a; text-align: right;">${pay.member_name}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Scheme:</td><td style="font-weight: bold; color: #0f172a; text-align: right;">${pay.seettu_name}</td></tr>
              <tr><td style="padding: 12px 0; font-weight: bold;">Amount Paid:</td><td style="font-weight: 900; color: #1E3A8A; font-size: 20px; text-align: right;">₹${formatIndianCurrency(pay.due_amount)}</td></tr>
            </table>
          </div>
        </div>
      `
    }).catch(err => console.error('Receipt email send error:', err));

    // Send Payment Paid Push Notification
    await sendPushNotificationToMember(pay.member_id, {
      title: 'Payment Received Successfully',
      body: `Your payment of ₹${formatIndianCurrency(pay.due_amount)} for ${pay.seettu_name} has been marked as Paid. Receipt No: ${newReceiptNo}`
    });

    return res.json({
      success: true,
      receiptNo: newReceiptNo,
      memberName: pay.member_name,
      memberEmail,
      seettuName: pay.seettu_name,
      amount: pay.due_amount,
      date: nowTimestamp,
      method: paymentMode || 'UPI'
    });
  } catch (err) {
    console.error('❌ Error updating payment in MySQL:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 7. Endpoint: Send Forgot Password OTP
app.post('/api/send-otp', async (req, res) => {
  const { toEmail, otpCode, memberName } = req.body;
  if (!toEmail || !otpCode) {
    return res.status(400).json({ success: false, message: 'Missing parameters' });
  }

  try {
    await transporter.sendMail({
      from: `"${COMPANY_TITLE}" <${SENDER_EMAIL}>`,
      to: toEmail,
      subject: `[JSA Finance] Password Reset OTP Code: ${otpCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #1E3A8A; text-align: center;">JAI SRI AMMAN FINANCE</h2>
          <p style="text-align: center;">Your 6-digit OTP code for password reset is:</p>
          <div style="text-align: center; font-size: 32px; font-weight: bold; color: #1E3A8A; letter-spacing: 6px; margin: 20px 0;">${otpCode}</div>
        </div>
      `
    });
    return res.json({ success: true, message: `OTP sent to ${toEmail}` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 8. Endpoint: Send Reminder Email
app.post('/api/send-reminder', async (req, res) => {
  const { toEmail, memberName, seettuName, amount, dueDate, daysLeft } = req.body;
  if (!toEmail) return res.status(400).json({ success: false, message: 'Missing email' });

  try {
    await transporter.sendMail({
      from: `"${COMPANY_TITLE}" <${SENDER_EMAIL}>`,
      to: toEmail,
      subject: `[JSA Finance] Upcoming Installment Due Reminder - ${seettuName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #1E3A8A; text-align: center;">JAI SRI AMMAN FINANCE</h2>
          <p>Hi <strong>${memberName}</strong>,</p>
          <p>Your installment for <strong>${seettuName}</strong> is due in <strong>${daysLeft || 3} days</strong>. Amount due: <strong>${amount}</strong>.</p>
        </div>
      `
    });
    
    // Dispatch Push Notification if subscribed
    await sendPushNotificationToMember(req.body.memberId, {
      title: 'Upcoming Installment Due',
      body: `Hi ${memberName}, your installment for ${seettuName} is due in ${daysLeft || 3} days. Amount: ${amount}`,
    });

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// WEB PUSH NOTIFICATION ENDPOINTS & HELPERS
// -------------------------------------------------------------

// Helper: Send Web Push to specific member
async function sendPushNotificationToMember(memberId, payload) {
  if (!memberId) return;
  try {
    const [rows] = await dbPool.query('SELECT subscription FROM push_subscriptions WHERE member_id = ?', [memberId]);
    if (rows.length > 0) {
      const sub = typeof rows[0].subscription === 'string' ? JSON.parse(rows[0].subscription) : rows[0].subscription;
      await webpush.sendNotification(sub, JSON.stringify(payload)).catch(err => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          // Subscription expired or invalid, remove from DB
          dbPool.query('DELETE FROM push_subscriptions WHERE member_id = ?', [memberId]);
        } else {
          console.error('Push send error:', err);
        }
      });
    }
  } catch (err) {
    console.error('Database error checking push subscription:', err);
  }
}

// 9. Endpoint: Save Push Subscription
app.post('/api/subscribe', async (req, res) => {
  const { memberId, subscription } = req.body;
  if (!memberId || !subscription) return res.status(400).json({ success: false, message: 'Missing data' });
  
  try {
    await dbPool.query(
      'INSERT INTO push_subscriptions (member_id, subscription) VALUES (?, ?) ON DUPLICATE KEY UPDATE subscription = VALUES(subscription)',
      [memberId, JSON.stringify(subscription)]
    );
    res.json({ success: true, message: 'Push subscription saved.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 JSA Email & MySQL Backend Server running on http://localhost:${PORT}`);
  });
}

export default app;
