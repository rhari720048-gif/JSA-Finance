import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatIndianCurrency } from '../utils/formatCurrency';
import { sendRealOTPEmail, sendRealReceiptEmail, sendRealWelcomeEmail, sendRealChitEnrollmentEmail } from '../utils/emailService';
import { sendAppNotification } from '../utils/notificationService';

const API_BASE = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? '/api'
  : 'http://localhost:5000/api';

const SeettuContext = createContext();

export function SeettuProvider({ children }) {
  // Clean Initial States
  const [seettuList, setSeettuList] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);

  // Load initial data from TiDB Cloud MySQL Database
  const refreshDatabaseData = () => {
    fetch(`${API_BASE}/bootstrap-data`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (data.seettuList && data.seettuList.length > 0) setSeettuList(data.seettuList);
          if (data.membersList && data.membersList.length > 0) setMembersList(data.membersList);
          if (data.paymentsList && data.paymentsList.length > 0) setPaymentsList(data.paymentsList);
        }
      })
      .catch(err => console.log('MySQL Database sync notice:', err.message));
  };

  useEffect(() => {
    refreshDatabaseData();
    const interval = setInterval(refreshDatabaseData, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  // Persistent Active Member session state
  const [activeMember, setActiveMember] = useState(() => {
    try {
      const saved = localStorage.getItem('jsa_active_member');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Keep activeMember in sync with live membersList updates
  useEffect(() => {
    if (activeMember && membersList.length > 0) {
      const liveProfile = membersList.find(m => m.id === activeMember.id);
      if (liveProfile && JSON.stringify(activeMember) !== JSON.stringify(liveProfile)) {
        setActiveMember(liveProfile);
        localStorage.setItem('jsa_active_member', JSON.stringify(liveProfile));
      }
    }
  }, [membersList, activeMember]);

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
    localStorage.setItem('jsa_active_member', JSON.stringify(member));
    return { success: true, member };
  };

  const logoutMember = () => {
    setActiveMember(null);
    localStorage.removeItem('jsa_active_member');
  };

  // Active Receipt Modal Popup state for automatic Receipt & Email notification display
  const [currentReceipt, setCurrentReceipt] = useState(null);

  // OTP State for Forgot Password flow
  const [otpState, setOtpState] = useState(null);

  // Seettu CRUD
  const addSeettu = (newScheme) => {
    setSeettuList(prev => [newScheme, ...prev]);

    // Persist to TiDB Cloud MySQL
    fetch(`${API_BASE}/seettu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newScheme)
    }).then(() => refreshDatabaseData()).catch(err => console.error('MySQL scheme insert error:', err));

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
    const schemeToDelete = seettuList.find(s => s.id === schemeId);
    if (!schemeToDelete) return;

    const schemeName = schemeToDelete.name;

    // 1. Remove from Seettu List
    setSeettuList(prev => prev.filter(item => item.id !== schemeId));

    // 2. Remove from Members List (seettuDetails & paymentHistory)
    setMembersList(prev => prev.map(m => {
      return {
        ...m,
        seettuDetails: (m.seettuDetails || []).filter(s => s.name !== schemeName),
        paymentHistory: (m.paymentHistory || []).filter(ph => ph.seettu !== schemeName)
      };
    }));

    // 3. Remove from Payments List
    setPaymentsList(prev => prev.filter(p => p.seettu !== schemeName));

    // 4. Delete from TiDB Cloud MySQL
    fetch(`${API_BASE}/seettu/${schemeId}`, {
      method: 'DELETE'
    }).catch(err => console.error('MySQL delete seettu error:', err));
  };

  // Member CRUD with Credentials (ID, Mobile, Email, Password)
  const addMember = (newMember) => {
    const formattedMember = {
      ...newMember,
      password: newMember.password || 'member@123',
      paymentHistory: newMember.paymentHistory || []
    };

    setMembersList(prev => [formattedMember, ...prev]);

    // Persist to TiDB Cloud MySQL
    fetch(`${API_BASE}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedMember)
    }).then(() => refreshDatabaseData()).catch(err => console.error('MySQL member insert error:', err));

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
    const oldMember = membersList.find(m => m.id === updatedMember.id);
    const oldSeettuNames = (oldMember?.seettuDetails || []).map(s => s.name);
    const newSeettuNames = (updatedMember.seettuDetails || []).map(s => s.name);
    
    const newSeettus = (updatedMember.seettuDetails || []).filter(s => !oldSeettuNames.includes(s.name));
    const removedSeettuNames = oldSeettuNames.filter(name => !newSeettuNames.includes(name));

    setMembersList(prev => prev.map(item => item.id === updatedMember.id ? updatedMember : item));
    
    // Process new scheme enrollments added during edit
    newSeettus.forEach(sDetail => {
      const schemeObj = seettuList.find(s => s.name === sDetail.name || s.id === sDetail.id);
      const due = schemeObj ? schemeObj.monthly : 2000;
      
      // Send App Notification
      sendAppNotification(
        "New Scheme Enrollment",
        `You have been successfully added to the ${sDetail.name} scheme.`
      );

      // Send Email Notification
      if (updatedMember.email) {
        sendRealChitEnrollmentEmail({
          toEmail: updatedMember.email,
          memberName: updatedMember.name,
          seettuName: sDetail.name,
          amount: `₹${formatIndianCurrency(due)}`,
          frequency: sDetail.frequency || 'Monthly',
          poolTarget: 'Guaranteed Payout'
        });
      }

      // Add to Chit Group roster
      if (schemeObj) {
        setSeettuList(prevList => prevList.map(s => {
          if (s.id === schemeObj.id || s.name === schemeObj.name) {
            const existingMembers = s.membersList || [];
            const alreadyExists = existingMembers.some(rm => rm.name === updatedMember.name || rm.id === updatedMember.id);
            if (!alreadyExists) {
              return {
                ...s,
                membersList: [
                  ...existingMembers,
                  { id: updatedMember.id, name: updatedMember.name, status: "Pending", paidAmount: "₹0" }
                ]
              };
            }
          }
          return s;
        }));
      }

      // Create initial payment ledger
      const newPayItem = {
        id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
        member: updatedMember.name,
        memberId: updatedMember.id,
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
    });

    // 1. Update basic member details
    fetch(`${API_BASE}/members/${updatedMember.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedMember)
    }).catch(err => console.error('MySQL member update error:', err));

    // 2. Persist newly added chits to MySQL Database mappings and payments table
    if (newSeettus.length > 0) {
      fetch(`${API_BASE}/members/${updatedMember.id}/seettu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seettuDetails: newSeettus, memberName: updatedMember.name })
      }).catch(err => console.error('MySQL map new seettu error:', err));
    }

    // 3. Process removed scheme enrollments
    if (removedSeettuNames.length > 0) {
      // Remove from global payments list
      setPaymentsList(prev => prev.filter(p => !(p.memberId === updatedMember.id && removedSeettuNames.includes(p.seettu))));
      
      // Remove from global seettu roster
      setSeettuList(prevList => prevList.map(s => {
        if (removedSeettuNames.includes(s.name)) {
          return {
            ...s,
            membersList: (s.membersList || []).filter(m => m.id !== updatedMember.id)
          };
        }
        return s;
      }));

      // Delete from backend MySQL Database
      fetch(`${API_BASE}/members/${updatedMember.id}/seettu`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seettuNames: removedSeettuNames })
      }).catch(err => console.error('MySQL delete seettu mapping error:', err));
    }
  };

  const deleteMember = (memberId) => {
    setMembersList(prev => prev.filter(item => item.id !== memberId));
    setPaymentsList(prev => prev.filter(p => p.memberId !== memberId));
    fetch(`${API_BASE}/members/${memberId}`, {
      method: 'DELETE'
    }).catch(err => console.error('MySQL member delete error:', err));
  };

  // Change Member Password with Current Password Validation
  const changeMemberPassword = (memberId, oldPassword, newPassword) => {
    const member = membersList.find(m => m.id === memberId);
    if (!member) {
      return { success: false, message: "Member account not found." };
    }

    if (member.password && member.password !== oldPassword) {
      return { success: false, message: "Incorrect current password entered. Please enter your correct old password." };
    }

    const updatedMember = { ...member, password: newPassword };

    setMembersList(prev => prev.map(m => m.id === memberId ? updatedMember : m));

    if (activeMember && (activeMember.id === memberId || activeMember.mobile === member.mobile)) {
      setActiveMember(updatedMember);
      localStorage.setItem('jsa_active_member', JSON.stringify(updatedMember));
    }

    // Persist to MySQL database
    fetch(`${API_BASE}/members/${memberId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedMember)
    }).catch(err => console.error('MySQL password change error:', err));

    return { success: true, message: "Password updated successfully!" };
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

    const memberToUpdate = membersList.find(m => m.id === otpState.memberId || m.email?.toLowerCase() === otpState.email?.toLowerCase());

    if (memberToUpdate) {
      const updatedMember = { ...memberToUpdate, password: newPassword };

      setMembersList(prev => prev.map(m => (m.id === memberToUpdate.id || m.mobile === memberToUpdate.mobile) ? updatedMember : m));

      if (activeMember && (activeMember.id === memberToUpdate.id || activeMember.mobile === memberToUpdate.mobile)) {
        setActiveMember(updatedMember);
        localStorage.setItem('jsa_active_member', JSON.stringify(updatedMember));
      }

      // Persist new password to TiDB Cloud MySQL database immediately!
      fetch(`${API_BASE}/members/${memberToUpdate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMember)
      }).catch(err => console.error('MySQL OTP reset password error:', err));
    }

    setOtpState(null);
    return { success: true, message: "Password reset successfully! Logging in now requires your new password." };
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

    // Persist Payment Paid status to TiDB Cloud MySQL
    fetch(`${API_BASE}/payments/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, paymentMode })
    }).then(() => refreshDatabaseData()).catch(err => console.error('MySQL payment pay error:', err));

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
  };

  const updatePayment = (updatedPayment) => {
    setPaymentsList(prev => prev.map(p => p.id === updatedPayment.id ? updatedPayment : p));
  };

  const deletePayment = (paymentId) => {
    setPaymentsList(prev => prev.filter(p => p.id !== paymentId));
    fetch(`${API_BASE}/payments/${paymentId}`, {
      method: 'DELETE'
    }).catch(err => console.error('MySQL payment delete error:', err));
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
      logoutMember,
      changeMemberPassword,
      refreshDatabaseData
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
