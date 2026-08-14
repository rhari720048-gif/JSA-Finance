import React, { createContext, useContext, useState } from 'react';
import { formatIndianCurrency } from '../utils/formatCurrency';
import { sendRealOTPEmail, sendRealReceiptEmail, sendRealWelcomeEmail, sendRealChitEnrollmentEmail } from '../utils/emailService';
import { sendAppNotification } from '../utils/notificationService';

const SeettuContext = createContext();

export function SeettuProvider({ children }) {
  // Clean Initial States
  const [seettuList, setSeettuList] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);

  // Active Member session state for public website member login portal
  const [activeMember, setActiveMember] = useState(null);

  const loginMember = (identifier, password) => {
    const cleanId = identifier ? identifier.trim().toLowerCase() : '';
    const member = membersList.find(
      m => (m.mobile === identifier || m.email?.toLowerCase() === cleanId || m.id?.toLowerCase() === cleanId)
    );

    if (!member) {
      return { success: false, message: "No registered member account found with this Mobile Number or Email." };
    }

    if (member.password && member.password !== password) {
      return { success: false, message: "Incorrect password. Click 'Forgot Password?' to reset." };
    }

    setActiveMember(member);
    return { success: true, member };
  };

  const logoutMember = () => {
    setActiveMember(null);
  };

  // Active Receipt Modal Popup state for automatic Receipt & Email notification display
  const [currentReceipt, setCurrentReceipt] = useState(null);

  // OTP State for Forgot Password flow
  const [otpState, setOtpState] = useState(null);

  // Seettu CRUD
  const addSeettu = (newScheme) => {
    setSeettuList(prev => [newScheme, ...prev]);

    // Send PWA Native App Notification
    sendAppNotification(
      "New Chit Group Created",
      `Chit scheme "${newScheme.name}" has been launched successfully!`
    );
  };

  const updateSeettu = (updatedScheme) => {
    setSeettuList(prev => prev.map(item => item.id === updatedScheme.id ? updatedScheme : item));
  };

  const deleteSeettu = (schemeId) => {
    setSeettuList(prev => prev.filter(item => item.id !== schemeId));
  };

  // Member CRUD with Credentials (ID, Mobile, Email, Password)
  const addMember = (newMember) => {
    const formattedMember = {
      ...newMember,
      password: newMember.password || 'member@123',
      paymentHistory: newMember.paymentHistory || []
    };

    setMembersList(prev => [formattedMember, ...prev]);

    // 1. Dispatch Real Welcome Email to Member with ID & Password
    if (formattedMember.email) {
      sendRealWelcomeEmail({
        toEmail: formattedMember.email,
        memberName: formattedMember.name,
        memberId: formattedMember.id,
        mobile: formattedMember.mobile,
        password: formattedMember.password
      });

      sendAppNotification(
        "Welcome to JSA Finance!",
        `Member ${formattedMember.name} created. Login credentials sent to ${formattedMember.email}`
      );
    }

    // 2. Create payment ledger items & scheme roster entries for each enrolled scheme
    if (formattedMember.seettuDetails && formattedMember.seettuDetails.length > 0) {
      formattedMember.seettuDetails.forEach(sDetail => {
        const schemeObj = seettuList.find(s => s.name === sDetail.name || s.id === sDetail.id);
        const due = schemeObj ? schemeObj.monthly : 2000;

        const newPayItem = {
          id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
          member: formattedMember.name,
          memberId: formattedMember.id,
          seettu: sDetail.name,
          month: "August 2026",
          dueAmount: due,
          paid: 0,
          balance: due,
          status: "Pending",
          paymentDate: "Due Today",
          paymentMethod: "N/A",
          receiptNo: "Pending"
        };

        setPaymentsList(prev => [newPayItem, ...prev]);

        // Send Chit Group Enrollment Email
        if (formattedMember.email) {
          sendRealChitEnrollmentEmail({
            toEmail: formattedMember.email,
            memberName: formattedMember.name,
            seettuName: sDetail.name,
            amount: `₹${formatIndianCurrency(due)}`,
            frequency: sDetail.frequency || 'Monthly',
            poolTarget: 'Guaranteed Payout'
          });
        }

        // Add to Chit Group member roster
        if (schemeObj) {
          setSeettuList(prevList => prevList.map(s => {
            if (s.id === schemeObj.id || s.name === schemeObj.name) {
              const existingMembers = s.membersList || [];
              const alreadyExists = existingMembers.some(rm => rm.name === formattedMember.name || rm.id === formattedMember.id);
              if (!alreadyExists) {
                return {
                  ...s,
                  membersList: [
                    ...existingMembers,
                    { id: formattedMember.id, name: formattedMember.name, status: "Pending", paidAmount: "₹0" }
                  ]
                };
              }
            }
            return s;
          }));
        }
      });
    }
  };

  const updateMember = (updatedMember) => {
    setMembersList(prev => prev.map(item => item.id === updatedMember.id ? updatedMember : item));
  };

  const deleteMember = (memberId) => {
    setMembersList(prev => prev.filter(item => item.id !== memberId));
    setPaymentsList(prev => prev.filter(p => p.memberId !== memberId));
  };

  // Forgot Password OTP Flow
  const sendForgotPasswordOTP = (emailOrMobile) => {
    const member = membersList.find(
      m => m.email?.toLowerCase() === emailOrMobile.toLowerCase() || m.mobile === emailOrMobile
    );

    if (!member) {
      return { success: false, message: "No registered member found with this Email/Mobile number." };
    }

    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpState({
      memberId: member.id,
      email: member.email,
      otp: generatedOTP
    });

    // Dispatch real email via muthurasu6319@gmail.com
    sendRealOTPEmail({
      toEmail: member.email,
      otpCode: generatedOTP,
      memberName: member.name
    });

    return {
      success: true,
      otp: generatedOTP,
      email: member.email,
      message: `Real OTP (${generatedOTP}) sent successfully to ${member.email} via JSA Finance Gmail!`
    };
  };

  const resetMemberPasswordWithOTP = (userOTP, newPassword) => {
    if (!otpState || otpState.otp !== userOTP) {
      return { success: false, message: "Invalid OTP entered. Please try again." };
    }

    setMembersList(prev => prev.map(m => {
      if (m.id === otpState.memberId) {
        return { ...m, password: newPassword };
      }
      return m;
    }));

    setOtpState(null);
    return { success: true, message: "Password reset successfully! You can now log in with your new password." };
  };

  // Central Payment Ledger Sync Methods + Auto Receipt & Email Notification Dispatch
  const markPaymentAsPaid = (paymentId, paymentMode = 'UPI') => {
    let targetPayment = null;
    const newReceiptNo = `JSA-RCP-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowTimestamp = new Date().toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });

    // 1. Update Payments Ledger State
    setPaymentsList(prev => prev.map(p => {
      if (p.id === paymentId) {
        targetPayment = {
          ...p,
          paid: p.dueAmount,
          balance: 0,
          status: "Paid",
          paymentDate: nowTimestamp,
          paymentMethod: paymentMode,
          receiptNo: newReceiptNo
        };
        return targetPayment;
      }
      return p;
    }));

    if (!targetPayment) return;

    // Find member for email receipt dispatch
    const targetMember = membersList.find(
      m => m.id === targetPayment.memberId || m.name.toLowerCase() === targetPayment.member.toLowerCase()
    );
    const memberEmail = targetMember?.email || `${targetPayment.member.toLowerCase().replace(/\s+/g, '')}@gmail.com`;

    // 2. Sync to Member Profile (Payment History & Member Status)
    setMembersList(prev => prev.map(m => {
      if (m.id === targetPayment.memberId || m.name.toLowerCase() === targetPayment.member.toLowerCase()) {
        const existingHistory = m.paymentHistory || [];
        const alreadyInHistory = existingHistory.some(ph => ph.seettu.toLowerCase() === targetPayment.seettu.toLowerCase() && ph.month === targetPayment.month);

        let updatedHistory = [];
        if (alreadyInHistory) {
          updatedHistory = existingHistory.map(ph => {
            if (ph.seettu.toLowerCase() === targetPayment.seettu.toLowerCase()) {
              return {
                ...ph,
                amount: `₹${formatIndianCurrency(targetPayment.dueAmount)}`,
                date: nowTimestamp,
                method: paymentMode,
                status: "Paid",
                receiptNo: newReceiptNo
              };
            }
            return ph;
          });
        } else {
          updatedHistory = [
            ...existingHistory,
            {
              seettu: targetPayment.seettu,
              amount: `₹${formatIndianCurrency(targetPayment.dueAmount)}`,
              date: nowTimestamp,
              method: paymentMode,
              status: "Paid",
              receiptNo: newReceiptNo
            }
          ];
        }

        const hasPending = updatedHistory.some(ph => ph.status === 'Pending');

        return {
          ...m,
          status: hasPending ? 'Pending' : 'Active',
          paymentHistory: updatedHistory
        };
      }
      return m;
    }));

    // 3. Sync to Chit Group (Seettu) Totals & Roster
    setSeettuList(prev => prev.map(s => {
      if (s.name.toLowerCase() === targetPayment.seettu.toLowerCase()) {
        const updatedCollected = (s.collected || 0) + targetPayment.dueAmount;
        const updatedPending = Math.max(0, (s.pending || 0) - targetPayment.dueAmount);

        const updatedRoster = (s.membersList || []).map(rm => {
          if (rm.name.toLowerCase() === targetPayment.member.toLowerCase() || rm.id === targetPayment.memberId) {
            return {
              ...rm,
              status: "Paid",
              paidAmount: `₹${formatIndianCurrency(targetPayment.dueAmount)}`
            };
          }
          return rm;
        });

        return {
          ...s,
          collected: updatedCollected,
          pending: updatedPending,
          membersList: updatedRoster
        };
      }
      return s;
    }));

    // 4. Trigger Automatic Receipt & Real Email Dispatch
    setCurrentReceipt({
      receiptNo: newReceiptNo,
      memberName: targetPayment.member,
      memberEmail: memberEmail,
      seettuName: targetPayment.seettu,
      amount: targetPayment.dueAmount,
      date: nowTimestamp,
      method: paymentMode,
      status: "Paid",
      emailSent: true
    });

    // Send Real Receipt Email via muthurasu6319@gmail.com
    sendRealReceiptEmail({
      toEmail: memberEmail,
      receiptNo: newReceiptNo,
      memberName: targetPayment.member,
      seettuName: targetPayment.seettu,
      amount: `₹${formatIndianCurrency(targetPayment.dueAmount)}`,
      date: nowTimestamp,
      method: paymentMode
    });

    // Send PWA Native Push Notification
    sendAppNotification(
      "Payment Receipt Issued",
      `Receipt #${newReceiptNo} issued for ${targetPayment.member} (${targetPayment.seettu}) - Paid ₹${formatIndianCurrency(targetPayment.dueAmount)}`
    );
  };

  const addPayment = (newPayment) => {
    setPaymentsList(prev => [newPayment, ...prev]);

    if (newPayment.status === 'Paid') {
      setSeettuList(prev => prev.map(s => {
        if (s.name.toLowerCase() === newPayment.seettu.toLowerCase()) {
          return {
            ...s,
            collected: (s.collected || 0) + newPayment.paid,
            pending: Math.max(0, (s.pending || 0) - newPayment.paid)
          };
        }
        return s;
      }));
    }
  };

  const updatePayment = (updatedPayment) => {
    let oldPayment = null;
    setPaymentsList(prev => prev.map(p => {
      if (p.id === updatedPayment.id) {
        oldPayment = p;
        return updatedPayment;
      }
      return p;
    }));

    if (!oldPayment) return;
    const paidDiff = updatedPayment.paid - oldPayment.paid;

    setMembersList(prev => prev.map(m => {
      if (m.id === updatedPayment.memberId || m.name.toLowerCase() === updatedPayment.member.toLowerCase()) {
        const updatedHistory = m.paymentHistory.map(ph => {
          if (ph.seettu.toLowerCase() === updatedPayment.seettu.toLowerCase()) {
            return {
              ...ph,
              amount: `₹${formatIndianCurrency(updatedPayment.paid)}`,
              status: updatedPayment.status,
              method: updatedPayment.paymentMethod,
              receiptNo: updatedPayment.receiptNo
            };
          }
          return ph;
        });
        return { ...m, paymentHistory: updatedHistory };
      }
      return m;
    }));

    setSeettuList(prev => prev.map(s => {
      if (s.name.toLowerCase() === updatedPayment.seettu.toLowerCase()) {
        return {
          ...s,
          collected: Math.max(0, (s.collected || 0) + paidDiff),
          pending: Math.max(0, (s.pending || 0) - paidDiff)
        };
      }
      return s;
    }));
  };

  const deletePayment = (paymentId) => {
    let deletedPayment = null;
    setPaymentsList(prev => {
      deletedPayment = prev.find(p => p.id === paymentId);
      return prev.filter(p => p.id !== paymentId);
    });

    if (!deletedPayment) return;

    setMembersList(prev => prev.map(m => {
      if (m.id === deletedPayment.memberId || m.name.toLowerCase() === deletedPayment.member.toLowerCase()) {
        return {
          ...m,
          paymentHistory: m.paymentHistory.filter(ph => !(ph.seettu.toLowerCase() === deletedPayment.seettu.toLowerCase() && ph.month === deletedPayment.month))
        };
      }
      return m;
    }));

    setSeettuList(prev => prev.map(s => {
      if (s.name.toLowerCase() === deletedPayment.seettu.toLowerCase()) {
        return {
          ...s,
          collected: Math.max(0, (s.collected || 0) - deletedPayment.paid),
          pending: (s.pending || 0) + deletedPayment.paid
        };
      }
      return s;
    }));
  };

  return (
    <SeettuContext.Provider value={{ 
      seettuList, 
      setSeettuList, 
      addSeettu, 
      updateSeettu, 
      deleteSeettu, 
      membersList, 
      setMembersList, 
      addMember,
      updateMember,
      deleteMember,
      paymentsList,
      setPaymentsList,
      markPaymentAsPaid,
      addPayment,
      updatePayment,
      deletePayment,
      currentReceipt,
      setCurrentReceipt,
      sendForgotPasswordOTP,
      resetMemberPasswordWithOTP,
      activeMember,
      setActiveMember,
      loginMember,
      logoutMember
    }}>
      {children}
    </SeettuContext.Provider>
  );
}

export function useSeettu() {
  const context = useContext(SeettuContext);
  if (!context) {
    throw new Error('useSeettu must be used within a SeettuProvider');
  }
  return context;
}
