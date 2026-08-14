import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ_DATA } from '../config/constants';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-24 relative bg-[#FAFAFC] overflow-hidden border-t border-slate-200">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-[#1E3A8A]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill text-[#1E3A8A] font-semibold text-sm mb-4 border border-[#1E3A8A]/20">
            <HelpCircle className="w-4 h-4 text-[#D97706]" /> Questions & Answers
          </div>
          <h2 className="text-3xl md:text-5xl mb-6 text-slate-900 font-bold">Frequently Asked Questions</h2>
          <p className="text-xl text-slate-600 font-normal">
            Find answers to common queries regarding our chit schemes, digital ledger, and payouts.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_DATA.map((faq, index) => (
            <div 
              key={index} 
              className={`glass-card overflow-hidden transition-all duration-300 border ${openIndex === index ? 'border-[#1E3A8A] bg-white shadow-md' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
            >
              <button
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className={`text-lg font-bold pr-4 ${openIndex === index ? 'text-[#1E3A8A]' : 'text-slate-900'}`}>
                  {faq.q}
                </span>
                <div className={`p-2 rounded-xl transition-colors ${openIndex === index ? 'bg-[#1E3A8A] text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openIndex === index ? 'transform rotate-180' : ''}`} />
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-6 pt-0 text-slate-600 leading-relaxed text-base border-t border-slate-100 font-normal">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
