import React from 'react';
import { COMPANY_DETAILS } from '../config/constants';
import logoImg from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-slate-300 py-16 border-t border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-slate-800 pb-12">
          
          <div className="md:col-span-1">
            <div className="bg-white p-3 rounded-2xl inline-block mb-6 shadow-md border border-slate-200">
              <img src={logoImg} alt="Jai Sri Amman Finance Logo" className="h-12 w-auto object-contain rounded-xl shadow-sm" />
            </div>
            <p className="text-sm leading-relaxed text-slate-400 font-normal">
              A trusted financial institution dedicated to providing transparent, disciplined, and rewarding chit savings schemes.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Quick Links</h4>
            <ul className="space-y-3.5 text-sm font-medium">
              <li><a href="#home" className="hover:text-amber-400 transition-colors">Home</a></li>
              <li><a href="#plans" className="hover:text-amber-400 transition-colors">Chit Schemes</a></li>
              <li><a href="#how-it-works" className="hover:text-amber-400 transition-colors">How It Works</a></li>
              <li><a href="#about" className="hover:text-amber-400 transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-amber-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Legal & Support</h4>
            <ul className="space-y-3.5 text-sm font-medium">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#faq" className="hover:text-amber-400 transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Contact Details</h4>
            <ul className="space-y-3 text-sm text-slate-400 font-normal">
              <li>{COMPANY_DETAILS.address}</li>
              <li>Phone: {COMPANY_DETAILS.phone}</li>
              <li>Email: {COMPANY_DETAILS.email}</li>
            </ul>
          </div>
          
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-normal">
          <p>&copy; {new Date().getFullYear()} {COMPANY_DETAILS.name}. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Designed with trust and digital transparency.</p>
        </div>
      </div>
    </footer>
  );
}
