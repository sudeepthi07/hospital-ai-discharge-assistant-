import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import AddPatientPage from './pages/AddPatientPage';
import PatientDetailPage from './pages/PatientDetailPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    setSelectedPatientId(null);
  };

  const handleSelectPatient = (id) => {
    setSelectedPatientId(id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased selection:bg-teal-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleNavigate}
        selectedPatientId={selectedPatientId}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedPatientId ? (
          <PatientDetailPage
            patientId={selectedPatientId}
            onBack={() => setSelectedPatientId(null)}
          />
        ) : activeTab === 'dashboard' ? (
          <DashboardPage
            onNavigate={handleNavigate}
            onSelectPatient={handleSelectPatient}
          />
        ) : activeTab === 'patients' ? (
          <PatientsPage
            onNavigate={handleNavigate}
            onSelectPatient={handleSelectPatient}
          />
        ) : activeTab === 'add-patient' ? (
          <AddPatientPage
            onNavigate={handleNavigate}
            onPatientAdded={() => {
              // Optionally handle post-creation event
            }}
          />
        ) : null}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
