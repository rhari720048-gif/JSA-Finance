import React from 'react';
import { ArrowRight, PhoneCall, ShieldCheck, Sparkles } from 'lucide-react';
import { COMPANY_DETAILS } from '../config/constants';

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden py-20 lg:py-32 bg-[#FAFAFC]">
      {/* Ambient Light Blurs */}
      <div className="absolute top-10 right-10 w-[35rem] h-[35rem] bg-[#1E3A8A]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1 space-y-8 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-pill text-[#1E3A8A] font-semibold text-sm border border-[#1E3A8A]/20 shadow-xs">
              <Sparkles className="w-4 h-4 text-[#D97706]" />
              <span>Trusted by over {COMPANY_DETAILS.happyMembers} happy families</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl leading-tight font-bold text-slate-900">
              Save Today for a <br />
              <span className="text-[#1E3A8A] italic">Secure Tomorrow</span>.
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Empower your family financial future with our transparent chit savings plans. Enjoy 100% digital receipts, flexible installment options, and guaranteed maturity payouts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
              <a href="#plans" className="btn-primary">
                Explore Schemes <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#contact" className="btn-secondary">
                <PhoneCall className="w-5 h-5 text-[#1E3A8A]" /> Contact Us
              </a>
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg lg:max-w-none z-10">
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-tr from-[#1E3A8A]/15 via-blue-500/10 to-amber-200/30 rounded-[2.5rem] blur-lg opacity-70"></div>
              
              <div className="relative glass-card p-3.5 rounded-[2.5rem] border border-slate-200 shadow-2xl bg-white">
                <img 
                  src="/hero_finance.png" 
                  alt="Family Wealth Planning" 
                  className="rounded-[2rem] w-full h-auto object-cover aspect-[4/3] border border-slate-200 shadow-sm"
                />
                
                {/* Floating trust badge */}
                <div className="absolute -bottom-6 -left-6 glass-card p-5 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-4 bg-white">
                  <div className="bg-emerald-100 border border-emerald-200 p-3 rounded-xl text-emerald-700">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Success Rate</p>
                    <p className="font-bold text-[#1E3A8A] text-2xl">100%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
