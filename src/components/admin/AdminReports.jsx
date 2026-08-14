import React, { useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  Download, 
  FileSpreadsheet, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Printer 
} from 'lucide-react';
import { useSeettu } from '../../context/SeettuContext';
import { formatIndianCurrency } from '../../utils/formatCurrency';
import { exportToCSV, printPDFReport } from '../../utils/exportUtils';

export default function AdminReports() {
  const { seettuList, membersList, paymentsList } = useSeettu();

  // Selected Report Type State (6 Types requested by user)
  const [selectedReportType, setSelectedReportType] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedSeettu, setSelectedSeettu] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [exportNotice, setExportNotice] = useState(null);

  // 6 Report Types definition
  const reportTypes = [
    { id: 'monthly', name: 'Monthly Collection', desc: 'Monthly breakdown of installment collections with Date & Time', icon: Calendar },
    { id: 'weekly', name: 'Weekly Collection', desc: 'Weekly collection cycle statements & logs', icon: TrendingUp },
    { id: 'member', name: 'Member Payment Report', desc: 'Detailed payment history by individual member', icon: Users },
    { id: 'pending', name: 'Pending Payment Report', desc: 'Overdue balances and delinquent members list', icon: AlertCircle },
    { id: 'seettu_wise', name: 'Seettu-wise Report', desc: 'Performance and collection stats by scheme', icon: Briefcase },
    { id: 'complete', name: 'Complete Seettu Report', desc: 'All-time master ledger & completed schemes', icon: CheckCircle2 },
  ];

  // Helper to format Date & Time timestamp
  const formatDateTime = (dateStr) => {
    if (!dateStr || dateStr === 'Today') {
      return new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
    return dateStr;
  };

  // Generate dynamic live report rows based on selectedReportType
  const getDynamicReportData = () => {
    switch (selectedReportType) {
      case 'monthly':
        return paymentsList
          .filter(p => {
            const matchesSeettu = selectedSeettu === 'All' || p.seettu === selectedSeettu;
            const matchesMonth = selectedMonth === 'All' || p.month === selectedMonth;
            return matchesSeettu && matchesMonth;
          })
          .map(p => ({
            dateTime: formatDateTime(p.paymentDate),
            reference: p.receiptNo || p.id,
            name: p.member,
            scheme: p.seettu,
            amount: `₹${formatIndianCurrency(p.paid || p.dueAmount)}`,
            method: p.paymentMethod || 'N/A',
            status: p.status
          }));

      case 'weekly':
        return paymentsList
          .filter(p => {
            const scheme = seettuList.find(s => s.name.toLowerCase() === p.seettu.toLowerCase());
            const isWeekly = scheme ? scheme.type === 'Weekly' : p.seettu.toLowerCase().includes('weekly');
            const matchesSeettu = selectedSeettu === 'All' || p.seettu === selectedSeettu;
            return isWeekly && matchesSeettu;
          })
          .map(p => ({
            dateTime: formatDateTime(p.paymentDate),
            reference: p.receiptNo || p.id,
            name: p.member,
            scheme: p.seettu,
            amount: `₹${formatIndianCurrency(p.paid || p.dueAmount)}`,
            method: p.paymentMethod || 'N/A',
            status: p.status
          }));

      case 'member':
        return membersList.flatMap(m => 
          (m.paymentHistory || []).map(ph => ({
            dateTime: formatDateTime(ph.date),
            reference: ph.receiptNo || m.id,
            name: m.name,
            scheme: ph.seettu,
            amount: ph.amount,
            method: ph.method || 'N/A',
            status: ph.status
          }))
        );

      case 'pending':
        return paymentsList
          .filter(p => p.status === 'Pending' || p.balance > 0)
          .map(p => ({
            dateTime: formatDateTime(p.paymentDate),
            reference: p.memberId || p.id,
            name: p.member,
            scheme: p.seettu,
            amount: `₹${formatIndianCurrency(p.balance || p.dueAmount)}`,
            method: 'Pending Action',
            status: 'Overdue'
          }));

      case 'seettu_wise':
        return seettuList.map(s => ({
          dateTime: `${s.type} • ${s.duration}`,
          reference: s.id,
          name: s.name,
          scheme: `${s.members} Members`,
          amount: `₹${formatIndianCurrency(s.collected)} Collected`,
          method: `₹${formatIndianCurrency(s.pending)} Pending`,
          status: s.status
        }));

      case 'complete':
        return seettuList.map(s => ({
          dateTime: `Start: ${s.startDate}`,
          reference: s.id,
          name: s.name,
          scheme: `${s.duration} Scheme`,
          amount: `₹${formatIndianCurrency(s.targetTotal)} Target`,
          method: `₹${formatIndianCurrency(s.collected)} Collected`,
          status: s.status
        }));

      default:
        return [];
    }
  };

  const activeReportData = getDynamicReportData();

  // Filtered rows by search query
  const filteredRows = activeReportData.filter(row => 
    row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.scheme.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Export PDF
  const handleExportPDF = () => {
    const currentReport = reportTypes.find(r => r.id === selectedReportType);
    const headers = ["Date & Time", "Reference ID", "Name / Scheme", "Details", "Amount", "Method", "Status"];
    const rows = filteredRows.map(r => [r.dateTime, r.reference, r.name, r.scheme, r.amount, r.method, r.status]);

    const summaryMetrics = [
      { label: "Total Entries", value: filteredRows.length.toString() },
      { label: "Total Active Schemes", value: seettuList.length.toString() },
      { label: "Total Members", value: membersList.length.toString() },
    ];

    printPDFReport(currentReport?.name || "Financial Report", selectedMonth !== 'All' ? selectedMonth : '', headers, rows, summaryMetrics);
    
    setExportNotice({ type: 'PDF', msg: `${currentReport?.name} PDF statement opened for print & download.` });
    setTimeout(() => setExportNotice(null), 4000);
  };

  // Handle Export Excel / CSV
  const handleExportExcel = () => {
    const currentReport = reportTypes.find(r => r.id === selectedReportType);
    const headers = ["Date & Time", "Reference ID", "Name / Scheme", "Details", "Amount", "Method", "Status"];
    const rows = filteredRows.map(r => [r.dateTime, r.reference, r.name, r.scheme, r.amount, r.method, r.status]);

    exportToCSV(`${selectedReportType}_report`, headers, rows);

    setExportNotice({ type: 'Excel', msg: `${currentReport?.name} downloaded as Excel/CSV spreadsheet.` });
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-xl bg-white/90 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#1E3A8A]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-[#1E3A8A] text-xs font-semibold uppercase tracking-wider mb-3">
              <BarChart3 className="w-3.5 h-3.5 text-[#D97706]" /> Financial Reporting Module
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 mb-2">
              Financial Reports
            </h1>
            <p className="text-slate-600 font-normal">
              Generate live financial statements with real payment Date & Time timestamps and export in PDF & Excel formats.
            </p>
          </div>

          {/* Download Action Buttons (PDF & Excel) */}
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <button 
              onClick={handleExportPDF}
              className="btn-primary py-3 px-5 text-sm flex items-center gap-2 shadow-md"
            >
              <FileText className="w-4 h-4" /> Download PDF
            </button>
            <button 
              onClick={handleExportExcel}
              className="btn-secondary text-emerald-800 border-emerald-300 hover:bg-emerald-50 py-3 px-5 text-sm flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" /> Download Excel
            </button>
          </div>
        </div>
      </div>

      {/* Export Notification Badge */}
      {exportNotice && (
        <div className="glass-card p-4 rounded-2xl border border-emerald-300 bg-emerald-50 text-emerald-900 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <span className="text-sm font-semibold">{exportNotice.msg}</span>
          </div>
          <button onClick={() => setExportNotice(null)} className="text-emerald-700 hover:text-emerald-900">
            <Printer className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 6 Report Type Selector Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          const isSelected = selectedReportType === report.id;
          return (
            <div
              key={report.id}
              onClick={() => setSelectedReportType(report.id)}
              className={`glass-card p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                isSelected 
                  ? 'border-[#1E3A8A] bg-white shadow-lg ring-2 ring-[#1E3A8A]/20' 
                  : 'border-slate-200 hover:border-slate-300 bg-white/90 shadow-xs'
              }`}
            >
              <div className={`p-3.5 rounded-xl border ${
                isSelected ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                <Icon className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <h3 className={`font-bold font-serif text-base mb-1 ${
                  isSelected ? 'text-[#1E3A8A]' : 'text-slate-900'
                }`}>
                  {report.name}
                </h3>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">{report.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Bar & Controls */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-xs font-semibold focus:border-[#1E3A8A]"
              >
                <option value="All">All Months</option>
                <option value="August 2026">August 2026</option>
                <option value="July 2026">July 2026</option>
                <option value="June 2026">June 2026</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select Seettu Scheme</label>
              <select
                value={selectedSeettu}
                onChange={(e) => setSelectedSeettu(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 text-xs font-semibold focus:border-[#1E3A8A]"
              >
                <option value="All">All Seettu Schemes</option>
                {seettuList.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in report..."
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl outline-none text-slate-800 w-56 focus:border-[#1E3A8A]"
            />
          </div>
        </div>
      </div>

      {/* Main Live Report Output Data Table */}
      <div className="glass-card p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-xl bg-white/90 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#1E3A8A]" /> 
              {reportTypes.find(r => r.id === selectedReportType)?.name}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Live statement generated with exact payment Date & Time timestamps
            </p>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleExportPDF}
              className="px-3.5 py-1.5 rounded-xl bg-[#1E3A8A]/10 text-[#1E3A8A] border border-[#1E3A8A]/20 text-xs font-bold hover:bg-[#1E3A8A]/20 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" /> PDF
            </button>
            <button 
              onClick={handleExportExcel}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold bg-slate-50/50">
                <th className="py-3.5 px-4 rounded-l-xl">Date & Time</th>
                <th className="py-3.5 px-4">Reference ID</th>
                <th className="py-3.5 px-4">Name / Title</th>
                <th className="py-3.5 px-4">Seettu Details</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Method / Mode</th>
                <th className="py-3.5 px-4 text-right rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.length > 0 ? (
                filteredRows.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-900 text-xs">{row.dateTime}</td>
                    <td className="py-4 px-4 font-mono text-xs text-[#1E3A8A] font-bold">{row.reference}</td>
                    <td className="py-4 px-4 font-bold text-slate-900">{row.name}</td>
                    <td className="py-4 px-4 text-slate-600 text-xs">{row.scheme}</td>
                    <td className="py-4 px-4 font-extrabold text-slate-900 font-sans">{row.amount}</td>
                    <td className="py-4 px-4 text-slate-500 text-xs">{row.method}</td>
                    <td className="py-4 px-4 text-right">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${
                        row.status === 'Paid' || row.status === 'Collected' || row.status === 'Completed' || row.status.includes('Progress')
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-sm">
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 text-[#1E3A8A] rounded-xl flex items-center justify-center mx-auto">
                        <BarChart3 className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-slate-900 text-base">No Report Records Found</p>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        There are currently no transaction or scheme records matching the selected report filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
