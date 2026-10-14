import React, { useState, useEffect } from 'react';
import { Users, FileText, UserPlus, Calendar, Activity, ArrowRight, HeartPulse, CheckCircle2 } from 'lucide-react';
import { getPatients } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';

export default function DashboardPage({ onNavigate, onSelectPatient }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getPatients();
        setPatients(data);
      } catch (err) {
        console.error('Failed to load patients for dashboard:', err);
        setError('Could not connect to FastAPI server. Ensure python backend is running at http://127.0.0.1:8000.');
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const totalPatients = patients.length;
  const recentPatients = patients.slice(-5).reverse();
  
  // Calculate quick stats
  const maleCount = patients.filter((p) => p.gender?.toLowerCase() === 'male').length;
  const femaleCount = patients.filter((p) => p.gender?.toLowerCase() === 'female').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <HeartPulse className="w-80 h-80" />
        </div>
        <div className="max-w-2xl relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-white/20">
            <Activity className="w-3.5 h-3.5" /> Care Management Dashboard
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
            AI Discharge Assistant
          </h1>
          <p className="text-teal-50 text-sm sm:text-base leading-relaxed">
            Streamlining hospital discharge procedures, clinical records, and generating easy-to-read instructions for patient aftercare.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => onNavigate('add-patient')}
              className="inline-flex items-center gap-2 bg-white text-teal-800 hover:bg-teal-50 text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <UserPlus className="w-4 h-4 text-teal-600" />
              Add New Patient
            </button>
            <button
              onClick={() => onNavigate('patients')}
              className="inline-flex items-center gap-2 bg-teal-800/40 hover:bg-teal-800/60 text-white border border-white/20 text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
            >
              <Users className="w-4 h-4" />
              View All Patients
            </button>
          </div>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Patients</p>
            <h3 className="text-2xl font-bold text-slate-900">{loading ? '...' : totalPatients}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Discharges Listed</p>
            <h3 className="text-2xl font-bold text-slate-900">{loading ? '...' : totalPatients}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Male / Female</p>
            <h3 className="text-xl font-bold text-slate-900">{loading ? '...' : `${maleCount} M / ${femaleCount} F`}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">System Status</p>
            <h3 className="text-base font-bold text-emerald-700">Ready & Active</h3>
          </div>
        </div>
      </div>

      {/* Recent Discharges Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Recent Patient Records</h2>
            <p className="text-xs text-slate-500">Latest patient admissions and planned discharge dates</p>
          </div>
          <button
            onClick={() => onNavigate('patients')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 hover:bg-teal-100 transition-all"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching dashboard metrics..." />
        ) : recentPatients.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">
            No patient records found yet. Click "Add New Patient" above to create your first entry.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => onSelectPatient(patient.id)}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-4 rounded-2xl transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm border border-teal-100">
                    {patient.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {patient.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Age {patient.age || 'N/A'} &bull; {patient.diagnosis || 'No Diagnosis'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-slate-500">Discharge: <strong className="text-slate-700">{patient.discharge_date || 'Pending'}</strong></span>
                  <span className="text-teal-700 font-semibold group-hover:underline flex items-center gap-0.5">
                    Details <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
