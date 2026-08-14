import React from 'react';
import { Users, ShieldCheck, Clock, Award } from 'lucide-react';
import { COMPANY_DETAILS } from '../config/constants';

export default function TrustStats() {
  const stats = [
    { icon: <Clock className="w-9 h-9 text-[#1E3A8A]" />, value: COMPANY_DETAILS.experienceYears, label: "Years of Trust" },
    { icon: <Users className="w-9 h-9 text-[#1E3A8A]" />, value: COMPANY_DETAILS.happyMembers, label: "Active Members" },
    { icon: <Award className="w-9 h-9 text-[#1E3A8A]" />, value: COMPANY_DETAILS.completedSeettus, label: "Completed Chit Schemes" },
    { icon: <ShieldCheck className="w-9 h-9 text-[#1E3A8A]" />, value: COMPANY_DETAILS.paymentTransparency, label: "Payment Transparency" }
  ];

  return (
    <section className="py-16 relative bg-[#FAFAFC] border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="glass-card glass-card-hover p-6 text-center flex flex-col items-center border border-slate-200 rounded-2xl relative overflow-hidden group bg-white shadow-xs"
            >
              <div className="mb-4 p-4 rounded-2xl bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1 font-sans">{stat.value}</h3>
              <p className="text-slate-600 font-medium text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
