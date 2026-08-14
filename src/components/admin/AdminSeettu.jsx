import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  Users, 
  Calendar, 
  Coins, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  X, 
  ChevronRight, 
  ArrowLeft,
  Sparkles,
  DollarSign,
  Edit3,
  Trash2,
  FileText,
  FileSpreadsheet
} from 'lucide-react';

import { useSeettu } from '../../context/SeettuContext';
import { formatIndianCurrency } from '../../utils/formatCurrency';
import { exportToCSV, printPDFReport } from '../../utils/exportUtils';

export default function AdminSeettu() {
  const { seettuList, addSeettu, updateSeettu, deleteSeettu } = useSeettu();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'create' | 'active' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeettu, setSelectedSeettu] = useState(null); // When set, renders IN-PAGE detail view
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Edit & Delete Modal States
  const [editingSeettu, setEditingSeettu] = useState(null);
  const [deletingSeettu, setDeletingSeettu] = useState(null);

  // Form State for Creating New Seettu
  const [formData, setFormData] = useState({
    name: '',
    type: 'Monthly',
    members: 25,
    monthly: 2000,
    duration: '10 Months',
    startDate: new Date().toISOString().split('T')[0]
  });

  // Download All Chit Schemes
  const handleExportAllSchemesCSV = () => {
    const headers = ["Scheme ID", "Scheme Name", "Frequency", "Total Members", "Per Member Rate (₹)", "Duration", "Target Total (₹)", "Collected (₹)", "Pending (₹)", "Status"];
    const rows = seettuList.map(s => [
      s.id, s.name, s.type, s.members, s.monthly, s.duration, s.targetTotal, s.collected, s.pending, s.status
    ]);
    exportToCSV("All_Chit_Schemes", headers, rows);
  };

  const handleExportAllSchemesPDF = () => {
    const headers = ["Scheme ID", "Scheme Name", "Type", "Members", "Rate", "Target", "Collected", "Pending", "Status"];
    const rows = seettuList.map(s => [
      s.id, s.name, s.type, s.members, `₹${formatIndianCurrency(s.monthly)}`, `₹${formatIndianCurrency(s.targetTotal)}`, `₹${formatIndianCurrency(s.collected)}`, `₹${formatIndianCurrency(s.pending)}`, s.status
    ]);
    const summary = [
      { label: "Total Chit Schemes", value: seettuList.length.toString() },
      { label: "Active Schemes", value: seettuList.filter(s => s.status === 'Active').length.toString() },
    ];
    printPDFReport("Chit Schemes Summary Statement", "Master Chit Groups Directory", headers, rows, summary);
  };

  // Download Specific Scheme Roster
  const handleExportSchemeRosterCSV = (scheme) => {
    const headers = ["Member ID", "Member Name", "Paid Amount", "Payment Status"];
    const rows = (scheme.membersList || []).map(m => [
      m.id, m.name, m.paidAmount, m.status
    ]);
    exportToCSV(`${scheme.name}_Member_Roster`, headers, rows);
  };

  const handleExportSchemeRosterPDF = (scheme) => {
    const headers = ["Member ID", "Member Name", "Paid Amount", "Payment Status"];
    const rows = (scheme.membersList || []).map(m => [
      m.id, m.name, m.paidAmount, m.status
    ]);
    const summary = [
      { label: "Scheme Name", value: scheme.name },
      { label: "Rate", value: `₹${formatIndianCurrency(scheme.monthly)} (${scheme.type})` },
      { label: "Collected", value: `₹${formatIndianCurrency(scheme.collected)}` },
      { label: "Pending", value: `₹${formatIndianCurrency(scheme.pending)}` },
    ];
    printPDFReport(`Scheme Roster - ${scheme.name}`, `Enrolled Members Statement`, headers, rows, summary);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const durationNum = parseInt(formData.duration) || 10;
    const totalPool = Number(formData.members) * Number(formData.monthly) * durationNum;

    const newScheme = {
      id: `ST-2026-${seettuList.length + 1}`,
      name: formData.name,
      type: formData.type,
      members: Number(formData.members),
      monthly: Number(formData.monthly),
      collected: 0,
      pending: totalPool,
      targetTotal: totalPool,
      duration: formData.duration,
      currentMonth: 1,
      startDate: formData.startDate,
      status: "Active",
      membersList: []
    };

    addSeettu(newScheme);
    setFormData({
      name: '',
      type: 'Monthly',
      members: 25,
      monthly: 2000,
      duration: '10 Months',
      startDate: new Date().toISOString().split('T')[0]
    });
    setIsCreateModalOpen(false);
    setActiveTab('active');
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingSeettu) return;

    const durationNum = parseInt(editingSeettu.duration) || 10;
    const totalPool = Number(editingSeettu.members) * Number(editingSeettu.monthly) * durationNum;
    
    const updated = {
      ...editingSeettu,
      pending: totalPool - (editingSeettu.collected || 0),
      targetTotal: totalPool
    };

    updateSeettu(updated);
    if (selectedSeettu && selectedSeettu.id === updated.id) {
      setSelectedSeettu(updated);
    }
    setEditingSeettu(null);
  };

  const handleDeleteConfirm = () => {
    if (!deletingSeettu) return;
    deleteSeettu(deletingSeettu.id);
    if (selectedSeettu && selectedSeettu.id === deletingSeettu.id) {
      setSelectedSeettu(null);
    }
    setDeletingSeettu(null);
  };

  // Filter schemes based on Tab & Search
  const filteredSchemes = seettuList.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'active') return matchesSearch && scheme.status === 'Active';
    if (activeTab === 'completed') return matchesSearch && scheme.status === 'Completed';
    return matchesSearch;
  });

  // Derive live selectedSeettu from seettuList so collection updates sync immediately
  const currentSeettu = selectedSeettu ? (seettuList.find(s => s.id === selectedSeettu.id) || selectedSeettu) : null;

  // If a Seettu is clicked, render the IN-PAGE Detail View directly!
  if (currentSeettu) {
    const collectionPercentage = Math.round(
      (currentSeettu.collected / (currentSeettu.collected + currentSeettu.pending || 1)) * 100
    );

    return (
      <div className="space-y-8 pb-10">
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSelectedSeettu(null)}
            className="btn-secondary py-2.5 px-5 text-sm font-bold flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 text-[#1E3A8A]" /> Back to Chit Groups
          </button>

          <span className="text-xs font-mono font-bold px-3.5 py-1.5 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-xl">
            ID: {currentSeettu.id}
          </span>
        </div>

        {/* In-Page Main Seettu Header Banner */}
        <div className="glass-card p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-xl bg-white/90 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#1E3A8A]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  currentSeettu.status === 'Active' 
                    ? 'bg-amber-50 text-amber-800 border-amber-200' 
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  {currentSeettu.status}
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {currentSeettu.type} Scheme
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mb-2">
                {currentSeettu.name}
              </h1>

              <p className="text-slate-600 text-sm font-normal">
                Start Date: <span className="font-semibold text-slate-800">{currentSeettu.startDate}</span> | Duration: <span className="font-semibold text-slate-800">{currentSeettu.duration}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => setEditingSeettu(currentSeettu)}
                className="btn-secondary py-2.5 px-4 text-xs font-bold flex items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4 text-[#1E3A8A]" /> Edit Scheme
              </button>
              <button 
                onClick={() => setDeletingSeettu(currentSeettu)}
                className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <button className="btn-primary py-2.5 px-5 text-xs font-bold">
                Record Collection
              </button>
            </div>
          </div>
        </div>

        {/* 4 Summary Metric Cards Requested by User */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-xl shadow-lg text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 font-serif">Members</p>
            <h3 className="text-3xl font-extrabold text-slate-900">{currentSeettu.members}</h3>
            <p className="text-xs text-slate-500 mt-1">Total Enrolled Members</p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-xl shadow-lg text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 font-serif">
              {currentSeettu.type === 'Weekly' ? 'Weekly' : 'Monthly'}
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 font-sans">₹{formatIndianCurrency(currentSeettu.monthly)}</h3>
            <p className="text-xs text-slate-500 mt-1">Per Member Rate</p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-emerald-200 bg-emerald-50/60 backdrop-blur-xl shadow-lg text-center">
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 font-serif">Collected</p>
            <h3 className="text-3xl font-extrabold text-emerald-700 font-sans">₹{formatIndianCurrency(currentSeettu.collected)}</h3>
            <p className="text-xs text-emerald-700 mt-1">Total Amount Collected</p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-rose-200 bg-rose-50/60 backdrop-blur-xl shadow-lg text-center">
            <p className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-1 font-serif">Pending</p>
            <h3 className="text-3xl font-extrabold text-rose-600 font-sans">₹{formatIndianCurrency(currentSeettu.pending)}</h3>
            <p className="text-xs text-rose-700 mt-1">Remaining Dues</p>
          </div>
        </div>

        {/* Collection Progress Card */}
        <div className="glass-card p-6 sm:p-8 rounded-[2rem] border border-slate-200 bg-white/90 backdrop-blur-xl shadow-md">
          <div className="flex justify-between items-center text-sm font-bold text-slate-800 mb-3">
            <span>Overall Collection Progress</span>
            <span className="text-[#1E3A8A] font-extrabold">{collectionPercentage}% Completed</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden p-0.5 shadow-inner">
            <div 
              className="bg-gradient-to-r from-[#1E3A8A] to-[#D97706] h-full rounded-full transition-all duration-500 shadow-md"
              style={{ width: `${collectionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Member Roster Table */}
        <div className="glass-card p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-xl bg-white/90 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold font-serif text-slate-900">Enrolled Members Status</h2>
              <p className="text-xs text-slate-500 font-medium">Member payment roster for {currentSeettu.name}</p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleExportSchemeRosterPDF(currentSeettu)}
                className="px-3.5 py-1.5 rounded-xl bg-[#1E3A8A]/10 text-[#1E3A8A] border border-[#1E3A8A]/20 text-xs font-bold hover:bg-[#1E3A8A]/20 transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" /> PDF Roster
              </button>
              <button 
                onClick={() => handleExportSchemeRosterCSV(currentSeettu)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Excel Roster
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold bg-slate-50/50">
                  <th className="py-3.5 px-4 rounded-l-xl">Member ID</th>
                  <th className="py-3.5 px-4">Member Name</th>
                  <th className="py-3.5 px-4">Paid Amount</th>
                  <th className="py-3.5 px-4 text-right rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {(currentSeettu.membersList || []).map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs font-bold text-[#1E3A8A]">{m.id}</td>
                    <td className="py-4 px-4 font-bold text-slate-900">{m.name}</td>
                    <td className="py-4 px-4 font-bold text-slate-900 font-sans">{m.paidAmount}</td>
                    <td className="py-4 px-4 text-right">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                        m.status === 'Paid' || m.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Normal List View when no Seettu is selected
  return (
    <div className="space-y-8 pb-10">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-xl bg-white/90 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#1E3A8A]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-[#1E3A8A] text-xs font-semibold uppercase tracking-wider mb-3">
              <Briefcase className="w-3.5 h-3.5 text-[#D97706]" /> Seettu & Chit Schemes
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 mb-2">
              Seettu Management
            </h1>
            <p className="text-slate-600 font-normal">
              Manage all chit groups, track monthly collections, members capacity, and pending dues.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={handleExportAllSchemesPDF}
              className="px-4 py-3 rounded-xl bg-[#1E3A8A]/10 text-[#1E3A8A] border border-[#1E3A8A]/20 text-xs font-bold hover:bg-[#1E3A8A]/20 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" /> PDF All Schemes
            </button>
            <button 
              onClick={handleExportAllSchemesCSV}
              className="px-4 py-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" /> Excel All Schemes
            </button>
            <button 
              onClick={() => {
                setActiveTab('create');
                setIsCreateModalOpen(true);
              }}
              className="btn-primary py-3.5 px-6 text-sm flex-shrink-0"
            >
              <Plus className="w-5 h-5" /> Create New Seettu
            </button>
          </div>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search seettu by name..."
            className="w-full pl-11 pr-4 py-3 bg-white/90 border border-slate-200 rounded-2xl outline-none text-slate-900 shadow-sm backdrop-blur-md focus:border-[#1E3A8A]"
          />
        </div>
      </div>

      {/* Seettu Cards Grid */}
      {filteredSchemes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((seettu) => (
            <div
              key={seettu.id}
              className="glass-card glass-card-hover p-6 rounded-3xl border border-slate-200 relative overflow-hidden bg-white/90 backdrop-blur-xl shadow-lg flex flex-col justify-between"
            >
              {/* Status Top Strip */}
              <div className={`absolute top-0 left-0 right-0 h-2 ${
                seettu.status === 'Active' ? 'bg-gradient-to-r from-[#1E3A8A] to-[#D97706]' : 'bg-emerald-600'
              }`}></div>

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#1E3A8A]">{seettu.id}</span>
                    <h3 className="text-xl font-bold font-serif text-slate-900">
                      {seettu.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingSeettu(seettu); }}
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-200 transition-colors"
                      title="Edit Seettu"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDeletingSeettu(seettu); }}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                      title="Delete Seettu"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      seettu.status === 'Active' 
                        ? 'bg-amber-50 text-amber-800 border-amber-200' 
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {seettu.status}
                    </span>
                  </div>
                </div>

                {/* Metric Display */}
                <div className="space-y-2.5 py-4 border-y border-slate-100 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#1E3A8A]" /> Members:
                    </span>
                    <span className="font-bold text-slate-900">{seettu.members}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <Coins className="w-4 h-4 text-[#1E3A8A]" /> {seettu.type}:
                    </span>
                    <span className="font-bold text-slate-900">₹{formatIndianCurrency(seettu.monthly)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#1E3A8A]" /> Duration:
                    </span>
                    <span className="font-bold text-slate-900">{seettu.duration}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Collected:
                    </span>
                    <span className="font-bold text-emerald-700 font-sans">₹{formatIndianCurrency(seettu.collected)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600" /> Pending:
                    </span>
                    <span className="font-bold text-rose-600 font-sans">₹{formatIndianCurrency(seettu.pending)}</span>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setSelectedSeettu(seettu)}
                className="pt-4 flex items-center justify-between text-xs font-semibold text-[#1E3A8A] hover:translate-x-1 transition-transform cursor-pointer"
              >
                <span>View In-Page Details</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 rounded-[2.5rem] border border-slate-200 bg-white/90 backdrop-blur-xl text-center space-y-4 shadow-lg">
          <div className="w-16 h-16 bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 text-[#1E3A8A] rounded-2xl flex items-center justify-center mx-auto">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-serif text-slate-900">No Seettu Schemes Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Get started by creating your first chit scheme. Set member capacity, duration, and installment rates.
          </p>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary py-3 px-6 text-xs font-bold"
          >
            <Plus className="w-4 h-4" /> Create First Seettu
          </button>
        </div>
      )}

      {/* Create Seettu Modal / Form */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-[2.5rem] border border-white/90 shadow-2xl bg-white/95 backdrop-blur-2xl relative">
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-stone-100 text-stone-500 hover:text-stone-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold font-serif text-stone-900 mb-1">Create New Seettu</h2>
            <p className="text-xs text-stone-500 mb-6">Setup a new chit scheme, set member capacity and monthly rate.</p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Seettu Scheme Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Diwali Seettu 2026"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-900 text-sm focus:border-[#7C2D12]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => {
                      const newType = e.target.value;
                      setFormData({ 
                        ...formData, 
                        type: newType,
                        duration: newType === 'Weekly' ? '20 Weeks' : '10 Months'
                      });
                    }}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-900 text-sm focus:border-[#7C2D12]"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Members Capacity</label>
                  <input 
                    type="number"
                    required
                    value={formData.members}
                    onChange={(e) => setFormData({ ...formData, members: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-900 text-sm focus:border-[#7C2D12]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {formData.type === 'Weekly' ? 'Weekly Amount (₹)' : 'Monthly Amount (₹)'}
                  </label>
                  <input 
                    type="number"
                    required
                    value={formData.monthly}
                    onChange={(e) => setFormData({ ...formData, monthly: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-900 text-sm focus:border-[#7C2D12]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Duration</label>
                  <input 
                    type="text"
                    required
                    placeholder={formData.type === 'Weekly' ? 'e.g. 20 Weeks' : 'e.g. 10 Months'}
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-900 text-sm focus:border-[#7C2D12]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Start Date</label>
                <input 
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-900 text-sm focus:border-[#7C2D12]"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-1/2 btn-secondary py-3 text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 btn-primary py-3 text-sm"
                >
                  Save Seettu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Seettu Modal */}
      {editingSeettu && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-[2.5rem] border border-white/90 shadow-2xl bg-white/95 backdrop-blur-2xl relative">
            <button 
              onClick={() => setEditingSeettu(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-stone-100 text-stone-500 hover:text-stone-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold font-serif text-stone-900 mb-1">Edit Seettu Scheme</h2>
            <p className="text-xs text-stone-500 mb-6">Modify scheme parameters and member capacity.</p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Seettu Scheme Name</label>
                <input 
                  type="text"
                  required
                  value={editingSeettu.name}
                  onChange={(e) => setEditingSeettu({ ...editingSeettu, name: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-900 text-sm focus:border-[#7C2D12]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Type</label>
                  <select 
                    value={editingSeettu.type}
                    onChange={(e) => setEditingSeettu({ ...editingSeettu, type: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-900 text-sm focus:border-[#7C2D12]"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Members Capacity</label>
                  <input 
                    type="number"
                    required
                    value={editingSeettu.members}
                    onChange={(e) => setEditingSeettu({ ...editingSeettu, members: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-900 text-sm focus:border-[#7C2D12]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {editingSeettu.type === 'Weekly' ? 'Weekly Amount (₹)' : 'Monthly Amount (₹)'}
                  </label>
                  <input 
                    type="number"
                    required
                    value={editingSeettu.monthly}
                    onChange={(e) => setEditingSeettu({ ...editingSeettu, monthly: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-900 text-sm focus:border-[#7C2D12]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Duration</label>
                  <input 
                    type="text"
                    required
                    value={editingSeettu.duration}
                    onChange={(e) => setEditingSeettu({ ...editingSeettu, duration: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none text-stone-900 text-sm focus:border-[#7C2D12]"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setEditingSeettu(null)}
                  className="w-1/2 btn-secondary py-3 text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 btn-primary py-3 text-sm"
                >
                  Update Seettu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Seettu Confirmation Modal */}
      {deletingSeettu && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-[2.5rem] border border-white/90 shadow-2xl bg-white/95 backdrop-blur-2xl relative text-center">
            <button 
              onClick={() => setDeletingSeettu(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-stone-100 text-stone-500 hover:text-stone-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-rose-100 border border-rose-200 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold font-serif text-stone-900 mb-2">Delete Seettu Scheme?</h2>
            <p className="text-xs text-stone-500 mb-6 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-stone-900">"{deletingSeettu.name}"</span>? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setDeletingSeettu(null)}
                className="w-1/2 btn-secondary py-3 text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="w-1/2 py-3 text-sm font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700 shadow-md transition-colors"
              >
                Delete Scheme
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
