import React from 'react';
import { Sparkles, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ComingSoonPage({ title, icon: Icon, description }) {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="glass-card max-w-xl w-full p-8 sm:p-12 text-center rounded-[2.5rem] border border-slate-200 shadow-2xl bg-white relative overflow-hidden">
        {/* Subtle Navy Glow background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1E3A8A]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-24 h-24 bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner text-[#1E3A8A]">
          {Icon ? <Icon className="w-12 h-12" /> : <Sparkles className="w-12 h-12" />}
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill text-[#1E3A8A] font-semibold text-xs uppercase tracking-wider mb-4 border border-[#1E3A8A]/20">
          <Clock className="w-3.5 h-3.5 text-[#D97706]" /> Coming Soon
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
          {title || 'Under Development'}
        </h2>

        <p className="text-slate-600 text-base leading-relaxed mb-8 font-normal max-w-md mx-auto">
          {description || 'This module is currently under active development. New features and management tools will be available soon.'}
        </p>

        {/* Progress indicator */}
        <div className="w-full bg-slate-100 rounded-full h-3 mb-8 p-0.5 border border-slate-200 overflow-hidden max-w-xs mx-auto">
          <div className="bg-[#1E3A8A] h-full rounded-full w-2/3 shadow-xs animate-pulse"></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/admin/dashboard" className="btn-primary text-sm font-bold px-6 py-3">
            Go to Dashboard
          </Link>
          <Link to="/" className="btn-secondary text-sm font-bold px-6 py-3">
            <ArrowLeft className="w-4 h-4 text-[#1E3A8A]" /> Return to Website
          </Link>
        </div>
      </div>
    </div>
  );
}
