import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { SeettuProvider } from './context/SeettuContext';
import ReceiptModal from './components/common/ReceiptModal';

// Public Landing Page Components
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TrustStats from './components/TrustStats';
import SeettuPlansLanding from './components/SeettuPlans';
import HowItWorks from './components/HowItWorks';
import PaymentTransparency from './components/PaymentTransparency';
import LatePaymentInfo from './components/LatePaymentInfo';
import Benefits from './components/Benefits';
import MaturitySection from './components/MaturitySection';
import AboutSection from './components/AboutSection';
import FAQ from './components/FAQ';
import ContactSection from './components/ContactSection';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminSeettu from './components/admin/AdminSeettu';
import AdminMembers from './components/admin/AdminMembers';
import AdminPayments from './components/admin/AdminPayments';
import AdminReports from './components/admin/AdminReports';
import AdminSettings from './components/admin/AdminSettings';
import ComingSoonPage from './components/admin/ComingSoonPage';

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <TrustStats />
        <SeettuPlansLanding />
        <HowItWorks />
        <PaymentTransparency />
        <LatePaymentInfo />
        <Benefits />
        <MaturitySection />
        <AboutSection />
        <FAQ />
        <ContactSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <SeettuProvider>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Admin Panel Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="chit-groups" element={<AdminSeettu />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route 
            path="*" 
            element={
              <ComingSoonPage 
                title="Module Coming Soon" 
                icon={Sparkles} 
                description="This page is under construction and will be available soon." 
              />
            } 
          />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Auto Receipt & Email Notification Modal */}
      <ReceiptModal />
    </SeettuProvider>
  );
}

export default App;
