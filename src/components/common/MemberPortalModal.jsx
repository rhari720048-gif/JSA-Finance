import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  User, 
  Lock, 
  Smartphone, 
  Mail, 
  Briefcase, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  LogOut,
  ShieldCheck,
  Receipt,
  Eye,
  EyeOff
} from 'lucide-react';
import { useSeettu } from '../../context/SeettuContext';
import { formatIndianCurrency } from '../../utils/formatCurrency';
import { subscribeToWebPush } from '../../utils/notificationService';
import logoImg from '../../assets/logo.png';

export default function MemberPortalModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { 
    membersList, 
    activeMember, 
    loginMember, 
    logoutMember, 
    sendForgotPasswordOTP, 
    resetMemberPasswordWithOTP 
  } = useSeettu();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Forgot password OTP flow sub-state
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [otpStep, setOtpStep] = useState(1); // 1: Send OTP, 2: Enter OTP & Reset
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpInfo, setOtpInfo] = useState(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanId = identifier ? identifier.trim().toLowerCase() : '';

    // 1. Unified Admin Credentials validation (Redirects to Admin Dashboard)
    if (
      (cleanId === 'admin' || cleanId === 'admin@sriamman.com' || cleanId === 'admin@sriammanfinance.com') && 
      (password === 'admin123' || password === 'admin')
    ) {
      setSuccessMessage('Admin credentials verified! Redirecting to Admin Panel...');
      localStorage.setItem('jsa_admin_logged_in', 'true');
      setTimeout(() => {
        onClose();
        navigate('/admin/dashboard');
      }, 500);
      return;
    }

    // 2. Member Credentials validation (Redirects to Member Dashboard)
    const res = loginMember(identifier, password);
    if (!res.success) {
      setErrorMessage(res.message);
    } else {
      setSuccessMessage(`Welcome back, ${res.member.name}! Redirecting to your dashboard...`);
      
      // Request Push Notification Permission & Subscribe
      subscribeToWebPush(res.member.id);

      setTimeout(() => {
        onClose();
        navigate('/member/dashboard');
      }, 500);
    }
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const res = sendForgotPasswordOTP(forgotInput);
    if (!res.success) {
      setErrorMessage(res.message);
    } else {
      setOtpInfo(res);
      setOtpStep(2);
      setSuccessMessage(`Real 6-Digit OTP code sent to your registered Gmail address: ${res.email}`);
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const res = resetMemberPasswordWithOTP(enteredOtp, newPassword);
    if (!res.success) {
      setErrorMessage(res.message);
    } else {
      setSuccessMessage(res.message);
      setIsForgotMode(false);
      setOtpStep(1);
      setPassword(newPassword);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Close Modal Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4 border-b border-slate-100">
          <img src={logoImg} alt="Jai Sri Amman Finance Logo" className="h-12 mx-auto object-contain mb-2 rounded-xl shadow-sm" />
          <h2 className="text-2xl font-bold text-slate-900">Portal Login</h2>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            {activeMember ? 'Logged in as Member' : 'Member & Admin Portal Sign In'}
          </p>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          
          {/* VIEW 1: MEMBER IS LOGGED IN */}
          {activeMember ? (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-md space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">Active Member</span>
                    <h3 className="text-2xl font-bold text-white">{activeMember.name}</h3>
                    <p className="text-xs text-blue-100 font-mono mt-0.5">ID: {activeMember.id}</p>
                  </div>
                  <button 
                    onClick={logoutMember}
                    className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors flex items-center gap-1 text-xs font-bold"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>

              <button
                onClick={() => { onClose(); navigate('/member/dashboard'); }}
                className="w-full btn-primary py-3.5 text-sm font-bold shadow-md flex items-center justify-center gap-2"
              >
                Go to My Member Dashboard
              </button>
            </div>
          ) : isForgotMode ? (
            /* VIEW 2: FORGOT PASSWORD OTP MODE */
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-amber-200">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Reset Password</h3>
                <p className="text-xs text-slate-500 font-medium">We will dispatch a 6-digit OTP verification code directly to your email.</p>
              </div>

              {otpStep === 1 ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Registered Mobile Number or Email
                    </label>
                    <input 
                      type="text"
                      required
                      value={forgotInput}
                      onChange={(e) => setForgotInput(e.target.value)}
                      placeholder="e.g. 9003454109 or member@gmail.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm focus:border-[#1E3A8A]"
                    />
                  </div>

                  <button type="submit" className="w-full btn-primary py-3 text-sm font-bold shadow-sm">
                    Send OTP Code to Email
                  </button>

                  <button 
                    type="button"
                    onClick={() => { setIsForgotMode(false); setErrorMessage(''); setSuccessMessage(''); }}
                    className="w-full text-xs text-slate-500 font-bold hover:underline py-1"
                  >
                    Back to Login
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold text-center">
                    ✉️ Real 6-Digit OTP sent to your registered Gmail inbox ({otpInfo?.email})
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Enter 6-Digit OTP
                    </label>
                    <input 
                      type="text"
                      required
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm font-mono font-bold tracking-widest text-center focus:border-[#1E3A8A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm focus:border-[#1E3A8A]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="w-full btn-primary py-3 text-sm font-bold shadow-sm">
                    Verify OTP & Reset Password
                  </button>

                  <button 
                    type="button"
                    onClick={() => setOtpStep(1)}
                    className="w-full text-xs text-slate-500 font-bold hover:underline py-1"
                  >
                    Resend OTP
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* VIEW 3: UNIFIED LOGIN FORM (MEMBER & ADMIN) */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter mobile or email"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm focus:border-[#1E3A8A]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button 
                    type="button"
                    onClick={() => { setIsForgotMode(true); setErrorMessage(''); setSuccessMessage(''); }}
                    className="text-xs text-[#1E3A8A] font-bold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                
                {/* Password Input with Eye Visibility Toggle Button */}
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm focus:border-[#1E3A8A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full btn-primary py-3 text-sm font-bold shadow-md">
                Sign In
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
