import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  ShieldCheck, 
  CreditCard, 
  Download, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  Briefcase, 
  Key, 
  Lock,
  ArrowRight,
  Sparkles,
  QrCode,
  Check,
  Building2,
  Calendar,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useSeettu } from '../../context/SeettuContext';
import { formatIndianCurrency } from '../../utils/formatCurrency';
import { printPDFReport } from '../../utils/exportUtils';
import logoImg from '../../assets/logo.png';

export default function MemberDashboard() {
  const { 
    activeMember, 
    logoutMember, 
    paymentsList, 
    markPaymentAsPaid, 
    changeMemberPassword 
  } = useSeettu();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('history'); // Default view: Payment History & PDF Receipts!
  const [selectedPayItem, setSelectedPayItem] = useState(null);
  const [paySuccessMsg, setPaySuccessMsg] = useState('');
  
  // Change Password Form State with Eye Toggle
  const [passData, setPassData] = useState({ oldPass: '', newPass: '', confirmPass: '' });
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  if (!activeMember) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full text-center space-y-4">
          <img src={logoImg} alt="JSA Finance Logo" className="h-16 mx-auto object-contain mb-2" />
          <h2 className="text-2xl font-bold text-slate-900">Member Portal Access</h2>
          <p className="text-sm text-slate-600">Please log in on our website to access your personal member dashboard.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2"
          >
            Return to Homepage & Log In
          </button>
        </div>
      </div>
    );
  }

  // Filter payments for this active member
  const memberPayments = paymentsList.filter(
    p => p.memberId === activeMember.id || p.member.toLowerCase() === activeMember.name.toLowerCase()
  );

  const history = activeMember.paymentHistory || [];
  const totalPaidAmount = history.reduce((sum, item) => {
    const numeric = parseInt((item.amount || '0').replace(/[^0-9]/g, ''), 10) || 0;
    return sum + (item.status === 'Paid' ? numeric : 0);
  }, 0);

  const pendingPayments = memberPayments.filter(p => p.status !== 'Paid');
  const totalPendingAmount = pendingPayments.reduce((sum, p) => sum + (p.dueAmount || 0), 0);

  // Single payment PDF receipt downloader
  const handleDownloadReceiptPDF = (receipt) => {
    const headers = ["Receipt No", "Member Name", "Seettu Scheme", "Paid Amount", "Date & Time", "Payment Method", "Status"];
    const rows = [
      [
        receipt.receiptNo || 'JSA-RCP-MANUAL',
        activeMember.name,
        receipt.seettu || 'Chit Scheme',
        receipt.amount || `₹${formatIndianCurrency(receipt.dueAmount)}`,
        receipt.date || new Date().toLocaleString(),
        receipt.method || 'Online UPI',
        'Paid'
      ]
    ];
    const metrics = [
      { label: "Receipt No", value: receipt.receiptNo || 'JSA-RCP-MANUAL' },
      { label: "Member Name", value: activeMember.name },
      { label: "Amount Paid", value: receipt.amount || `₹${formatIndianCurrency(receipt.dueAmount)}` },
      { label: "Member ID", value: activeMember.id }
    ];

    printPDFReport(`Payment Receipt - ${receipt.receiptNo || activeMember.id}`, "Jai Sri Amman Finance", headers, rows, metrics);
  };

  // Pay Due Online Modal Handler
  const handleExecutePayment = (payId) => {
    markPaymentAsPaid(payId, 'UPI');
    setPaySuccessMsg('Payment Successful! Receipt issued & sent to your Email.');
    setSelectedPayItem(null);
    setTimeout(() => setPaySuccessMsg(''), 4000);
  };

  // Handle Password Change with Old Password Validation
  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!passData.oldPass) {
      setPassError('Please enter your current (old) password.');
      return;
    }

    if (!passData.newPass) {
      setPassError('Please enter a new password.');
      return;
    }

    if (passData.newPass !== passData.confirmPass) {
      setPassError('New password and confirm password do not match.');
      return;
    }

    const res = changeMemberPassword(activeMember.id, passData.oldPass, passData.newPass);
    if (!res.success) {
      setPassError(res.message);
    } else {
      setPassSuccess(res.message);
      setPassData({ oldPass: '', newPass: '', confirmPass: '' });
      setTimeout(() => setPassSuccess(''), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-16">
      
      {/* Top Premium Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={logoImg} alt="Jai Sri Amman Finance Logo" className="h-10 sm:h-12 w-auto object-contain" />
            </Link>
            <div className="hidden sm:block border-l border-slate-200 pl-4">
              <span className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider block">Member Portal</span>
              <span className="text-xs text-slate-500 font-semibold">Self-Service Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-bold text-slate-900">{activeMember.name}</span>
              <span className="text-xs text-slate-500 font-mono">{activeMember.id}</span>
            </div>

            <button 
              onClick={() => { logoutMember(); navigate('/'); }}
              className="px-3.5 py-2 rounded-xl border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* Welcome Banner Card */}
        <div className="glass-card p-6 sm:p-8 rounded-[2rem] border border-slate-200 bg-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#1E3A8A]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Active Verified Member
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 mb-2">
                Welcome back, {activeMember.name}!
              </h1>
              <p className="text-slate-600 text-sm font-normal">
                Track your active chit savings schemes, check payment ledgers, and download official PDF receipts anytime.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-[#1E3A8A]">
                ID: {activeMember.id}
              </span>
              <span className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900">
                Mobile: {activeMember.mobile}
              </span>
            </div>
          </div>
        </div>

        {/* Notification Toast Message */}
        {paySuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-bold flex items-center gap-3 shadow-md animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
            <span>{paySuccessMsg}</span>
          </div>
        )}

        {/* 4 Summary Stats Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enrolled Schemes</span>
              <div className="p-2 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-xl">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{activeMember.seettuDetails?.length || 1}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Active Chit Contributions</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Paid So Far</span>
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-800">₹{formatIndianCurrency(totalPaidAmount)}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Accumulated Contributions</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Dues</span>
              <div className="p-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-100">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-900">₹{formatIndianCurrency(totalPendingAmount)}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Upcoming Installments</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Status</span>
              <div className="p-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900 uppercase">Verified</p>
            <p className="text-xs text-emerald-700 font-semibold mt-1">100% Clean Track Record</p>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-[#1E3A8A] text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Download className="w-4 h-4" /> Payment History & PDF Receipts
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-[#1E3A8A] text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Briefcase className="w-4 h-4" /> My Schemes
          </button>

          <button
            onClick={() => setActiveTab('pay')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === 'pay'
                ? 'bg-[#D97706] text-white shadow-md'
                : 'bg-white text-amber-900 border border-amber-200 hover:bg-amber-50'
            }`}
          >
            <QrCode className="w-4 h-4" /> Pay Due Online
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-[#1E3A8A] text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Lock className="w-4 h-4" /> Account Security & Password
          </button>
        </div>

        {/* 1. My Enrolled Schemes Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#1E3A8A]" /> Enrolled Chit Schemes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeMember.seettuDetails && activeMember.seettuDetails.length > 0 ? (
                activeMember.seettuDetails.map((detail, idx) => (
                  <div key={idx} className="glass-card p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Chit Scheme</span>
                        <h3 className="text-lg font-bold text-slate-900">{detail.name}</h3>
                      </div>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
                        Enrolled
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <span className="text-slate-500 font-semibold block">Monthly Installment</span>
                        <span className="text-base font-extrabold text-[#1E3A8A]">₹2,000 / month</span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <span className="text-slate-500 font-semibold block">Duration</span>
                        <span className="text-base font-extrabold text-slate-800">20 Months</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Contribution Progress</span>
                        <span>Active Cycle</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#1E3A8A] h-full rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white text-center space-y-3 col-span-2">
                  <p className="text-slate-600 text-sm font-semibold">You are registered in the JSA Finance general pool.</p>
                  <p className="text-xs text-slate-500">Contact admin to enroll in specific high-yield chit schemes.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Payment History & Receipts Tab */}
        {activeTab === 'history' && (
          <div className="glass-card p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 bg-white shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Download className="w-5 h-5 text-[#1E3A8A]" /> Payment History & PDF Receipts
                </h2>
                <p className="text-xs text-slate-500 font-medium">Download official PDF receipts for your installment payments</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold bg-slate-50">
                    <th className="py-3.5 px-4 rounded-l-xl">Receipt No</th>
                    <th className="py-3.5 px-4">Chit Scheme</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Method</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {history && history.length > 0 ? (
                    history.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-[#1E3A8A]">{item.receiptNo || 'JSA-RCP-ACK'}</td>
                        <td className="py-4 px-4 font-bold text-slate-900">{item.seettu || 'Chit Scheme'}</td>
                        <td className="py-4 px-4 font-extrabold text-slate-900">{item.amount || '₹2,000'}</td>
                        <td className="py-4 px-4 text-slate-600 font-semibold">{item.date || 'Recent'}</td>
                        <td className="py-4 px-4 text-slate-700 font-semibold">{item.method || 'UPI / Cash'}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            item.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.status || 'Paid'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleDownloadReceiptPDF(item)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#1E3A8A] text-slate-700 hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5 ml-auto"
                          >
                            <Download className="w-3.5 h-3.5" /> Receipt PDF
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-500 font-medium">
                        No payment transactions recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Pay Due Online Tab */}
        {activeTab === 'pay' && (
          <div className="glass-card p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 bg-white shadow-md space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <QrCode className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Pay Pending Installment Online</h2>
              <p className="text-xs text-slate-500 font-medium">Scan Official Company UPI QR Code or choose payment mode</p>
            </div>

            {pendingPayments && pendingPayments.length > 0 ? (
              <div className="space-y-4">
                {pendingPayments.map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Pending Due</span>
                      <h4 className="text-base font-bold text-slate-900">{item.seettu} ({item.month})</h4>
                      <p className="text-xs text-slate-600 font-semibold">Amount Due: <span className="font-extrabold text-[#1E3A8A]">₹{formatIndianCurrency(item.dueAmount)}</span></p>
                    </div>

                    <button
                      onClick={() => handleExecutePayment(item.id)}
                      className="w-full sm:w-auto btn-primary py-2.5 px-6 text-xs font-bold flex items-center justify-center gap-2 bg-[#D97706] hover:bg-amber-700 border-[#D97706]"
                    >
                      <Check className="w-4 h-4" /> Pay ₹{formatIndianCurrency(item.dueAmount)} Now
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 text-emerald-900">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base">All Installments Paid!</h4>
                <p className="text-xs">You have no pending dues for the current active cycle.</p>
              </div>
            )}
          </div>
        )}

        {/* 4. Security & Account Tab (With Old Password Validation) */}
        {activeTab === 'security' && (
          <div className="glass-card p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 bg-white shadow-md space-y-6 max-w-xl mx-auto">
            <div className="text-center space-y-1 pb-2 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-[#1E3A8A]/10 text-[#1E3A8A] flex items-center justify-center mx-auto mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Change Member Password</h2>
              <p className="text-xs text-slate-500 font-medium">Enter your current old password to set a new password</p>
            </div>

            {passError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            {passSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>{passSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Registered Mobile / Email</label>
                <input 
                  type="text"
                  disabled
                  value={activeMember.email || activeMember.mobile}
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-sm font-semibold cursor-not-allowed"
                />
              </div>

              {/* Old / Current Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Current (Old) Password</label>
                <div className="relative">
                  <input 
                    type={showOldPass ? "text" : "password"}
                    required
                    placeholder="Enter current old password"
                    value={passData.oldPass}
                    onChange={(e) => setPassData({ ...passData, oldPass: e.target.value })}
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:border-[#1E3A8A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                  >
                    {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">New Password</label>
                <div className="relative">
                  <input 
                    type={showNewPass ? "text" : "password"}
                    required
                    placeholder="Enter new password"
                    value={passData.newPass}
                    onChange={(e) => setPassData({ ...passData, newPass: e.target.value })}
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:border-[#1E3A8A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPass ? "text" : "password"}
                    required
                    placeholder="Confirm new password"
                    value={passData.confirmPass}
                    onChange={(e) => setPassData({ ...passData, confirmPass: e.target.value })}
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:border-[#1E3A8A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full btn-primary py-3 text-xs font-bold shadow-md">
                Update Password
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
