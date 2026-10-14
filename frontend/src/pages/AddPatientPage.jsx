import React, { useState } from 'react';
import { UserPlus, Calendar, Activity, User, CheckCircle2, ArrowLeft, HeartPulse } from 'lucide-react';
import { createPatient } from '../services/api';
import Alert from '../components/common/Alert';

export default function AddPatientPage({ onNavigate, onPatientAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    admission_date: new Date().toISOString().split('T')[0],
    discharge_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    diagnosis: '',
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type, message }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    if (!formData.name.trim()) {
      setAlert({ type: 'error', message: 'Patient full name is required.' });
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        age: formData.age ? parseInt(formData.age, 10) : null,
        gender: formData.gender || null,
        admission_date: formData.admission_date || null,
        discharge_date: formData.discharge_date || null,
        diagnosis: formData.diagnosis.trim() || null,
      };

      const created = await createPatient(payload);
      setAlert({
        type: 'success',
        message: `Patient "${created.name}" (ID #${created.id}) successfully added to directory!`,
      });

      // Reset form
      setFormData({
        name: '',
        age: '',
        gender: 'Male',
        admission_date: new Date().toISOString().split('T')[0],
        discharge_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        diagnosis: '',
      });

      if (onPatientAdded) {
        onPatientAdded(created);
      }

      // Automatically redirect after 1.5 seconds
      setTimeout(() => {
        onNavigate('patients');
      }, 1500);

    } catch (err) {
      console.error('Error adding patient:', err);
      setAlert({
        type: 'error',
        message: err.response?.data?.detail || 'Failed to create patient record. Please check backend API server.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Back button */}
      <button
        onClick={() => onNavigate('patients')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Patients Directory
      </button>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Register New Patient</h1>
            <p className="text-xs text-slate-500">Fill in patient details to initiate discharge tracking</p>
          </div>
        </div>

        {alert && <div className="mt-4"><Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} /></div>}

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. John Doe, Sarah Jenkins"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-800 font-medium"
              />
            </div>
          </div>

          {/* Age & Gender Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Age (Years)
              </label>
              <input
                type="number"
                name="age"
                min="0"
                max="120"
                placeholder="e.g. 45"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-800 font-medium cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other / Non-Binary</option>
              </select>
            </div>
          </div>

          {/* Clinical Diagnosis */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Primary Diagnosis / Clinical Notes
            </label>
            <div className="relative">
              <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="diagnosis"
                placeholder="e.g. Type 2 Diabetes, Acute Bronchitis, Post-Op Knee Replacement"
                value={formData.diagnosis}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-800 font-medium"
              />
            </div>
          </div>

          {/* Admission & Discharge Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Admission Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  name="admission_date"
                  value={formData.admission_date}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-800 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Target Discharge Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  name="discharge_date"
                  value={formData.discharge_date}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-800 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onNavigate('patients')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {loading ? 'Creating Record...' : 'Save Patient Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
