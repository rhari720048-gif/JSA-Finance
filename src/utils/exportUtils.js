// Utility functions for exporting reports and data tables to Excel (CSV) and PDF (Printable PDF Statement)

export function exportToCSV(filename, headers, rows) {
  // Add UTF-8 BOM so Excel handles special characters cleanly
  let csvContent = "\uFEFF";
  
  // Header row
  csvContent += headers.map(h => `"${h.replace(/"/g, '""')}"`).join(",") + "\n";
  
  // Data rows
  rows.forEach(row => {
    const formattedRow = row.map(cell => {
      const cellStr = cell !== undefined && cell !== null ? String(cell) : "";
      return `"${cellStr.replace(/"/g, '""')}"`;
    });
    csvContent += formattedRow.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printPDFReport(title, subtitle, headers, rows, summaryMetrics = []) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Please allow popups to generate PDF report.");
    return;
  }

  const timestamp = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const metricsHTML = summaryMetrics.length > 0 ? `
    <div style="display: flex; gap: 15px; margin-bottom: 20px;">
      ${summaryMetrics.map(m => `
        <div style="flex: 1; padding: 12px; border: 1px solid #1E3A8A; border-radius: 8px; background-color: #F8FAFC;">
          <div style="font-size: 10px; text-transform: uppercase; color: #64748B; font-weight: bold;">${m.label}</div>
          <div style="font-size: 18px; font-weight: bold; color: #1E3A8A;">${m.value}</div>
        </div>
      `).join('')}
    </div>
  ` : '';

  const tableHeaderHTML = headers.map(h => `<th style="padding: 10px; background-color: #1E3A8A; color: #FFFFFF; text-align: left; font-size: 12px; border: 1px solid #1E3A8A;">${h}</th>`).join('');

  const tableRowsHTML = rows.length > 0 ? rows.map((row, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'}; font-size: 12px;">
      ${row.map(cell => `<td style="padding: 8px 10px; border: 1px solid #E2E8F0;">${cell !== undefined && cell !== null ? cell : ''}</td>`).join('')}
    </tr>
  `).join('') : `
    <tr><td colspan="${headers.length}" style="text-align: center; padding: 20px; color: #64748B;">No records found for this report.</td></tr>
  `;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - Jai Sri Amman Finance</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0F172A; padding: 30px; margin: 0; }
          .header { border-bottom: 3px solid #1E3A8A; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
          .title { font-size: 24px; font-weight: bold; color: #1E3A8A; margin: 0; }
          .subtitle { font-size: 13px; color: #D97706; font-weight: bold; margin-top: 4px; }
          .timestamp { font-size: 11px; color: #64748B; text-align: right; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .footer { margin-top: 30px; border-top: 1px solid #E2E8F0; padding-top: 15px; font-size: 11px; color: #64748B; text-align: center; }
          @media print {
            body { padding: 10px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">JAI SRI AMMAN FINANCE</h1>
            <p class="subtitle">${title} ${subtitle ? `- ${subtitle}` : ''}</p>
          </div>
          <div class="timestamp">
            <div><strong>Generated On:</strong> ${timestamp}</div>
            <div>Official Financial Statement</div>
          </div>
        </div>

        ${metricsHTML}

        <table>
          <thead>
            <tr>${tableHeaderHTML}</tr>
          </thead>
          <tbody>
            ${tableRowsHTML}
          </tbody>
        </table>

        <div class="footer">
          <p>Jai Sri Amman Finance • Confidential Financial Statement • Computer Generated Report</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
