import React from 'react';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  PlusCircle, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { COMPANY_DETAILS, SEETTU_PLANS } from '../../config/constants';

export default function GlassAdminDashboard() {
  const stats = [
    { title: 'Total Members', value: '542 Members', change: '+12% this month', icon: Users, glow: 'from-blue-500/20 to-indigo-500/5', iconBg: 'text-blue-600 bg-blue-50' },
    { title: 'Monthly Collection', value: '₹4,85,000', change: '94% target reached', icon: CreditCard, glow: 'from-emerald-500/20 to-teal-500/5', iconBg: 'text-emerald-600 bg-emerald-50' },
    { title: 'Pending Dues', value: '₹32,500', change: '14 installments', icon: AlertTriangle, glow: 'from-amber-500/20 to-orange-500/5', iconBg: 'text-amber-600 bg-amber-50' },
    { title: 'Upcoming Maturities', value: '18 Members', change: 'Next 30 days', icon: Award, glow: 'from-purple-500/20 to-pink-500/5', iconBg: 'text-purple-600 bg-purple-50' }
  ];

  const recentTransactions = [
    { id: 'TXN-9021', name: 'Murugan K', plan: 'Weekly Savings Scheme (₹500)', amount: '₹500', date: 'Today, 10:45 AM', mode: 'Cash', status: 'Success' },
    { id: 'TXN-9020', name: 'Kavitha R', plan: 'Monthly Savings Scheme (₹2,000)', amount: '₹2,000', date: 'Today, 09:30 AM', mode: 'UPI (GPay)', status: 'Success' },
    { id: 'TXN-9019', name: 'Sundaram P', plan: 'Weekly Savings Scheme (₹1,000)', amount: '₹1,000', date: 'Yesterday', mode: 'Cash', status: 'Success' },
    { id: 'TXN-9018', name: 'Radha M', plan: 'Monthly Savings Scheme (₹5,000)', amount: '₹5,000', date: '12 Aug 2026', mode: 'Bank Transfer', status: 'Success' },
    { id: 'TXN-9017', name: 'Arun Kumar', plan: 'Weekly Savings Scheme (₹500)', amount: '₹500', date: '11 Aug 2026', mode: 'Cash', status: 'Pending' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden border border-slate-200 shadow-xl bg-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#1E3A8A]/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-[#1E3A8A]/20 text-[#1E3A8A] text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Admin Management Hub</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Welcome, Manager! 👋
            </h1>
            <p className="text-slate-600 text-base mt-2 max-w-xl">
              {COMPANY_DETAILS.name} — Real-time ledger, chit member management, and installment tracking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/admin/payments" className="btn-primary px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xs">
              <PlusCircle className="w-5 h-5" />
              <span>Record Payment</span>
            </Link>
            <Link to="/admin/members" className="btn-secondary px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xs">
              <Users className="w-5 h-5" />
              <span>Manage Members</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx} 
              className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-[#1E3A8A]/40 transition-all duration-300 bg-white border border-slate-200 shadow-xs"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.title}</span>
                <div className={`p-3 rounded-xl ${item.iconBg} border border-slate-200`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-slate-900 font-sans">{item.value}</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#1E3A8A]">
                <TrendingUp className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{item.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Sections (Two Column Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Transactions Table */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-200 space-y-6 bg-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Recent Payment Ledger</h3>
              <p className="text-xs text-slate-500">Live updated member installment entries</p>
            </div>
            <Link to="/admin/payments" className="text-xs font-bold text-[#1E3A8A] hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-800">
              <thead className="text-xs uppercase bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Receipt ID</th>
                  <th className="px-4 py-3.5">Member Name</th>
                  <th className="px-4 py-3.5">Scheme</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5">Method</th>
                  <th className="px-4 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 font-mono text-xs text-slate-400 font-semibold">{tx.id}</td>
                    <td className="px-4 py-4 font-bold text-slate-900">{tx.name}</td>
                    <td className="px-4 py-4 text-xs text-slate-600 font-medium">{tx.plan}</td>
                    <td className="px-4 py-4 font-extrabold text-emerald-700 font-sans">{tx.amount}</td>
                    <td className="px-4 py-4 text-xs text-slate-500 font-semibold">{tx.mode}</td>
                    <td className="px-4 py-4">
                      {tx.status === 'Success' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Active Plans Summary & Quick Actions */}
        <div className="space-y-6">
          {/* Active Seettu Plans */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200 space-y-4 bg-white shadow-lg">
            <h3 className="text-xl font-bold text-slate-900">Active Chit Groups</h3>
            {SEETTU_PLANS.map((plan) => (
              <div key={plan.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">{plan.title}</h4>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#1E3A8A]/10 text-[#1E3A8A] border border-[#1E3A8A]/20 uppercase">
                    {plan.id}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-200">
                  <div 
                    className="bg-[#1E3A8A] h-full rounded-full" 
                    style={{ width: plan.id === 'weekly' ? '82%' : '65%' }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 pt-1 font-semibold">
                  <span>Completed: {plan.id === 'weekly' ? '82%' : '65%'}</span>
                  <span>{plan.id === 'weekly' ? '320 Members' : '222 Members'}</span>
                </div>
              </div>
            ))}
            <Link 
              to="/admin/seettu" 
              className="w-full btn-secondary py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 mt-2"
            >
              <span>Manage Chit Groups</span>
            </Link>
          </div>

          {/* Quick Notice Card */}
          <div className="glass-card p-6 rounded-3xl border border-amber-300 bg-amber-50/60 space-y-3 shadow-xs">
            <div className="flex items-center gap-3 text-amber-800">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h4 className="font-bold text-sm text-amber-900">Overdue Installment Alert</h4>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              14 members have installment dues pending for this cycle month. Send automated SMS/Email reminders.
            </p>
            <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-xl text-xs font-bold transition-all shadow-xs">
              Send Reminders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
