import React from 'react';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  AlertCircle, 
  Wallet, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  Plus, 
  FileText,
  Search,
  Filter,
  CreditCard,
  Printer,
  ChevronRight
} from 'lucide-react';
import { COMPANY_DETAILS } from '../../config/constants';
import { useSeettu } from '../../context/SeettuContext';
import { formatIndianCurrency } from '../../utils/formatCurrency';
import { useNavigate } from 'react-router-dom';
import { printPDFReport } from '../../utils/exportUtils';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { seettuList, membersList, paymentsList } = useSeettu();

  const totalCollected = paymentsList.reduce((acc, curr) => acc + (curr.paid || 0), 0);
  const totalPending = paymentsList.reduce((acc, curr) => acc + (curr.balance || 0), 0);
  const totalDueTarget = paymentsList.reduce((acc, curr) => acc + (curr.dueAmount || 0), 0);

  const activeSchemesCount = seettuList.filter(s => s.status === 'Active').length;
  const activeMembersCount = membersList.filter(m => m.status === 'Active').length;

  const handlePrintDashboard = () => {
    const headers = ["Transaction ID", "Member Name", "Seettu Scheme", "Amount", "Method", "Status"];
    const rows = paymentsList.map(p => [
      p.id, p.member, p.seettu, `₹${formatIndianCurrency(p.paid || p.dueAmount)}`, p.paymentMethod || 'N/A', p.status
    ]);
    const metrics = [
      { label: "Total Collected", value: `₹${formatIndianCurrency(totalCollected)}` },
      { label: "Pending Amount", value: `₹${formatIndianCurrency(totalPending)}` },
      { label: "Active Schemes", value: activeSchemesCount.toString() },
      { label: "Active Members", value: activeMembersCount.toString() },
    ];
    printPDFReport("Dashboard Summary Report", "Jai Sri Amman Finance", headers, rows, metrics);
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Top Header Bar matching Dashboard Template Style */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Welcome back, Admin!
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {COMPANY_DETAILS.name} • Live Financial Management Dashboard
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={() => navigate('/admin/members')} 
            className="btn-primary"
          >
            <Plus className="w-4 h-4" /> Add Member
          </button>

          <button 
            onClick={() => navigate('/admin/reports')} 
            className="btn-secondary"
          >
            <FileText className="w-4 h-4 text-slate-600" /> Financial Reports
          </button>

          <button 
            onClick={handlePrintDashboard}
            className="btn-secondary"
            title="Print Dashboard Summary"
          >
            <Printer className="w-4 h-4 text-slate-600" /> Print
          </button>
        </div>
      </div>

      {/* Main Grid: Left Vibrant Stat Cards Stack & Right Analytics Section (Matching Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: 4 Solid Color Stat Cards Stack (Matching Screenshot Colors) */}
        <div className="space-y-4">
          
          {/* Card 1: Gold / Amber (Target Pool & Active Schemes) */}
          <div className="p-5 rounded-xl stat-card-gold shadow-sm relative overflow-hidden flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-100 mb-1">Active Schemes Target</p>
              <h2 className="text-3xl font-extrabold text-white font-sans tracking-tight">₹{formatIndianCurrency(totalDueTarget)}</h2>
              <div className="inline-flex items-center gap-1 mt-2 text-xs font-semibold bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                <span>{activeSchemesCount} Active Chit Plans</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-black/15 flex items-center justify-center text-white flex-shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Red / Rose (Pending Amount) */}
          <div className="p-5 rounded-xl stat-card-red shadow-sm relative overflow-hidden flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-100 mb-1">Pending Amount</p>
              <h2 className="text-3xl font-extrabold text-white font-sans tracking-tight">₹{formatIndianCurrency(totalPending)}</h2>
              <div className="inline-flex items-center gap-1 mt-2 text-xs font-semibold bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                <span>{paymentsList.filter(p => p.status === 'Pending').length} Pending Installments</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-black/15 flex items-center justify-center text-white flex-shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Royal Blue (Total Members) */}
          <div className="p-5 rounded-xl stat-card-blue shadow-sm relative overflow-hidden flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-100 mb-1">Total Members</p>
              <h2 className="text-3xl font-extrabold text-white font-sans tracking-tight">{membersList.length}</h2>
              <div className="inline-flex items-center gap-1 mt-2 text-xs font-semibold bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                <span>{activeMembersCount} Active Members</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-black/15 flex items-center justify-center text-white flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Emerald Green (Total Collection) */}
          <div className="p-5 rounded-xl stat-card-green shadow-sm relative overflow-hidden flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-100 mb-1">Total Collection</p>
              <h2 className="text-3xl font-extrabold text-white font-sans tracking-tight">₹{formatIndianCurrency(totalCollected)}</h2>
              <div className="inline-flex items-center gap-1 mt-2 text-xs font-semibold bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                <span>All-time Collected</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-black/15 flex items-center justify-center text-white flex-shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Right 2 Columns: Overall Progress & Chit Schemes Summary */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Collection Metrics Summary Box */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Collection Overview Statement</h2>
                <p className="text-xs text-slate-500">Live progress breakdown for active schemes</p>
              </div>

              <button 
                onClick={() => navigate('/admin/reports')}
                className="text-xs font-bold text-[#1E3A8A] hover:underline flex items-center gap-1"
              >
                View Full Reports <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 font-medium uppercase mb-1">Target Total</p>
                <p className="text-xl font-bold text-slate-900 font-sans">₹{formatIndianCurrency(totalDueTarget)}</p>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                <p className="text-xs text-emerald-700 font-semibold uppercase mb-1">Total Collected</p>
                <p className="text-xl font-bold text-emerald-800 font-sans">₹{formatIndianCurrency(totalCollected)}</p>
              </div>

              <div className="p-4 rounded-lg bg-rose-50 border border-rose-100">
                <p className="text-xs text-rose-700 font-semibold uppercase mb-1">Total Pending</p>
                <p className="text-xl font-bold text-rose-800 font-sans">₹{formatIndianCurrency(totalPending)}</p>
              </div>
            </div>

            {/* Collection Progress Bar */}
            <div className="pt-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Overall Collection Completion Rate</span>
                <span className="text-[#1E3A8A]">
                  {totalDueTarget > 0 ? Math.round((totalCollected / totalDueTarget) * 100) : 0}% Completed
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-[#1E3A8A] h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalDueTarget > 0 ? Math.min(100, Math.round((totalCollected / totalDueTarget) * 100)) : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Chit Schemes Quick Summary Table */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Active Chit Groups Summary</h2>
              <button 
                onClick={() => navigate('/admin/chit-groups')}
                className="text-xs font-bold text-[#1E3A8A] hover:underline"
              >
                Manage Chit Groups →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold bg-slate-50">
                    <th className="py-2.5 px-3">Scheme ID</th>
                    <th className="py-2.5 px-3">Scheme Name</th>
                    <th className="py-2.5 px-3">Members</th>
                    <th className="py-2.5 px-3">Rate</th>
                    <th className="py-2.5 px-3">Collected</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {seettuList.length > 0 ? (
                    seettuList.map(scheme => (
                      <tr key={scheme.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-[#1E3A8A]">{scheme.id}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{scheme.name}</td>
                        <td className="py-3 px-3 text-slate-700">{scheme.members} Members</td>
                        <td className="py-3 px-3 font-semibold text-slate-900">₹{formatIndianCurrency(scheme.monthly)}</td>
                        <td className="py-3 px-3 font-bold text-emerald-700 font-sans">₹{formatIndianCurrency(scheme.collected)}</td>
                        <td className="py-3 px-3 text-right">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            scheme.status === 'Active' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}>
                            {scheme.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-500 font-medium">
                        No active chit schemes found. Create your first scheme in Chit Groups.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Section: Recent Transactions Table (Matching Reference Table Layout) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Payment Ledger Transactions</h2>
            <p className="text-xs text-slate-500 font-medium">Real-time payment history records</p>
          </div>

          <button 
            onClick={() => navigate('/admin/payments')}
            className="btn-secondary text-xs"
          >
            View All Payments
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 uppercase tracking-wider text-slate-500 font-semibold bg-slate-50">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Seettu Scheme</th>
                <th className="py-3 px-4">Due Amount</th>
                <th className="py-3 px-4">Paid Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {paymentsList.length > 0 ? (
                paymentsList.slice(0, 5).map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-[#1E3A8A]">{tx.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{tx.member}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">{tx.seettu}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 font-sans">₹{formatIndianCurrency(tx.dueAmount)}</td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-700 font-sans">₹{formatIndianCurrency(tx.paid)}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">{tx.paymentMethod || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-right">
                      {tx.status === "Paid" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3" /> Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-md">
                          <AlertCircle className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                    <div className="space-y-2">
                      <CreditCard className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="font-bold text-slate-900 text-sm">No Payment Transactions Recorded</p>
                      <p className="text-xs text-slate-500">Payment entries will appear here automatically when members pay installments.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
