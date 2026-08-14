import React from 'react';
import { Building2, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';
import { COMPANY_DETAILS } from '../config/constants';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 relative bg-[#FAFAFC] overflow-hidden border-t border-slate-200">
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 right-10 w-[35rem] h-[35rem] bg-[#1E3A8A]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1 w-full relative z-10 order-2 lg:order-1">
            <div className="relative glass-card p-3.5 rounded-[2.5rem] border border-slate-200 shadow-2xl bg-white">
              <img 
                src="/about_finance.png" 
                alt="About Jai Sri Amman Finance" 
                className="rounded-[2rem] w-full h-auto object-cover border border-slate-200 aspect-square lg:aspect-[4/5]"
              />
              
              {/* Light Glass overlay badge */}
              <div className="absolute bottom-8 right-8 glass-card p-6 rounded-2xl shadow-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-4">
                  <div className="bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 p-3.5 rounded-xl text-[#1E3A8A]">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-900 font-sans">{COMPANY_DETAILS.experienceYears}</p>
                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">Years of Excellence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-8 order-1 lg:order-2">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill text-[#1E3A8A] font-semibold text-sm mb-4 border border-[#1E3A8A]/20">
                <Sparkles className="w-4 h-4 text-[#D97706]" /> Heritage & Trust
              </div>
              <h2 className="text-3xl md:text-5xl mb-6 text-slate-900 font-bold">About Our Company</h2>
              <p className="text-xl text-slate-600 leading-relaxed font-normal">
                For over {COMPANY_DETAILS.experienceYears} years, {COMPANY_DETAILS.name} has been a cornerstone of financial security for families in Madurai. Our core mission is empowering members through transparent, disciplined chit savings.
              </p>
            </div>
            
            <div className="space-y-6 pt-4">
              <div className="glass-card p-5 rounded-2xl border border-slate-200 flex items-start gap-4 hover:border-[#1E3A8A]/40 transition-colors bg-white shadow-xs">
                <div className="p-3 bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 rounded-xl text-[#1E3A8A] mt-1">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-1">Guaranteed Capital Security</h4>
                  <p className="text-slate-600 leading-relaxed font-normal">Your hard-earned savings are managed with strict internal auditing and financial safeguards.</p>
                </div>
              </div>
              
              <div className="glass-card p-5 rounded-2xl border border-slate-200 flex items-start gap-4 hover:border-[#1E3A8A]/40 transition-colors bg-white shadow-xs">
                <div className="p-3 bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 rounded-xl text-[#1E3A8A] mt-1">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-1">Member-First Relationship</h4>
                  <p className="text-slate-600 leading-relaxed font-normal">We build lasting relationships with prompt customer service and transparent ledger statements.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
