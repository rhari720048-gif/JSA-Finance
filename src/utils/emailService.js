/**
 * Real Gmail Email Service calling backend Nodemailer server (http://localhost:5000)
 * Uses Gmail Account: muthurasu6319@gmail.com
 * Google App Password: qxqq gfke nwxd xdvk
 */

const API_BASE = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? '/api'
  : 'http://localhost:5000/api';

export async function sendRealWelcomeEmail({ toEmail, memberName, memberId, mobile, password }) {
  try {
    const response = await fetch(`${API_BASE}/send-welcome`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toEmail, memberName, memberId, mobile, password })
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to dispatch welcome email:', error);
    return { success: false, message: error.message };
  }
}

export async function sendRealChitEnrollmentEmail({ toEmail, memberName, seettuName, amount, frequency, poolTarget }) {
  try {
    const response = await fetch(`${API_BASE}/send-chit-enrollment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toEmail, memberName, seettuName, amount, frequency, poolTarget })
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to dispatch chit enrollment email:', error);
    return { success: false, message: error.message };
  }
}

export async function sendRealReminderEmail({ toEmail, memberName, seettuName, amount, dueDate, daysLeft }) {
  try {
    const response = await fetch(`${API_BASE}/send-reminder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toEmail, memberName, seettuName, amount, dueDate, daysLeft })
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to dispatch reminder email:', error);
    return { success: false, message: error.message };
  }
}

export async function sendRealOTPEmail({ toEmail, otpCode, memberName }) {
  try {
    const response = await fetch(`${API_BASE}/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toEmail, otpCode, memberName })
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to dispatch real OTP email:', error);
    return { success: false, message: error.message };
  }
}

export async function sendRealReceiptEmail({ toEmail, receiptNo, memberName, seettuName, amount, date, method }) {
  try {
    const response = await fetch(`${API_BASE}/send-receipt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toEmail, receiptNo, memberName, seettuName, amount, date, method })
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to dispatch real receipt email:', error);
    return { success: false, message: error.message };
  }
}
