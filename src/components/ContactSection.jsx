import React from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { COMPANY_DETAILS } from '../config/constants';

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 relative bg-[#FAFAFC] overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-card rounded-[3rem] border border-slate-200 overflow-hidden shadow-2xl bg-white">
          <div className="grid lg:grid-cols-2">
            
            <div className="p-10 lg:p-16 bg-[#1E3A8A] text-white border-b lg:border-b-0 lg:border-r border-[#1E3A8A]">
              <h2 className="text-3xl md:text-5xl text-white mb-6 font-bold">Get In Touch</h2>
              <p className="text-slate-200 mb-12 text-lg font-light leading-relaxed">
                Have questions about our chit savings schemes? Our financial advisors are ready to assist you in choosing the best plan.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 border border-white/20 p-3.5 rounded-2xl text-amber-400 mt-1">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-200 mb-1 font-sans">Call & WhatsApp</h4>
                    <p className="text-xl font-bold text-white">{COMPANY_DETAILS.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 border border-white/20 p-3.5 rounded-2xl text-amber-400 mt-1">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-200 mb-1 font-sans">Email Address</h4>
                    <p className="text-xl font-bold text-white">{COMPANY_DETAILS.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 border border-white/20 p-3.5 rounded-2xl text-amber-400 mt-1">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-200 mb-1 font-sans">Head Office</h4>
                    <p className="text-lg text-slate-100 font-light">{COMPANY_DETAILS.address}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-10 lg:p-16 bg-white">
              <h3 className="text-2xl font-bold mb-8 text-slate-900">Request Consultation</h3>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Thank you! Our team will contact you shortly."); }}>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-[#1E3A8A] outline-none transition-all shadow-xs"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number</label>
                  <input 
                    type="tel" 
                    required
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-[#1E3A8A] outline-none transition-all shadow-xs"
                    placeholder="Enter mobile number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Scheme</label>
                  <select className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:border-[#1E3A8A] transition-all shadow-xs font-medium text-sm">
                    <option>Weekly Savings Scheme</option>
                    <option>Monthly Savings Scheme</option>
                    <option>General Financial Query</option>
                  </select>
                </div>
                
                <button type="submit" className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" /> Submit Request
                </button>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
