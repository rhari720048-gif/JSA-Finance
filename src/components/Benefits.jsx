import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { WHY_CHOOSE_US } from '../config/constants';

export default function Benefits() {
  return (
    <section className="py-24 relative bg-[#FAFAFC] overflow-hidden border-t border-slate-200">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-[#1E3A8A]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill text-[#1E3A8A] font-semibold text-sm mb-4 border border-[#1E3A8A]/20">
            <Sparkles className="w-4 h-4 text-[#D97706]" /> Our Commitment
          </div>
          <h2 className="text-3xl md:text-5xl mb-6 text-slate-900 font-bold">Why Choose Us?</h2>
          <p className="text-xl text-slate-600 font-normal">
            We provide more than just a savings plan — we offer a secure, transparent, and rewarding financial partnership for your family.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WHY_CHOOSE_US.map((benefit, index) => (
            <div 
              key={index} 
              className="glass-card glass-card-hover p-8 rounded-3xl border border-slate-200 relative overflow-hidden group bg-white shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 rounded-2xl text-[#1E3A8A] group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#1E3A8A] transition-colors">{benefit.title}</h3>
              </div>
              <p className="text-slate-600 leading-relaxed font-normal text-base">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
