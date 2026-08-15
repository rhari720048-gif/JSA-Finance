import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  History, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  X, 
  ChevronRight, 
  ArrowLeft,
  Coins,
  FileText,
  Check,
  Edit3,
  Trash2,
  FileSpreadsheet,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useSeettu } from '../../context/SeettuContext';
import { formatIndianCurrency } from '../../utils/formatCurrency';
import { exportToCSV, printPDFReport } from '../../utils/exportUtils';

export default function AdminMembers() {
  const { 
    seettuList, 
    membersList, 
    addMember, 
    updateMember, 
    deleteMember, 
    sendForgotPasswordOTP, 
    resetMemberPasswordWithOTP 
  } = useSeettu();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'add' | 'active' | 'pending'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null); // When set, renders IN-PAGE Member Profile
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit & Delete Modal States
  const [editingMember, setEditingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);

  // Password Visibility & OTP Reset Modal States
  const [showPassword, setShowPassword] = useState(false);
  const [otpModalData, setOtpModalData] = useState(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpNotice, setOtpNotice] = useState(null);

  // Scheme Filter state inside Member Profile
  const [selectedSchemeFilter, setSelectedSchemeFilter] = useState('All');

  // Checkbox Selection State for Enroll Seettu in Add/Edit Forms
  const [selectedSeettuIds, setSelectedSeettuIds] = useState([]);

  // Form State for Adding New Member (Includes Mobile, Email & Password)
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: 'member@123',
    address: ''
  });

  const toggleSeettuSelection = (schemeId) => {
    if (selectedSeettuIds.includes(schemeId)) {
      setSelectedSeettuIds(selectedSeettuIds.filter(id => id !== schemeId));
    } else {
      setSelectedSeettuIds([...selectedSeettuIds, schemeId]);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) return;

    const enrolledSchemes = seettuList
      .filter(s => selectedSeettuIds.includes(s.id))
      .map(s => ({ id: s.id, name: s.name, monthly: `₹${formatIndianCurrency(s.monthly)}`, status: 'Paid' }));

    const prefix = localStorage.getItem('jsa_member_id_prefix') || 'JSA';
    const existingNumbers = membersList
      .map(m => {
        const parts = m.id.split('-');
        return parseInt(parts[parts.length - 1], 10);
      })
      .filter(n => !isNaN(n));
      
    let nextNum = 1;
    while (existingNumbers.includes(nextNum)) {
      nextNum++;
    }
    const newId = `${prefix}-${nextNum.toString().padStart(3, '0')}`;

    const newMemberObj = {
      id: newId,
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      password: formData.password || 'member@123',
      address: formData.address || 'Madurai, Tamil Nadu',
      status: 'Active',
      seettuDetails: enrolledSchemes,
      paymentHistory: enrolledSchemes.map(s => ({
        seettu: s.name,
        amount: s.monthly,
        date: "Today",
        receiptNo: `JSA-RCP-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Paid',
        method: 'UPI'
      }))
    };

    addMember(newMemberObj);

    setFormData({ name: '', mobile: '', email: '', password: 'member@123', address: '' });
    setSelectedSeettuIds([]);
    setIsAddModalOpen(false);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    const memberSchemeIds = seettuList
      .filter(s => (member.seettuDetails || []).some(md => md.name.toLowerCase() === s.name.toLowerCase()))
      .map(s => s.id);
    setSelectedSeettuIds(memberSchemeIds);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingMember) return;

    const enrolledSchemes = seettuList
      .filter(s => selectedSeettuIds.includes(s.id))
      .map(s => ({ id: s.id, name: s.name, monthly: `₹${formatIndianCurrency(s.monthly)}`, status: 'Paid' }));

    const updatedObj = {
      ...editingMember,
      seettuDetails: enrolledSchemes
    };

    updateMember(updatedObj);
    if (selectedMember && selectedMember.id === editingMember.id) {
      setSelectedMember(updatedObj);
    }
    setEditingMember(null);
    setSelectedSeettuIds([]);
  };

  const handleDeleteConfirm = () => {
    if (!deletingMember) return;
    deleteMember(deletingMember.id);
    if (selectedMember && selectedMember.id === deletingMember.id) {
      setSelectedMember(null);
    }
    setDeletingMember(null);
  };

  // Forgot Password OTP Trigger
  const handleTriggerForgotPassword = (targetMember) => {
    const res = sendForgotPasswordOTP(targetMember.email || targetMember.mobile);
    if (res.success) {
      setOtpModalData({
        member: targetMember,
        generatedOtp: res.otp,
        email: res.email
      });
      setEnteredOtp('');
      setNewPassword('');
      setOtpNotice({ type: 'info', msg: res.message });
    } else {
      alert(res.message);
    }
  };

  const handleVerifyOtpAndResetPassword = (e) => {
    e.preventDefault();
    if (!otpModalData) return;

    const res = resetMemberPasswordWithOTP(enteredOtp, newPassword || 'newpass123');
    if (res.success) {
      setOtpNotice({ type: 'success', msg: res.message });
      setTimeout(() => {
        setOtpModalData(null);
        setOtpNotice(null);
      }, 2500);
    } else {
      setOtpNotice({ type: 'error', msg: res.message });
    }
  };

  // Download All Members
  const handleExportAllMembersCSV = () => {
    const headers = ["Member ID", "Member Name", "Mobile", "Email", "Password", "Address", "Enrolled Schemes Count", "Status"];
    const rows = membersList.map(m => [
      m.id, m.name, m.mobile, m.email, m.password || '••••••••', m.address, (m.seettuDetails || []).length, m.status
    ]);
    exportToCSV("All_Members_Directory", headers, rows);
  };

  const handleExportAllMembersPDF = () => {
    const headers = ["Member ID", "Member Name", "Mobile", "Email", "Enrolled Schemes", "Status"];
    const rows = membersList.map(m => [
      m.id, m.name, m.mobile, m.email, (m.seettuDetails || []).map(s => s.name).join("; "), m.status
    ]);
    const summary = [
      { label: "Total Members", value: membersList.length.toString() },
      { label: "Active Members", value: membersList.filter(m => m.status === 'Active').length.toString() },
    ];
    printPDFReport("Members Directory Statement", "Sri Amman Finance - Master Members List", headers, rows, summary);
  };

  const handleExportMemberStatementCSV = (member) => {
    const headers = ["Date & Time / Month", "Seettu Scheme", "Amount", "Receipt No", "Payment Method", "Status"];
    const rows = (member.paymentHistory || []).map(ph => [
      ph.date || ph.month, ph.seettu, ph.amount, ph.receiptNo, ph.method || 'N/A', ph.status
    ]);
    exportToCSV(`${member.name}_Financial_Statement`, headers, rows);
  };

  const handleExportMemberStatementPDF = (member) => {
    const headers = ["Date & Time / Month", "Seettu Scheme", "Amount", "Receipt No", "Payment Method", "Status"];
    const rows = (member.paymentHistory || []).map(ph => [
      ph.date || ph.month, ph.seettu, ph.amount, ph.receiptNo, ph.method || 'N/A', ph.status
    ]);
    const summary = [
      { label: "Member Name", value: member.name },
      { label: "Member ID", value: member.id },
      { label: "Mobile", value: member.mobile },
      { label: "Enrolled Schemes", value: (member.seettuDetails || []).length.toString() },
    ];
    printPDFReport(`Financial Statement - ${member.name}`, `Member Account Ledger`, headers, rows, summary);
  };

  // Filter Members
  const filteredMembers = membersList.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.mobile.includes(searchQuery) ||
                          member.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'active') return matchesSearch && member.status === 'Active';
    if (activeTab === 'pending') return matchesSearch && member.status === 'Pending';
    return matchesSearch;
  });

  const currentMember = selectedMember ? (membersList.find(m => m.id === selectedMember.id) || selectedMember) : null;

  // IN-PAGE Member Profile View
  if (currentMember) {
    return (
      <div className="space-y-8 pb-10">
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSelectedMember(null)}
            className="btn-secondary py-2.5 px-5 text-sm font-bold flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 text-[#1E3A8A]" /> Back to Members Directory
          </button>

          <span className="text-xs font-mono font-bold px-3.5 py-1.5 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-xl">
            ID: {currentMember.id}
          </span>
        </div>

        {/* Member Profile Main Banner */}
        <div className="glass-card p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-xl bg-white/90 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#1E3A8A]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-3xl bg-[#1E3A8A] text-white flex items-center justify-center text-4xl font-serif font-bold shadow-xl flex-shrink-0">
                {currentMember.name.charAt(0)}
              </div>

              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900">{currentMember.name}</h1>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    currentMember.status === 'Active' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {currentMember.status}
                  </span>
                </div>
                <p className="text-slate-600 text-sm font-medium">Member Profile, Login Credentials & Payment Ledger</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => handleTriggerForgotPassword(currentMember)}
                className="px-4 py-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold hover:bg-amber-100 flex items-center gap-1.5 transition-colors"
              >
                <KeyRound className="w-4 h-4 text-amber-700" /> Forgot Password (Send OTP)
              </button>
              <button 
                onClick={() => openEditModal(currentMember)}
                className="btn-secondary py-2.5 px-4 text-xs font-bold flex items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4 text-[#1E3A8A]" /> Edit Profile
              </button>
              <button 
                onClick={() => setDeletingMember(currentMember)}
                className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>

        {/* 1. Personal Details & Credentials Section */}
        <div className="glass-card p-6 sm:p-8 rounded-[2rem] border border-slate-200 bg-white/90 backdrop-blur-xl shadow-md">
          <h2 className="text-xl font-bold font-serif text-slate-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#1E3A8A]" /> Contact Details & Member Credentials
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#1E3A8A]" /> Mobile Number
              </p>
              <p className="font-extrabold text-slate-900 text-base">{currentMember.mobile}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#1E3A8A]" /> Registered Email
              </p>
              <p className="font-extrabold text-slate-900 text-base truncate">{currentMember.email}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#1E3A8A]" /> Account Password
              </p>
              <div className="flex items-center justify-between">
                <p className="font-extrabold text-slate-900 text-base font-mono">
                  {showPassword ? currentMember.password || 'member@123' : '••••••••'}
                </p>
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 rounded-lg text-slate-500 hover:text-[#1E3A8A]"
                  title="Toggle Password Visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#1E3A8A]" /> Residential Address
              </p>
              <p className="font-bold text-slate-900 text-sm leading-relaxed truncate">{currentMember.address}</p>
            </div>
          </div>
        </div>

        {/* 2. Seettu Details Section (Enrolled Schemes) */}
        <div className="glass-card p-6 sm:p-8 rounded-[2rem] border border-slate-200 bg-white/90 backdrop-blur-xl shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#1E3A8A]" /> Enrolled Seettu Schemes & Contributions
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Filter payment ledger by selecting any scheme card below</p>
            </div>

            <button 
              onClick={() => setSelectedSchemeFilter('All')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedSchemeFilter === 'All'
                  ? 'bg-[#1E3A8A] text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Show All Schemes ({currentMember.seettuDetails.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentMember.seettuDetails.map((seettu, idx) => {
              const isSelected = selectedSchemeFilter.toLowerCase() === seettu.name.toLowerCase();
              return (
                <div 
                  key={idx} 
                  onClick={() => setSelectedSchemeFilter(isSelected ? 'All' : seettu.name)}
                  className={`p-5 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer transition-all border ${
                    isSelected 
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] ring-2 ring-[#1E3A8A]/40 shadow-xl scale-[1.02]' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-slate-900'}`}>{seettu.name}</h3>
                      {isSelected && (
                        <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-white/20 text-white">
                          Filtered
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${isSelected ? 'text-amber-100' : 'text-slate-500'}`}>
                      Monthly Dues: <span className={`font-bold text-sm ${isSelected ? 'text-white font-sans' : 'text-[#1E3A8A]'}`}>{seettu.monthly}</span>
                    </p>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    isSelected
                      ? 'bg-white/20 text-white border-white/30'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}>
                    {seettu.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Payment History Ledger Table */}
        <div className="glass-card p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-xl bg-white/90 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-[#1E3A8A]" /> 
                Payment History Statement {selectedSchemeFilter !== 'All' && <span className="text-[#1E3A8A] text-sm font-sans font-extrabold">({selectedSchemeFilter})</span>}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {selectedSchemeFilter === 'All' 
                  ? `Showing transaction statement records for all enrolled schemes of ${currentMember.name}`
                  : `Filtered payment records for scheme "${selectedSchemeFilter}"`
                }
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => handleExportMemberStatementPDF(currentMember)}
                className="px-3.5 py-1.5 rounded-xl bg-[#1E3A8A]/10 text-[#1E3A8A] border border-[#1E3A8A]/20 text-xs font-bold hover:bg-[#1E3A8A]/20 transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" /> PDF Statement
              </button>
              <button 
                onClick={() => handleExportMemberStatementCSV(currentMember)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Excel Statement
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold bg-slate-50/50">
                  <th className="py-3.5 px-4 rounded-l-xl">Month / Cycle</th>
                  <th className="py-3.5 px-4">Seettu Scheme</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Receipt No</th>
                  <th className="py-3.5 px-4 text-right rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentMember.paymentHistory
                  .filter(ph => selectedSchemeFilter === 'All' || ph.seettu.toLowerCase().includes(selectedSchemeFilter.toLowerCase()) || selectedSchemeFilter.toLowerCase().includes(ph.seettu.toLowerCase()))
                  .map((ph, index) => (
                    <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-semibold text-slate-900">{ph.month || "August 2026"}</td>
                      <td className="py-4 px-4 text-slate-600 text-xs font-semibold">{ph.seettu}</td>
                      <td className="py-4 px-4 font-bold text-slate-900 font-sans">{ph.amount}</td>
                      <td className="py-4 px-4 text-xs text-slate-500">{ph.date}</td>
                      <td className="py-4 px-4 font-mono text-xs text-[#1E3A8A] font-bold">{ph.receiptNo}</td>
                      <td className="py-4 px-4 text-right">
                        {ph.status === 'Paid' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold bg-rose-100 text-rose-800 px-3 py-1 rounded-full border border-rose-200">
                            <AlertCircle className="w-3.5 h-3.5" /> Pending
                          </span>
                        )}
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Forgot Password OTP Modal */}
        {otpModalData && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl relative">
              <button 
                onClick={() => setOtpModalData(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                <KeyRound className="w-7 h-7" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">Forgot Password OTP</h2>
              <p className="text-xs text-slate-500 text-center mb-4">Reset credentials via Email Verification Code</p>

              {otpNotice && (
                <div className={`p-3 rounded-xl text-xs font-bold mb-4 ${
                  otpNotice.type === 'success' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : 
                  otpNotice.type === 'error' ? 'bg-rose-100 text-rose-900 border border-rose-200' : 'bg-blue-50 text-blue-900 border border-blue-200'
                }`}>
                  {otpNotice.msg}
                </div>
              )}

              <form onSubmit={handleVerifyOtpAndResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Enter 6-Digit OTP Code
                  </label>
                  <input 
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 482910"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center text-lg font-bold outline-none focus:border-[#1E3A8A]"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">OTP sent to: {otpModalData.email}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Enter New Password
                  </label>
                  <input 
                    type="password"
                    required
                    placeholder="Create new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm focus:border-[#1E3A8A]"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setOtpModalData(null)}
                    className="w-1/2 btn-secondary py-3 text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="w-1/2 btn-primary py-3 text-xs font-bold"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Normal Directory List View when no member is selected
  return (
    <div className="space-y-8 pb-10">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-xl bg-white/90 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#1E3A8A]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-[#1E3A8A] text-xs font-semibold uppercase tracking-wider mb-3">
              <Users className="w-3.5 h-3.5 text-[#D97706]" /> Members Management
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 mb-2">
              All Members
            </h1>
            <p className="text-slate-600 font-normal">
              Manage member profiles, personal credentials, enrolled seettu schemes, and payment histories.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={handleExportAllMembersPDF}
              className="px-4 py-3 rounded-xl bg-[#1E3A8A]/10 text-[#1E3A8A] border border-[#1E3A8A]/20 text-xs font-bold hover:bg-[#1E3A8A]/20 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" /> PDF Members List
            </button>
            <button 
              onClick={handleExportAllMembersCSV}
              className="px-4 py-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" /> Excel Members List
            </button>
            <button 
              onClick={() => {
                setActiveTab('add');
                setIsAddModalOpen(true);
              }}
              className="btn-primary py-3.5 px-6 text-sm flex-shrink-0"
            >
              <UserPlus className="w-5 h-5" /> Add Member
            </button>
          </div>
        </div>

        {/* 4 Requested Tabs Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-slate-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'all'
                ? 'bg-[#1E3A8A] text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Members ({membersList.length})
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'active'
                ? 'bg-[#1E3A8A] text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Active Members ({membersList.filter(m => m.status === 'Active').length})
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'pending'
                ? 'bg-[#1E3A8A] text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Pending Payments ({membersList.filter(m => m.status === 'Pending').length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member by name, mobile, or ID..."
            className="w-full pl-11 pr-4 py-3 bg-white/90 border border-slate-200 rounded-2xl outline-none text-slate-900 shadow-sm backdrop-blur-md focus:border-[#1E3A8A] text-sm"
          />
        </div>
      </div>

      {/* Members Cards Grid */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="glass-card glass-card-hover p-6 rounded-3xl border border-slate-200 relative overflow-hidden bg-white/90 backdrop-blur-xl shadow-lg flex flex-col justify-between"
            >
              <div className={`absolute top-0 left-0 right-0 h-2 ${
                member.status === 'Active' ? 'bg-[#1E3A8A]' : 'bg-rose-500'
              }`}></div>

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#1E3A8A]">{member.id}</span>
                    <h3 className="text-2xl font-extrabold font-serif text-slate-900">
                      {member.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openEditModal(member); }}
                      className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-200 transition-colors"
                      title="Edit Member Profile"
                    >
                      <Edit3 className="w-4.5 h-4.5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDeletingMember(member); }}
                      className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                      title="Delete Member"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      member.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-sm text-slate-700 py-3 border-y border-slate-100">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#1E3A8A]" />
                    <span className="font-extrabold text-slate-900 text-sm">{member.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate text-xs text-slate-600">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#1E3A8A]" />
                    <span className="font-bold text-slate-800 text-sm">{member.seettuDetails.length} Enrolled Seettu</span>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setSelectedMember(member)}
                className="pt-4 flex items-center justify-between text-sm font-bold text-[#1E3A8A] hover:translate-x-1 transition-transform cursor-pointer"
              >
                <span>View In-Page Profile</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 rounded-[2.5rem] border border-slate-200 bg-white/90 backdrop-blur-xl text-center space-y-4 shadow-lg">
          <div className="w-16 h-16 bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 text-[#1E3A8A] rounded-2xl flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-serif text-slate-900">No Members Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add your first member with Mobile, Email & Password credentials to enroll them into active chit schemes.
          </p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary py-3 px-6 text-xs font-bold"
          >
            <UserPlus className="w-4 h-4" /> Add First Member
          </button>
        </div>
      )}

      {/* Add Member Form Modal with Credentials */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl bg-white/95 backdrop-blur-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold font-serif text-slate-900 mb-1">Add New Member</h2>
            <p className="text-xs text-slate-500 mb-6">Enter personal contact details, account password & select Seettu schemes to enroll.</p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Hari Raj"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm focus:border-[#1E3A8A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Mobile Number</label>
                  <input 
                    type="tel"
                    required
                    placeholder="9003454109"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm focus:border-[#1E3A8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                  <input 
                    type="email"
                    placeholder="hariraj2005.m@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm focus:border-[#1E3A8A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Account Password (For Member Portal Login)
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. member@123"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm font-mono focus:border-[#1E3A8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Address</label>
                <textarea 
                  rows={2}
                  placeholder="45, West Street, Madurai - 625001"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm focus:border-[#1E3A8A]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Enrolled Seettu Schemes
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">Check one or more</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  {seettuList.map((scheme) => {
                    const isChecked = selectedSeettuIds.includes(scheme.id);
                    return (
                      <label 
                        key={scheme.id}
                        onClick={() => toggleSeettuSelection(scheme.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                          isChecked 
                            ? 'bg-white border-[#1E3A8A] shadow-sm ring-1 ring-[#1E3A8A]/30' 
                            : 'bg-slate-100/70 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            isChecked ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{scheme.name}</p>
                            <p className="text-[11px] text-slate-500 font-normal">{scheme.type} • {scheme.duration}</p>
                          </div>
                        </div>

                        <span className="text-xs font-extrabold text-[#1E3A8A] font-sans">
                          ₹{formatIndianCurrency(scheme.monthly)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 btn-secondary py-3 text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 btn-primary py-3 text-sm"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl bg-white/95 backdrop-blur-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setEditingMember(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold font-serif text-slate-900 mb-1">Edit Member Profile</h2>
            <p className="text-xs text-slate-500 mb-6">Update contact details and enrolled Seettu schemes.</p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text"
                  required
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm focus:border-[#1E3A8A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Mobile Number</label>
                  <input 
                    type="tel"
                    required
                    value={editingMember.mobile}
                    onChange={(e) => setEditingMember({ ...editingMember, mobile: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm focus:border-[#1E3A8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Status</label>
                  <select 
                    value={editingMember.status}
                    onChange={(e) => setEditingMember({ ...editingMember, status: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm focus:border-[#1E3A8A]"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email</label>
                <input 
                  type="email"
                  value={editingMember.email}
                  onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm focus:border-[#1E3A8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Account Password</label>
                <input 
                  type="text"
                  value={editingMember.password || 'member@123'}
                  onChange={(e) => setEditingMember({ ...editingMember, password: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm font-mono focus:border-[#1E3A8A]"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setEditingMember(null)}
                  className="w-1/2 btn-secondary py-3 text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 btn-primary py-3 text-sm"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Member Confirmation Modal */}
      {deletingMember && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl bg-white/95 backdrop-blur-2xl relative text-center">
            <button 
              onClick={() => setDeletingMember(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-rose-100 border border-rose-200 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold font-serif text-slate-900 mb-2">Delete Member Profile?</h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to delete member profile for <span className="font-bold text-slate-900">"{deletingMember.name}"</span> ({deletingMember.id})? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setDeletingMember(null)}
                className="w-1/2 btn-secondary py-3 text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="w-1/2 py-3 text-sm font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700 shadow-md transition-colors"
              >
                Delete Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
