// Helper utility to format numbers in the Indian Currency Numbering System (Lakhs & Crores)
// Example: 1250000 => "12,50,000" (not "1,250,000")
export function formatIndianCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return "0";
  return Number(amount).toLocaleString('en-IN');
}

export function formatINR(amount) {
  return `₹${formatIndianCurrency(amount)}`;
}
