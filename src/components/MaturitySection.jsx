import React from 'react';
import { Gift, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function MaturitySection() {
  return (
    <section className="py-24 relative bg-[#FAFAFC] overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-card rounded-[3rem] border border-slate-200 overflow-hidden shadow-2xl bg-white">
          <div className="grid lg:grid-cols-2">
            
            <div className="p-10 lg:p-16 flex flex-col justify-center bg-[#1E3A8A] text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-amber-300 font-medium text-sm mb-6 self-start border border-white/20 backdrop-blur-md">
                <Gift className="w-4 h-4 text-amber-400" /> Maturity & Bonus Rewards
              </div>
              
              <h2 className="text-3xl md:text-5xl text-white mb-6 font-bold">
                Celebrate Your Savings Payout!
              </h2>
              
              <p className="text-xl text-slate-200 leading-relaxed mb-8 font-light">
                Upon successfully completing your chit plan, receive your full accumulated maturity corpus immediately. We also honor timely members with exclusive gifts and bonuses.
              </p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-100 text-base">Guaranteed corpus and total maturity payout</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-100 text-base">Special gifts for members with zero late payments</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-100 text-base">Priority access for upcoming premium chit groups</span>
                </li>
              </ul>
              
              <a href="#contact" className="btn-secondary w-fit text-[#1E3A8A] bg-white hover:bg-slate-100 border-white font-bold text-sm">
                View Reward Eligibility
              </a>
            </div>
            
            <div className="relative min-h-[400px] lg:min-h-full flex items-center justify-center p-8 bg-gradient-to-br from-[#1E3A8A]/5 to-slate-100">
              <div className="relative z-10 w-full max-w-sm">
                <div className="glass-card p-8 rounded-3xl shadow-xl text-center border border-slate-200 transform rotate-2 hover:rotate-0 transition-transform duration-500 bg-white">
                  <div className="w-20 h-20 bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <TrendingUp className="w-10 h-10 text-[#1E3A8A]" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 font-serif">Guaranteed Payout</h3>
                  <p className="text-slate-600 mb-6 font-normal">Your financial discipline earns guaranteed maturity corpus as promised.</p>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <div className="h-full bg-[#1E3A8A] w-full rounded-full shadow-sm"></div>
                  </div>
                  <p className="text-xs text-[#1E3A8A] mt-3 font-bold uppercase tracking-wider">100% Completion Payout</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
