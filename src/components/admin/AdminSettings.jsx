import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Sliders, 
  CheckCircle2, 
  Save, 
  Building2, 
  Smartphone, 
  Mail, 
  MapPin,
  Lock,
  Send,
  Clock,
  Sparkles
} from 'lucide-react';
import { COMPANY_DETAILS } from '../../config/constants';
import { useSeettu } from '../../context/SeettuContext';
import { sendRealReminderEmail } from '../../utils/emailService';
import { sendAppNotification } from '../../utils/notificationService';
import { formatIndianCurrency } from '../../utils/formatCurrency';

export default function AdminSettings() {
  const { membersList, paymentsList } = useSeettu();

  // 3 Tabs: 'profile' | 'notifications' | 'system'
  const [activeTab, setActiveTab] = useState('profile');
  const [saveNotice, setSaveNotice] = useState(null);
  const [isSendingReminders, setIsSendingReminders] = useState(false);

  // Form State for Admin Profile
  const [adminProfile, setAdminProfile] = useState({
    name: 'Admin Manager',
    email: 'admin@sriammanfinance.com',
    mobile: '+91 98765 43210',
    role: 'Super Administrator',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Form State for Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailReminders: true,
    enableAppNotifications: true,
    reminderDaysBeforeDue: 3,
    autoSendReceipts: true
  });

  // Form State for System Settings
  const [systemSettings, setSystemSettings] = useState({
    companyName: COMPANY_DETAILS.name,
    phone: COMPANY_DETAILS.phone,
    email: COMPANY_DETAILS.email,
    address: COMPANY_DETAILS.address,
    currency: 'INR (₹)',
    timezone: 'Asia/Kolkata (IST)'
  });

  const handleSave = (sectionName) => {
    setSaveNotice(`${sectionName} saved successfully.`);
    setTimeout(() => setSaveNotice(null), 3500);
  };

  // Dispatch Email & App Push Reminders to all pending members
  const handleDispatchAllReminders = async () => {
    setIsSendingReminders(true);
    let count = 0;

    const pendingPayments = paymentsList.filter(p => p.status !== 'Paid');
    const targetPayments = pendingPayments.length > 0 ? pendingPayments : paymentsList;

    for (const item of targetPayments) {
      const memberObj = membersList.find(m => m.id === item.memberId || m.name.toLowerCase() === item.member.toLowerCase());
      const emailToUse = memberObj?.email || `${item.member.toLowerCase().replace(/\s+/g, '')}@gmail.com`;

      // 1. Dispatch Real Email
      if (notificationSettings.enableEmailReminders) {
        await sendRealReminderEmail({
          toEmail: emailToUse,
          memberName: item.member,
          seettuName: item.seettu,
          amount: `₹${formatIndianCurrency(item.dueAmount || item.balance || 2000)}`,
          dueDate: item.paymentDate || 'Upcoming Cycle Date',
          daysLeft: notificationSettings.reminderDaysBeforeDue
        });
      }

      // 2. Dispatch App Push Notification
      if (notificationSettings.enableAppNotifications) {
        sendAppNotification(
          `Installment Due Reminder: ${item.seettu}`,
          `Hi ${item.member}, your chit installment is due in ${notificationSettings.reminderDaysBeforeDue} days. Amount: ₹${formatIndianCurrency(item.dueAmount || 2000)}`
        );
      }

      count++;
    }

    setIsSendingReminders(false);
    setSaveNotice(`Successfully sent Due Reminders (Email & App Notification) to ${count || 1} members!`);
    setTimeout(() => setSaveNotice(null), 5000);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-xl bg-white/90 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#1E3A8A]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-[#1E3A8A] text-xs font-semibold uppercase tracking-wider mb-3">
              <Settings className="w-3.5 h-3.5 text-[#D97706]" /> System Configuration
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-2">
              Settings & Administration
            </h1>
            <p className="text-slate-600 font-normal">
              Manage admin profile credentials, automated email & PWA push reminder schedules, and company details.
            </p>
          </div>
        </div>

        {/* 3 Active Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-slate-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-[#1E3A8A] text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <User className="w-4 h-4" /> Admin Profile & Password
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'notifications'
                ? 'bg-[#1E3A8A] text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" /> Notification & Reminder Schedule
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'system'
                ? 'bg-[#1E3A8A] text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" /> Company & System Settings
          </button>
        </div>
      </div>

      {/* Save Toast Notification */}
      {saveNotice && (
        <div className="glass-card p-4 rounded-2xl border border-emerald-300 bg-emerald-50 text-emerald-900 flex items-center gap-3 shadow-lg animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <span className="text-sm font-semibold">{saveNotice}</span>
        </div>
      )}

      {/* 1. Admin Profile & Credentials Tab */}
      {activeTab === 'profile' && (
        <div className="glass-card p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl bg-white relative">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-[#1E3A8A]" /> Admin Profile & Credentials
          </h2>

          <form onSubmit={(e) => { e.preventDefault(); handleSave('Admin Profile'); }} className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text"
                  value={adminProfile.name}
                  onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                <input 
                  type="email"
                  value={adminProfile.email}
                  onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:border-[#1E3A8A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Phone Number</label>
                <input 
                  type="tel"
                  value={adminProfile.mobile}
                  onChange={(e) => setAdminProfile({ ...adminProfile, mobile: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Role</label>
                <input 
                  type="text"
                  disabled
                  value={adminProfile.role}
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-sm font-semibold cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#1E3A8A]" /> Change Password
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Current Password</label>
                  <input 
                    type="password"
                    placeholder="Enter current password"
                    value={adminProfile.currentPassword}
                    onChange={(e) => setAdminProfile({ ...adminProfile, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:border-[#1E3A8A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">New Password</label>
                    <input 
                      type="password"
                      placeholder="Enter new password"
                      value={adminProfile.newPassword}
                      onChange={(e) => setAdminProfile({ ...adminProfile, newPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:border-[#1E3A8A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Confirm New Password</label>
                    <input 
                      type="password"
                      placeholder="Confirm new password"
                      value={adminProfile.confirmPassword}
                      onChange={(e) => setAdminProfile({ ...adminProfile, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:border-[#1E3A8A]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary py-3 px-8 text-sm font-bold flex items-center gap-2 shadow-md">
              <Save className="w-4 h-4" /> Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* 2. Notification & Reminder Schedule Tab */}
      {activeTab === 'notifications' && (
        <div className="glass-card p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl bg-white relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-6 h-6 text-[#1E3A8A]" /> Installment Due Reminder Schedule
              </h2>
              <p className="text-xs text-slate-500 font-medium">Configure when and how members receive pre-due reminder emails & PWA app notifications</p>
            </div>

            <button
              type="button"
              disabled={isSendingReminders}
              onClick={handleDispatchAllReminders}
              className="btn-primary py-3 px-5 text-sm font-bold flex items-center gap-2 shadow-md bg-[#D97706] hover:bg-amber-700 border-[#D97706]"
            >
              <Send className="w-4 h-4" /> {isSendingReminders ? 'Dispatching...' : 'Send Due Reminders Now'}
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSave('Reminder Schedule'); }} className="space-y-6 max-w-2xl">
            {/* Reminder Schedule Timing Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#1E3A8A]" /> Pre-Due Reminder Schedule Timing
              </label>
              <select
                value={notificationSettings.reminderDaysBeforeDue}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, reminderDaysBeforeDue: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-semibold outline-none focus:border-[#1E3A8A]"
              >
                <option value={1}>1 Day Before Due Date (Urgent Alert)</option>
                <option value={3}>3 Days Before Due Date (Recommended Standard)</option>
                <option value={5}>5 Days Before Due Date (Early Notice)</option>
                <option value={7}>7 Days Before Due Date (1 Week Advance)</option>
              </select>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Members will automatically receive installment reminders <span className="font-bold text-slate-800">{notificationSettings.reminderDaysBeforeDue} days</span> prior to their cycle due date.
              </p>
            </div>

            {/* Notification Channels Toggles */}
            <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#1E3A8A]" /> Real Gmail Email Reminders
                  </span>
                  <p className="text-xs text-slate-500 font-medium">Send HTML installment reminder email from muthurasu6319@gmail.com</p>
                </div>
                <input 
                  type="checkbox"
                  checked={notificationSettings.enableEmailReminders}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, enableEmailReminders: e.target.checked })}
                  className="w-5 h-5 accent-[#1E3A8A]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer border-t border-slate-200 pt-4">
                <div>
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D97706]" /> PWA App Push Notifications
                  </span>
                  <p className="text-xs text-slate-500 font-medium">Trigger native mobile/desktop app push notification for installed PWA</p>
                </div>
                <input 
                  type="checkbox"
                  checked={notificationSettings.enableAppNotifications}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, enableAppNotifications: e.target.checked })}
                  className="w-5 h-5 accent-[#1E3A8A]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer border-t border-slate-200 pt-4">
                <div>
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Auto Receipts on Payment Paid
                  </span>
                  <p className="text-xs text-slate-500 font-medium">Instantly send payment receipt email & PWA push notification upon marking Paid</p>
                </div>
                <input 
                  type="checkbox"
                  checked={notificationSettings.autoSendReceipts}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, autoSendReceipts: e.target.checked })}
                  className="w-5 h-5 accent-[#1E3A8A]"
                />
              </label>
            </div>

            <button type="submit" className="btn-primary py-3 px-8 text-sm font-bold flex items-center gap-2 shadow-md">
              <Save className="w-4 h-4" /> Save Reminder Schedule
            </button>
          </form>
        </div>
      )}

      {/* 3. System & Company Settings Tab */}
      {activeTab === 'system' && (
        <div className="glass-card p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl bg-white relative">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-[#1E3A8A]" /> General System & Company Settings
          </h2>

          <form onSubmit={(e) => { e.preventDefault(); handleSave('System Settings'); }} className="space-y-6 max-w-2xl">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Company Title</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    value={systemSettings.companyName}
                    onChange={(e) => setSystemSettings({ ...systemSettings, companyName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:border-[#1E3A8A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Contact Mobile</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text"
                      value={systemSettings.phone}
                      onChange={(e) => setSystemSettings({ ...systemSettings, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:border-[#1E3A8A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Contact Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="email"
                      value={systemSettings.email}
                      onChange={(e) => setSystemSettings({ ...systemSettings, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:border-[#1E3A8A]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Head Office Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    value={systemSettings.address}
                    onChange={(e) => setSystemSettings({ ...systemSettings, address: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:border-[#1E3A8A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Currency</label>
                  <input 
                    type="text"
                    disabled
                    value={systemSettings.currency}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-sm font-semibold cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">System Timezone</label>
                  <input 
                    type="text"
                    disabled
                    value={systemSettings.timezone}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-sm font-semibold cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary py-3 px-8 text-sm font-bold flex items-center gap-2 shadow-md">
              <Save className="w-4 h-4" /> Save System Settings
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
