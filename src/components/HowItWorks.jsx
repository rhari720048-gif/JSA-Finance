import React from 'react';
import { HOW_IT_WORKS } from '../config/constants';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative bg-[#FAFAFC] overflow-hidden border-t border-slate-200">
      {/* Background Soft Glow */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#1E3A8A]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl mb-6 font-bold text-slate-900">How It Works</h2>
          <p className="text-xl text-slate-600 font-normal">
            Five simple steps from choosing your scheme to receiving your guaranteed maturity payout.
          </p>
        </div>

        <div className="relative">
          {/* Vertical connecting line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1E3A8A]/30 via-slate-300 to-[#1E3A8A]/30 -translate-x-1/2 rounded-full"></div>
          
          <div className="space-y-10 md:space-y-12 relative z-10">
            {HOW_IT_WORKS.map((item, index) => (
              <div key={index} className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                
                {/* Content Side */}
                <div className={`flex-1 w-full ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="glass-card glass-card-hover p-8 rounded-3xl border border-slate-200 relative overflow-hidden group bg-white shadow-lg">
                    {/* Watermark Number */}
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-5 text-[120px] font-black font-sans pointer-events-none text-slate-900 group-hover:opacity-10 transition-opacity duration-500">
                      {item.step}
                    </div>
                    
                    {/* Mobile Step Badge */}
                    <div className="md:hidden inline-block px-3 py-1 glass-pill text-[#1E3A8A] text-xs font-bold rounded-lg mb-4 border border-[#1E3A8A]/30">
                      Step {item.step}
                    </div>
                    
                    <h3 className="text-2xl mb-3 font-bold text-slate-900 relative z-10">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-base relative z-10 font-normal">{item.desc}</p>
                  </div>
                </div>
                
                {/* Center Node (Desktop Only) */}
                <div className="hidden md:flex flex-shrink-0 w-16 h-16 rounded-full bg-white border-2 border-slate-200 shadow-md items-center justify-center relative z-20">
                  <div className="w-12 h-12 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-lg font-bold font-sans shadow-xs">
                    {item.step}
                  </div>
                </div>
                
                {/* Empty Side */}
                <div className="hidden md:block flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
