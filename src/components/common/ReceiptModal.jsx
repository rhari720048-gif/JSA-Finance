import React from 'react';
import { CheckCircle2, FileText, Mail, Printer, X, ShieldCheck } from 'lucide-react';
import { useSeettu } from '../../context/SeettuContext';
import { formatIndianCurrency } from '../../utils/formatCurrency';
import { printPDFReport } from '../../utils/exportUtils';
import logoImg from '../../assets/logo.png';

export default function ReceiptModal() {
  const { currentReceipt, setCurrentReceipt } = useSeettu();

  if (!currentReceipt) return null;

  const handlePrintReceipt = () => {
    const headers = ["Receipt No", "Member Name", "Seettu Scheme", "Paid Amount", "Date & Time", "Payment Method", "Status"];
    const rows = [
      [
        currentReceipt.receiptNo,
        currentReceipt.memberName,
        currentReceipt.seettuName,
        `₹${formatIndianCurrency(currentReceipt.amount)}`,
        currentReceipt.date,
        currentReceipt.method,
        currentReceipt.status
      ]
    ];
    const metrics = [
      { label: "Receipt No", value: currentReceipt.receiptNo },
      { label: "Member Name", value: currentReceipt.memberName },
      { label: "Amount Paid", value: `₹${formatIndianCurrency(currentReceipt.amount)}` },
      { label: "Email Sent To", value: currentReceipt.memberEmail }
    ];

    printPDFReport(`Payment Receipt - ${currentReceipt.receiptNo}`, "Jai Sri Amman Finance", headers, rows, metrics);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button 
          onClick={() => setCurrentReceipt(null)}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Company Logo & Success Header Icon */}
        <div className="text-center mb-4">
          <img src={logoImg} alt="Jai Sri Amman Finance Logo" className="h-12 mx-auto object-contain mb-3 rounded-xl shadow-sm" />
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 border-4 border-emerald-50">
            <CheckCircle2 className="w-8 h-8" />
          </div>
        </div>

        <div className="text-center space-y-1 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Payment Success!</h2>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Official Payment Receipt Issued</p>
        </div>

        {/* Email Notification Sent Alert Banner */}
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 font-semibold mb-6">
          <Mail className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span>Receipt PDF & Email Confirmation sent to <span className="font-bold text-emerald-950">{currentReceipt.memberEmail}</span></span>
        </div>

        {/* Receipt Details Card */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs mb-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-semibold">Receipt Number</span>
            <span className="font-mono font-bold text-[#1E3A8A] text-sm">{currentReceipt.receiptNo}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-semibold">Member Name</span>
            <span className="font-bold text-slate-900 text-sm">{currentReceipt.memberName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-semibold">Seettu Scheme</span>
            <span className="font-bold text-slate-800">{currentReceipt.seettuName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-semibold">Payment Mode</span>
            <span className="font-bold text-slate-800">{currentReceipt.method}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-semibold">Date & Time</span>
            <span className="font-semibold text-slate-700">{currentReceipt.date}</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-200">
            <span className="text-slate-700 font-bold text-sm">Total Paid</span>
            <span className="font-extrabold text-[#1E3A8A] text-lg font-sans">₹{formatIndianCurrency(currentReceipt.amount)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrintReceipt}
            className="flex-1 btn-primary py-3 text-xs font-bold flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" /> Download PDF Receipt
          </button>
          
          <button 
            onClick={() => setCurrentReceipt(null)}
            className="btn-secondary py-3 text-xs font-bold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
