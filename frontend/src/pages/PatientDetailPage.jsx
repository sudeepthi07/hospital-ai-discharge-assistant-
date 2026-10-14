import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Calendar, Activity, FilePlus, Pill, FileText, Sparkles, RefreshCw, Eye } from 'lucide-react';
import { getPatients, getPatientSummaries } from '../services/api';
import AddSummaryModal from '../components/discharge/AddSummaryModal';
import PatientFriendlyView from '../components/discharge/PatientFriendlyView';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Alert from '../components/common/Alert';

export default function PatientDetailPage({ patientId, onBack }) {
  const [patient, setPatient] = useState(null);
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientViewMode, setPatientViewMode] = useState(false);

  const fetchPatientAndSummaries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch list of patients to find matching patient
      const allPatients = await getPatients();
      const currentPatient = allPatients.find((p) => p.id === parseInt(patientId, 10));

      if (!currentPatient) {
        setError(`Patient record #${patientId} not found.`);
        setLoading(false);
        return;
      }

      setPatient(currentPatient);

      // Fetch summaries for patient
      const summaryList = await getPatientSummaries(patientId);
      setSummaries(summaryList);
    } catch (err) {
      console.error('Error fetching patient details:', err);
      setError('Could not retrieve patient data from FastAPI backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPatientAndSummaries();
    }
  }, [patientId]);

  const handleSummaryAdded = (newSummary) => {
    setSummaries((prev) => [newSummary, ...prev]);
  };

  if (loading) {
    return <LoadingSpinner message="Loading patient clinical profile & discharge history..." />;
  }

  if (error || !patient) {
    return (
      <div className="space-y-4 max-w-xl mx-auto py-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Patients List
        </button>
        <Alert type="error" message={error || 'Patient profile unavailable.'} />
      </div>
    );
  }

  // If Patient View Mode is active, render PatientFriendlyView
  if (patientViewMode) {
    const latestSummary = summaries[0] || null;
    return (
      <PatientFriendlyView
        patient={patient}
        summary={latestSummary}
        onBack={() => setPatientViewMode(false)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Patients Directory
        </button>

        <button
          onClick={() => setPatientViewMode(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Switch to Patient-Friendly View
        </button>
      </div>

      {/* Patient Demographic Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-2xl border border-teal-200 shadow-xs">
              {patient.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{patient.name}</h1>
                <span className="bg-slate-100 text-slate-600 font-mono text-xs px-2.5 py-1 rounded-lg border border-slate-200 font-semibold">
                  ID #{patient.id}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                <span>Age: <strong className="text-slate-700">{patient.age ? `${patient.age} yrs` : 'N/A'}</strong></span>
                &bull;
                <span>Gender: <strong className="text-slate-700 capitalize">{patient.gender || 'N/A'}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 min-w-[130px]">
              <span className="text-slate-400 block mb-0.5">Clinical Diagnosis</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-teal-600" />
                {patient.diagnosis || 'General Clinical'}
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 min-w-[130px]">
              <span className="text-slate-400 block mb-0.5">Admission Date</span>
              <span className="font-semibold text-slate-700">{patient.admission_date || '—'}</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 min-w-[130px]">
              <span className="text-slate-400 block mb-0.5">Discharge Date</span>
              <span className="font-semibold text-teal-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {patient.discharge_date || 'Pending'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Discharge Summaries Header & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            Discharge Summaries ({summaries.length})
          </h2>
          <p className="text-xs text-slate-500">Medical notes, prescribed medications, and follow-up care plan</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <FilePlus className="w-4 h-4" />
          Add Discharge Summary
        </button>
      </div>

      {/* Summaries List */}
      {summaries.length === 0 ? (
        <EmptyState
          title="No Discharge Summaries Recorded"
          description="Click 'Add Discharge Summary' to record clinical summary, medications, and follow-up care instructions."
          actionText="Add Discharge Summary"
          onAction={() => setIsModalOpen(true)}
          icon={FileText}
        />
      ) : (
        <div className="space-y-5">
          {summaries.map((summary, idx) => (
            <div
              key={summary.id || idx}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5 hover:border-teal-200 transition-colors"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <span className="bg-teal-50 text-teal-800 text-xs font-bold px-3 py-1 rounded-full border border-teal-200">
                  Summary #{summaries.length - idx}
                </span>
                <span className="text-xs font-mono text-slate-400">Record ID: #{summary.id}</span>
              </div>

              {/* Summary Text */}
              {summary.summary_text && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-teal-600" /> Clinical Notes
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-line">
                    {summary.summary_text}
                  </p>
                </div>
              )}

              {/* Medications */}
              {summary.medications && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-sky-600" /> Prescribed Medications
                  </h4>
                  <div className="text-sm text-slate-800 leading-relaxed bg-sky-50/50 p-4 rounded-xl border border-sky-100 whitespace-pre-line">
                    {summary.medications}
                  </div>
                </div>
              )}

              {/* Follow-up Instructions */}
              {summary.follow_up_instructions && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Follow-up Instructions
                  </h4>
                  <div className="text-sm text-slate-800 leading-relaxed bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 whitespace-pre-line">
                    {summary.follow_up_instructions}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Summary Modal */}
      {isModalOpen && (
        <AddSummaryModal
          patient={patient}
          onClose={() => setIsModalOpen(false)}
          onSummaryAdded={handleSummaryAdded}
        />
      )}
    </div>
  );
}
