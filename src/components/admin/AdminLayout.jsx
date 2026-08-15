import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Lock, ShieldCheck, KeyRound, AlertCircle, ArrowLeft } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import logoImg from '../../assets/logo.png';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('jsa_admin_logged_in') === 'true';
  });
  
  // Admin Login Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const location = useLocation();

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    // Admin Credentials validation
    if (
      (adminEmail.toLowerCase() === 'admin' || adminEmail.toLowerCase() === 'admin@sriamman.com') && 
      (adminPassword === 'admin123' || adminPassword === 'admin')
    ) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('jsa_admin_logged_in', 'true');
    } else {
      setLoginError('Invalid Admin credentials. Demo: Username "admin" | Password "admin123"');
    }
  };

  // Get active title based on current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('chit-groups')) return 'Chit Groups Management';
    if (path.includes('members')) return 'Members Directory';
    if (path.includes('payments')) return 'Payments Ledger';
    if (path.includes('reports')) return 'Financial Reports';
    if (path.includes('settings')) return 'Settings & System';
    return 'Dashboard';
  };

  // If not logged in as Admin, show Admin Login Gateway
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden">
          <div className="text-center mb-8">
            <img src={logoImg} alt="Jai Sri Amman Finance Logo" className="h-14 mx-auto object-contain mb-4 rounded-xl shadow-sm" />
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#1E3A8A]/10 text-[#1E3A8A] text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-[#D97706]" /> Restricted Admin Gateway
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Admin Portal Sign In</h2>
            <p className="text-xs text-slate-500 font-medium">Accessible only by typing /admin URL</p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin Username / Email
              </label>
              <input 
                type="text"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="Enter admin username (e.g. admin)"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm focus:border-[#1E3A8A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin Security Password
              </label>
              <input 
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password (e.g. admin123)"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm focus:border-[#1E3A8A]"
              />
            </div>

            <button type="submit" className="w-full btn-primary py-3.5 text-sm font-bold shadow-md flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" /> Sign In to Admin Panel
            </button>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-[11px] text-center font-medium">
              Demo Admin Pass: <span className="font-bold text-slate-900 font-mono">admin</span> / <span className="font-bold text-slate-900 font-mono">admin123</span>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <a href="/" className="inline-flex items-center gap-1.5 text-xs text-[#1E3A8A] font-bold hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Website Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex font-sans">
      {/* Admin Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Layout Container */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader 
          setIsSidebarOpen={setIsSidebarOpen} 
          activeTitle={getPageTitle()} 
          onLogout={() => {
            setIsAdminLoggedIn(false);
            localStorage.removeItem('jsa_admin_logged_in');
          }}
        />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
