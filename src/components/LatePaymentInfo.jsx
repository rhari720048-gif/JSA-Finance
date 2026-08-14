import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';

export default function LatePaymentInfo() {
  return (
    <section className="py-20 bg-[#FAFAFC] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 md:p-10 rounded-3xl border border-rose-200 shadow-lg flex flex-col md:flex-row items-center gap-8 relative overflow-hidden bg-white">
          <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl flex-shrink-0 text-rose-600">
            <AlertCircle className="w-10 h-10" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl mb-3 text-slate-900 font-bold">Installment Due Policy</h3>
            <p className="text-slate-600 leading-relaxed mb-4 font-normal">
              Timely contributions are essential for smooth group payouts. Missed installment dates will temporarily reflect as <span className="font-semibold text-rose-600">"Pending"</span> in your digital ledger until updated upon payment receipt.
            </p>
            <a href="#contact" className="inline-flex items-center gap-2 text-[#1E3A8A] font-bold hover:underline transition-colors text-sm">
              Consult Installment Schedule <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
