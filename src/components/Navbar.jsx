import React, { useState } from 'react';
import { Menu, X, UserCheck, ShieldCheck } from 'lucide-react';
import { useSeettu } from '../context/SeettuContext';
import MemberPortalModal from './common/MemberPortalModal';
import logoImg from '../assets/logo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const { activeMember, logoutMember } = useSeettu();

  const links = [
    { name: 'Home', href: '#home' },
    { name: 'Schemes', href: '#plans' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <a href="#home" className="flex items-center gap-3">
              <img src={logoImg} alt="Jai Sri Amman Finance Logo" className="h-12 sm:h-14 w-auto object-contain" />
            </a>
            
            <div className="hidden md:flex items-center space-x-6">
              {links.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-slate-700 hover:text-[#1E3A8A] font-bold text-sm transition-all duration-200"
                >
                  {link.name}
                </a>
              ))}

              {/* Only Member Login Button is shown on Website */}
              {activeMember ? (
                <button 
                  onClick={() => setIsMemberModalOpen(true)}
                  className="btn-primary py-2 px-4 text-xs font-bold shadow-xs flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800"
                >
                  <UserCheck className="w-4 h-4" /> {activeMember.name} (My Ledger)
                </button>
              ) : (
                <button 
                  onClick={() => setIsMemberModalOpen(true)}
                  className="btn-primary py-2.5 px-5 text-xs font-bold shadow-xs flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" /> Member Login
                </button>
              )}
            </div>

            <div className="md:hidden flex items-center gap-2">
              <button 
                onClick={() => setIsMemberModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#1E3A8A] text-white text-xs font-bold flex items-center gap-1"
              >
                <UserCheck className="w-3.5 h-3.5" /> Member Login
              </button>

              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-700 hover:text-[#1E3A8A] focus:outline-none p-2 rounded-lg bg-slate-100 border border-slate-200"
              >
                {isOpen ? <X className="h-6 w-6 text-[#1E3A8A]" /> : <Menu className="h-6 w-6 text-slate-700" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-white mx-4 mb-4 border border-slate-200 p-4 shadow-xl rounded-2xl">
            <div className="space-y-1">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:text-[#1E3A8A] hover:bg-slate-100 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Interactive Member Login & Portal Modal */}
      <MemberPortalModal 
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
      />
    </>
  );
}
