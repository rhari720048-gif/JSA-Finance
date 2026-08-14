const getStoredCompanyDetails = () => {
  try {
    const raw = localStorage.getItem('sri_amman_db_v4');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.settings) return parsed.settings;
    }
  } catch (e) {
    console.error(e);
  }
  return {
    name: "JAI SRI AMMAN FINANCE",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    email: "contact@sriammanfinance.com",
    address: "123, Gandhi Road, Madurai - 625001",
    experienceYears: "10+",
    happyMembers: "500+",
    completedSeettus: "1000+",
    paymentTransparency: "100%"
  };
};

export const COMPANY_DETAILS = getStoredCompanyDetails();

export const SEETTU_PLANS = [
  {
    id: "weekly",
    title: "Weekly Savings Scheme",
    features: [
      "Fixed weekly installment options",
      "Flexible and easy payment methods",
      "Transparent digital record for every transaction",
      "Guaranteed maturity payout upon scheme completion",
      "Special rewards and gifts for timely members"
    ]
  },
  {
    id: "monthly",
    title: "Monthly Savings Scheme",
    features: [
      "Fixed monthly installment options",
      "Flexible and easy payment methods",
      "Transparent digital record for every transaction",
      "Guaranteed maturity payout upon scheme completion",
      "Special rewards and gifts for timely members"
    ]
  }
];

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Choose Your Scheme",
    desc: "Select a weekly or monthly chit savings plan tailored to your financial goals."
  },
  {
    step: "02",
    title: "Enroll Securely",
    desc: "Join the chit group with 100% transparency starting from the official launch date."
  },
  {
    step: "03",
    title: "Regular Contributions",
    desc: "Pay your installments easily through Cash, UPI, or Online NetBanking."
  },
  {
    step: "04",
    title: "Track Online Ledger",
    desc: "Monitor your digital payment receipts and cycle progress in real-time."
  },
  {
    step: "05",
    title: "Receive Maturity Payout",
    desc: "Collect your guaranteed maturity corpus and bonus rewards upon scheme completion."
  }
];

export const WHY_CHOOSE_US = [
  {
    title: "Simple & Easy Savings",
    desc: "Clear and straightforward chit plans built for everyone."
  },
  {
    title: "100% Transparency",
    desc: "Every installment is digitally logged and instantly receipted."
  },
  {
    title: "Flexible Cycles",
    desc: "Choose weekly or monthly installments based on your income."
  },
  {
    title: "Guaranteed Payout",
    desc: "Receive your full maturity corpus securely on plan completion."
  },
  {
    title: "Member Rewards",
    desc: "Exclusive bonuses and gifts for members paying on time."
  },
  {
    title: "Trusted Institution",
    desc: "A reliable financial partner working for your family prosperity."
  }
];

export const FAQ_DATA = [
  {
    q: "What is a Weekly Savings Scheme?",
    a: "It is a systematic savings plan where members deposit a fixed installment every week towards a total accumulated corpus."
  },
  {
    q: "What is a Monthly Savings Scheme?",
    a: "A convenient plan for salaried individuals to deposit a fixed monthly amount over a set duration."
  },
  {
    q: "When does a scheme officially start?",
    a: "A scheme begins on the announced start date once member capacity is fulfilled."
  },
  {
    q: "How long is the scheme duration?",
    a: "Durations depend on the plan selected (e.g., 25 weeks or 12 months)."
  },
  {
    q: "What payment methods are supported?",
    a: "You can pay in cash at our office or digitally via UPI, Google Pay, or Online Banking."
  },
  {
    q: "Do I receive a receipt for every payment?",
    a: "Yes! An official digital receipt is generated immediately upon payment confirmation."
  },
  {
    q: "How can I check my payment history?",
    a: "You can view your real-time payment ledger anytime via the online portal."
  },
  {
    q: "What happens if I miss a due date?",
    a: "The installment is marked as Pending until updated upon payment receipt."
  },
  {
    q: "When do I receive my maturity payout?",
    a: "Upon completing all plan installments, your maturity corpus is paid out immediately."
  },
  {
    q: "How are rewards awarded?",
    a: "Gifts and incentives are awarded to eligible members who pay all installments on time."
  }
];
