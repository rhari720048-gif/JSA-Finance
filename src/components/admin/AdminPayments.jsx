import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Receipt, 
  X, 
  ArrowUpRight, 
  Wallet, 
  Clock, 
  DollarSign,
  Edit3,
  Trash2,
  Plus
} from 'lucide-react';

import { useSeettu } from '../../context/SeettuContext';
import { formatIndianCurrency } from '../../utils/formatCurrency';

export default function AdminPayments() {
  const { paymentsList, markPaymentAsPaid, updatePayment, deletePayment, seettuList } = useSeettu();

  // Filter States requested by user: Seettu | Month | Status | Member
  const [selectedSeettuFilter, setSelectedSeettuFilter] = useState('All');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  const [payModalItem, setPayModalItem] = useState(null);
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [amountPaid, setAmountPaid] = useState('');

  // Edit & Delete Modal States
  const [editingPayment, setEditingPayment] = useState(null);
  const [deletingPayment, setDeletingPayment] = useState(null);

  const confirmMarkAsPaid = () => {
    if (!payModalItem) return;
    const finalAmount = amountPaid ? Number(amountPaid) : payModalItem.balance;
    markPaymentAsPaid(payModalItem.id, paymentMode, finalAmount);
    setPayModalItem(null);
    setAmountPaid('');
  };

  // Handle Edit Payment Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingPayment) return;

    const due = Number(editingPayment.dueAmount);
    const paid = Number(editingPayment.paid);
    const balance = Math.max(0, due - paid);
    let status = "Pending";
    if (paid >= due) status = "Paid";
    else if (paid > 0) status = "Partial";

    const updated = {
      ...editingPayment,
      dueAmount: due,
      paid: paid,
      balance: balance,
      status: status
    };

    updatePayment(updated);
    setEditingPayment(null);
  };

  // Handle Delete Payment Confirm
  const handleDeleteConfirm = () => {
    if (!deletingPayment) return;
    deletePayment(deletingPayment.id);
    setDeletingPayment(null);
  };

  // Filter Logic: Seettu | Month | Status | Member
  const filteredPayments = paymentsList.filter(item => {
    const matchesSeettu = selectedSeettuFilter === 'All' || item.seettu === selectedSeettuFilter;
    const matchesMonth = selectedMonthFilter === 'All' || item.month === selectedMonthFilter;
    const matchesStatus = selectedStatusFilter === 'All' || item.status === selectedStatusFilter;
    const matchesMember = item.member.toLowerCase().includes(memberSearchQuery.toLowerCase()) || 
                          item.memberId.toLowerCase().includes(memberSearchQuery.toLowerCase());

    return matchesSeettu && matchesMonth && matchesStatus && matchesMember;
  });

  // Calculate Metrics
  const totalDue = filteredPayments.reduce((acc, curr) => acc + (curr.dueAmount || 0), 0);
  const totalPaid = filteredPayments.reduce((acc, curr) => acc + (curr.paid || 0), 0);
  const totalBalance = filteredPayments.reduce((acc, curr) => acc + (curr.balance || 0), 0);

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-xl bg-white/90 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#1E3A8A]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-[#1E3A8A] text-xs font-semibold uppercase tracking-wider mb-3">
              <CreditCard className="w-3.5 h-3.5 text-[#D97706]" /> Main Payments Ledger
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 mb-2">
              Payments & Collections
            </h1>
            <p className="text-slate-600 font-normal">
              Manage installments, track due amounts vs paid collections, and mark payments as paid with automatic receipts & email notifications.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-xl shadow-lg">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 font-serif">Total Due Amount</p>
          <h3 className="text-3xl font-extrabold text-slate-900 font-sans">₹{formatIndianCurrency(totalDue)}</h3>
          <p className="text-xs text-slate-500 mt-1">Filtered cycle target</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-emerald-200 bg-emerald-50/50 backdrop-blur-xl shadow-lg">
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 font-serif">Total Paid Collected</p>
          <h3 className="text-3xl font-extrabold text-emerald-700 font-sans">₹{formatIndianCurrency(totalPaid)}</h3>
          <p className="text-xs text-emerald-700 mt-1">Collected successfully</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-rose-200 bg-rose-50/50 backdrop-blur-xl shadow-lg">
          <p className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-1 font-serif">Pending Balance</p>
          <h3 className="text-3xl font-extrabold text-rose-600 font-sans">₹{formatIndianCurrency(totalBalance)}</h3>
          <p className="text-xs text-rose-700 mt-1">Overdue / Outstanding</p>
        </div>
      </div>

      {/* 4 Filters requested by User: Seettu | Month | Status | Member */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-xl shadow-md">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
          <Filter className="w-4 h-4 text-[#1E3A8A]" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-serif">Filters Ledger</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Seettu Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Seettu Scheme</label>
            <select
              value={selectedSeettuFilter}
              onChange={(e) => setSelectedSeettuFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm focus:border-[#1E3A8A]"
            >
              <option value="All">All Seettu Schemes</option>
              {seettuList.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* 2. Month Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Cycle Month</label>
            <select
              value={selectedMonthFilter}
              onChange={(e) => setSelectedMonthFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm focus:border-[#1E3A8A]"
            >
              <option value="All">All Months</option>
              <option value="August 2026">August 2026</option>
              <option value="July 2026">July 2026</option>
              <option value="June 2026">June 2026</option>
            </select>
          </div>

          {/* 3. Status Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Payment Status</label>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm focus:border-[#1E3A8A]"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
            </select>
          </div>

          {/* 4. Member Search Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Search Member</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                placeholder="Name or ID..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-sm focus:border-[#1E3A8A]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Payments Table */}
      <div className="glass-card p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-xl bg-white/90 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold font-serif text-slate-900">Installments & Payment Ledger</h2>
            <p className="text-xs text-slate-500 font-medium">Click "Mark as Paid" or edit/delete entries below</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold bg-slate-50/50">
                <th className="py-3.5 px-4 rounded-l-xl">Member</th>
                <th className="py-3.5 px-4">Seettu Scheme</th>
                <th className="py-3.5 px-4">Due Amount</th>
                <th className="py-3.5 px-4">Paid</th>
                <th className="py-3.5 px-4">Balance</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Member */}
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900">{item.member}</p>
                    <p className="text-xs font-mono text-slate-400">{item.memberId}</p>
                  </td>

                  {/* Seettu */}
                  <td className="py-4 px-4">
                    <p className="font-semibold text-slate-800 text-xs">{item.seettu}</p>
                    <p className="text-[11px] text-slate-400">{item.month}</p>
                  </td>

                  {/* Due Amount */}
                  <td className="py-4 px-4 font-bold text-slate-900 font-sans">
                    ₹{formatIndianCurrency(item.dueAmount)}
                  </td>

                  {/* Paid */}
                  <td className="py-4 px-4 font-bold text-emerald-700 font-sans">
                    ₹{formatIndianCurrency(item.paid)}
                  </td>

                  {/* Balance */}
                  <td className="py-4 px-4 font-bold text-rose-600 font-sans">
                    ₹{formatIndianCurrency(item.balance)}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    {item.status === 'Paid' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                      </span>
                    )}
                    {item.status === 'Pending' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-rose-100 text-rose-800 px-3 py-1 rounded-full border border-rose-200">
                        <AlertCircle className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                    {item.status === 'Partial' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
                        <Clock className="w-3.5 h-3.5" /> Partial
                      </span>
                    )}
                  </td>

                  {/* Action: Mark as Paid, Edit, Delete Buttons */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {item.status !== 'Paid' ? (
                        <button
                          onClick={() => {
                            setPayModalItem(item);
                            setAmountPaid(item.balance || item.dueAmount);
                          }}
                          className="btn-primary py-1.5 px-3 text-xs font-bold shadow-sm"
                        >
                          Mark as Paid
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
                          <Receipt className="w-3.5 h-3.5 text-[#1E3A8A]" /> {item.receiptNo}
                        </div>
                      )}

                      <button
                        onClick={() => setEditingPayment(item)}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-200 transition-colors"
                        title="Edit Payment"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeletingPayment(item)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                        title="Delete Payment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 text-[#1E3A8A] rounded-xl flex items-center justify-center mx-auto">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-slate-900 text-base">No Payment Entries Found</p>
                  </div>
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mark as Paid Confirmation Modal */}
      {payModalItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl bg-white/95 backdrop-blur-2xl relative">
            <button 
              onClick={() => setPayModalItem(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#1E3A8A]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold font-serif text-slate-900 text-center mb-1">Confirm Payment</h2>
            <p className="text-xs text-slate-500 text-center mb-6">Mark payment as paid for member installment.</p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500">Member:</span>
                <span className="font-bold text-slate-900">{payModalItem.member}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Seettu Scheme:</span>
                <span className="font-semibold text-slate-800 text-xs">{payModalItem.seettu}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-500">Due Amount:</span>
                <span className="font-extrabold text-[#1E3A8A] text-base">₹{formatIndianCurrency(payModalItem.balance)}</span>
              </div>
            </div>

            {/* Custom Paid Amount Input */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Amount Paid (₹)</label>
              <input 
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-bold focus:border-[#1E3A8A]"
                placeholder="Enter amount paid"
              />
            </div>

            {/* Payment Mode Selection */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {['UPI', 'Cash', 'GPay'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      paymentMode === mode 
                        ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-sm' 
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setPayModalItem(null)}
                className="w-1/2 btn-secondary py-3 text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={confirmMarkAsPaid}
                className="w-1/2 btn-primary py-3 text-sm font-bold"
              >
                Mark as Paid & Send Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Payment Modal */}
      {editingPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl bg-white/95 backdrop-blur-2xl relative">
            <button 
              onClick={() => setEditingPayment(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-stone-100 text-stone-500 hover:text-stone-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold font-serif text-stone-900 mb-1">Edit Payment Entry</h2>
            <p className="text-xs text-stone-500 mb-6">Modify payment installment details for {editingPayment.member}.</p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Member Name</label>
                  <input 
                    type="text"
                    required
                    value={editingPayment.member}
                    onChange={(e) => setEditingPayment({ ...editingPayment, member: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-900 text-sm focus:border-[#7C2D12]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Seettu Scheme</label>
                  <input 
                    type="text"
                    required
                    value={editingPayment.seettu}
                    onChange={(e) => setEditingPayment({ ...editingPayment, seettu: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-900 text-sm focus:border-[#7C2D12]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Due Amount (₹)</label>
                  <input 
                    type="number"
                    required
                    value={editingPayment.dueAmount}
                    onChange={(e) => setEditingPayment({ ...editingPayment, dueAmount: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-900 text-sm focus:border-[#7C2D12]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Paid Amount (₹)</label>
                  <input 
                    type="number"
                    required
                    value={editingPayment.paid}
                    onChange={(e) => setEditingPayment({ ...editingPayment, paid: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-900 text-sm focus:border-[#7C2D12]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Payment Method</label>
                  <select 
                    value={editingPayment.paymentMethod}
                    onChange={(e) => setEditingPayment({ ...editingPayment, paymentMethod: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-900 text-sm focus:border-[#7C2D12]"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="GPay">GPay</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Receipt No</label>
                  <input 
                    type="text"
                    value={editingPayment.receiptNo}
                    onChange={(e) => setEditingPayment({ ...editingPayment, receiptNo: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-900 text-sm focus:border-[#7C2D12]"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setEditingPayment(null)}
                  className="w-1/2 btn-secondary py-3 text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 btn-primary py-3 text-sm"
                >
                  Update Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Payment Confirmation Modal */}
      {deletingPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-[2.5rem] border border-white/90 shadow-2xl bg-white/95 backdrop-blur-2xl relative text-center">
            <button 
              onClick={() => setDeletingPayment(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-stone-100 text-stone-500 hover:text-stone-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-rose-100 border border-rose-200 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold font-serif text-stone-900 mb-2">Delete Payment Record?</h2>
            <p className="text-xs text-stone-500 mb-6 leading-relaxed">
              Are you sure you want to delete payment record for <span className="font-bold text-stone-900">"{deletingPayment.member}"</span> ({deletingPayment.seettu})?
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setDeletingPayment(null)}
                className="w-1/2 btn-secondary py-3 text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="w-1/2 py-3 text-sm font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700 shadow-md transition-colors"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
