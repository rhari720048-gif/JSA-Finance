import React from 'react';
import { Calendar, CalendarCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { SEETTU_PLANS } from '../config/constants';

export default function SeettuPlans() {
  return (
    <section id="plans" className="py-24 relative bg-[#FAFAFC] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-[#1E3A8A]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill text-[#1E3A8A] font-semibold text-sm mb-4 border border-[#1E3A8A]/20">
            <Sparkles className="w-4 h-4 text-[#D97706]" /> Savings Opportunities
          </div>
          <h2 className="text-3xl md:text-5xl mb-6 text-slate-900 font-bold">Transparent Chit Schemes</h2>
          <p className="text-xl text-slate-600 font-normal">
            Select a weekly or monthly chit savings plan tailored to your income and financial goals with 100% digital receipts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {SEETTU_PLANS.map((plan, index) => (
            <div 
              key={plan.id} 
              className="glass-card glass-card-hover p-8 md:p-10 flex flex-col h-full border border-slate-200 relative overflow-hidden rounded-3xl group bg-white shadow-lg"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#1E3A8A]"></div>

              <div className="flex items-center gap-5 mb-8">
                <div className="p-4 bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 rounded-2xl text-[#1E3A8A] group-hover:scale-105 transition-transform duration-300">
                  {index === 0 ? <Calendar className="w-8 h-8" /> : <CalendarCheck className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{plan.title}</h3>
              </div>
              
              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed text-base font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <a href="#contact" className="w-full btn-primary mt-auto text-center">
                Enroll in Scheme
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
