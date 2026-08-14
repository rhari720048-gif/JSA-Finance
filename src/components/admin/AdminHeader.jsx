import React from 'react';
import { Menu, Bell, Search, Globe, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminHeader({ setIsSidebarOpen, activeTitle, onLogout }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900">{activeTitle || 'Admin Dashboard'}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 w-56">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search dashboard..." 
            className="bg-transparent outline-none text-xs w-full text-slate-800 placeholder-slate-400" 
            readOnly 
          />
        </div>

        {/* Website Quick Link */}
        <Link 
          to="/" 
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1E3A8A] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors border border-slate-200"
        >
          <Globe className="w-3.5 h-3.5" /> View Public Site
        </Link>

        {/* Notifications Icon */}
        <button className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-[#1E3A8A] relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#D97706] rounded-full"></span>
        </button>

        {/* Admin Profile & Logout */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            A
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">Admin Manager</p>
            <p className="text-[10px] text-[#D97706] font-bold">Administrator</p>
          </div>
          {onLogout && (
            <button 
              onClick={onLogout}
              className="ml-2 p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
              title="Sign Out of Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
