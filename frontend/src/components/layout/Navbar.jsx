import React, { useState, useEffect } from 'react';
import { Activity, Users, UserPlus, LayoutDashboard, HeartPulse, CheckCircle2, AlertTriangle } from 'lucide-react';
import { checkApiHealth } from '../../services/api';

export default function Navbar({ activeTab, setActiveTab, selectedPatientId }) {
  const [apiOnline, setApiOnline] = useState(null);

  useEffect(() => {
    const verifyHealth = async () => {
      const res = await checkApiHealth();
      setApiOnline(res.success);
    };
    verifyHealth();
    const interval = setInterval(verifyHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients List', icon: Users },
    { id: 'add-patient', label: 'Add Patient', icon: UserPlus },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-800 tracking-tight flex items-center gap-1.5">
                CareDischarge <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-teal-200">AI</span>
              </span>
              <p className="text-xs text-slate-500 hidden sm:block">Hospital Discharge Assistant</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id && !selectedPatientId;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* API Status Badge */}
          <div className="hidden md:flex items-center">
            {apiOnline === true && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 mr-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                Backend Online
              </span>
            )}
            {apiOnline === false && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-500" />
                Backend Offline
              </span>
            )}
            {apiOnline === null && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                Checking connection...
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
