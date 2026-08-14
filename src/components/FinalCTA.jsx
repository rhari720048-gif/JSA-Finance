import React from 'react';
import { ArrowRight, Landmark } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="relative py-24 bg-[#FAFAFC] overflow-hidden border-t border-slate-200">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-[45rem] bg-[#1E3A8A]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="glass-card p-12 md:p-16 rounded-[3rem] border border-slate-200 shadow-2xl bg-white relative overflow-hidden">
          
          <div className="bg-[#1E3A8A] border border-[#1E3A8A] w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-md text-white">
            <Landmark className="w-10 h-10" />
          </div>
          
          <h2 className="text-4xl md:text-6xl text-slate-900 mb-6 font-bold">
            Ready to Secure Your Family Future?
          </h2>
          
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
            Join hundreds of families building wealth through transparent, disciplined chit savings plans with guaranteed maturity payouts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <a href="#plans" className="btn-primary text-base px-8 py-4">
              Explore Schemes <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#contact" className="btn-secondary text-base px-8 py-4">
              Speak to an Advisor
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
