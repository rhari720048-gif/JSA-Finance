import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  ArrowLeft,
  X
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Chit Groups', path: '/admin/chit-groups', icon: Briefcase },
    { name: 'Members', path: '/admin/members', icon: Users },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Clean Blue & White Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#EBEEF5] border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Official JSA Logo Header */}
        <div className="p-4 pt-6 flex items-center justify-between border-b border-slate-200/80 bg-white/70">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Jai Sri Amman Finance Logo" className="h-12 w-auto object-contain" />
          </div>

          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 text-slate-500 hover:text-slate-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar Navigation Section */}
        <div className="flex-1 px-4 py-6 overflow-y-auto space-y-6">
          <div>
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider px-3 mb-3 font-serif">
              Navigation
            </p>
            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-base transition-all duration-200 ${
                        isActive
                          ? 'bg-[#1E3A8A] text-white shadow-md'
                          : 'text-[#334155] hover:bg-white hover:text-[#1E3A8A]'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Action: Return to Website */}
        <div className="p-4 border-t border-slate-200 bg-white/50">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-bold text-[#1E3A8A] bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Website</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
