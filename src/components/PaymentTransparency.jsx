import React from 'react';
import { Smartphone, Receipt, ShieldCheck, CheckCircle } from 'lucide-react';

export default function PaymentTransparency() {
  return (
    <section className="py-24 relative bg-[#FAFAFC] overflow-hidden border-t border-slate-200">
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-10 w-[30rem] h-[30rem] bg-[#1E3A8A]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl text-slate-900 font-bold">100% Digital Transparency</h2>
            <p className="text-xl text-slate-600 leading-relaxed font-normal">
              Transparency is our core foundation. Every installment paid is logged immediately into your member portal with instant SMS/Email notifications and downloadable receipts.
            </p>
            
            <div className="space-y-6 pt-4">
              <div className="glass-card p-5 rounded-2xl border border-slate-200 flex items-start gap-4 hover:border-[#1E3A8A]/40 transition-colors bg-white shadow-xs">
                <div className="bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 p-3.5 rounded-xl text-[#1E3A8A] mt-1">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1 text-slate-900">Instant SMS & Email Alert</h4>
                  <p className="text-slate-600 font-normal">Receive immediate payment confirmation alerts to your registered mobile number and email address.</p>
                </div>
              </div>
              
              <div className="glass-card p-5 rounded-2xl border border-slate-200 flex items-start gap-4 hover:border-[#1E3A8A]/40 transition-colors bg-white shadow-xs">
                <div className="bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 p-3.5 rounded-xl text-[#1E3A8A] mt-1">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1 text-slate-900">Digital PDF Receipts</h4>
                  <p className="text-slate-600 font-normal">Download official digital PDF receipts for every installment anytime through your online account portal.</p>
                </div>
              </div>
              
              <div className="glass-card p-5 rounded-2xl border border-slate-200 flex items-start gap-4 hover:border-[#1E3A8A]/40 transition-colors bg-white shadow-xs">
                <div className="bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 p-3.5 rounded-xl text-[#1E3A8A] mt-1">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1 text-slate-900">Secure Online Ledger</h4>
                  <p className="text-slate-600 font-normal">Your complete financial history is encrypted and securely managed with real-time balance tracking.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Glass Receipt Card */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#1E3A8A]/15 via-blue-500/10 to-amber-200/30 rounded-[2.5rem] blur-xl opacity-70"></div>
            
            <div className="glass-card p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl bg-white">
              <div className="flex justify-between items-center border-b border-slate-200 pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                  <h4 className="font-bold text-xl text-slate-900">Latest Live Transaction</h4>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3.5 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Success
                </span>
              </div>
              
              <div className="space-y-5 text-[#1E293B]">
                <div className="flex justify-between text-base">
                  <span className="text-slate-500">Receipt No:</span>
                  <span className="font-mono text-[#1E3A8A] font-bold">JSA-2026-892</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-slate-500">Member Name:</span>
                  <span className="font-bold text-slate-900">Raj Kumar M</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-slate-500">Selected Scheme:</span>
                  <span className="font-semibold text-slate-800">Monthly Savings Plan</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="text-3xl font-bold text-[#1E3A8A] font-sans">₹5,000</span>
                </div>
                <div className="flex justify-between text-base pt-3 border-t border-slate-100">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="font-semibold text-slate-700">Today, 10:45 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
