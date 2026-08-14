import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, UserCheck } from 'lucide-react';
import { useSeettu } from '../context/SeettuContext';
import MemberPortalModal from './common/MemberPortalModal';
import logoImg from '../assets/logo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const { activeMember } = useSeettu();

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

              {/* Only Member Login / Dashboard Button is shown on Website */}
              {activeMember ? (
                <Link 
                  to="/member/dashboard"
                  className="btn-primary py-2.5 px-5 text-xs font-bold shadow-xs flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800"
                >
                  <UserCheck className="w-4 h-4" /> {activeMember.name} (My Dashboard)
                </Link>
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
              {activeMember ? (
                <Link 
                  to="/member/dashboard"
                  className="btn-primary py-1.5 px-3 text-xs font-bold flex items-center gap-1.5 bg-emerald-700"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Dashboard
                </Link>
              ) : (
                <button 
                  onClick={() => setIsMemberModalOpen(true)}
                  className="btn-primary py-1.5 px-3 text-xs font-bold flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Login
                </button>
              )}

              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-slate-700 hover:text-[#1E3A8A] font-bold text-base py-2 transition-colors"
              >
                {link.name}
              </a>
            ))}

            {activeMember ? (
              <Link 
                to="/member/dashboard"
                onClick={() => setIsOpen(false)}
                className="w-full btn-primary py-3 text-xs font-bold text-center block bg-emerald-700"
              >
                Go to My Member Dashboard ({activeMember.name})
              </Link>
            ) : (
              <button 
                onClick={() => { setIsOpen(false); setIsMemberModalOpen(true); }}
                className="w-full btn-primary py-3 text-xs font-bold text-center block"
              >
                Member Portal Login
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Interactive Member Portal Modal */}
      <MemberPortalModal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} />
    </>
  );
}
