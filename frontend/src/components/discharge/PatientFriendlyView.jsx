import React from 'react';
import { Pill, Calendar, Heart, ShieldAlert, CheckCircle, Printer, ArrowLeft, Sparkles, User, Info } from 'lucide-react';

export default function PatientFriendlyView({ patient, summary, onBack }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gradient-to-b from-teal-50/50 to-white rounded-3xl border border-teal-100 p-6 sm:p-10 shadow-lg my-4 space-y-8 print:p-0 print:border-none print:shadow-none">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-teal-200/60 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-600 text-white mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" /> Simplified Patient View
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Your Discharge Summary & Care Plan
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Easy-to-understand instructions prepared specially for <strong className="text-teal-900">{patient?.name}</strong>
          </p>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Clinical View
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 font-medium text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-teal-600/20"
          >
            <Printer className="w-4 h-4" /> Print Instructions
          </button>
        </div>
      </div>

      {/* Patient Info Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg">
            {patient?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">{patient?.name}</h3>
            <p className="text-xs text-slate-500">
              Age: {patient?.age || 'N/A'} &bull; Gender: {patient?.gender || 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-600">
          <div>
            <span className="block text-xs text-slate-400">Diagnosis</span>
            <span className="font-semibold text-slate-800">{patient?.diagnosis || 'General Care'}</span>
          </div>
          <div>
            <span className="block text-xs text-slate-400">Discharge Date</span>
            <span className="font-semibold text-teal-700">{patient?.discharge_date || 'Today'}</span>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      {summary?.summary_text && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Heart className="w-5 h-5 text-teal-600 fill-teal-100" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">What You Need to Know</h3>
          </div>
          <p className="text-slate-700 text-base leading-relaxed bg-slate-50/60 p-4 rounded-xl border border-slate-100 whitespace-pre-line">
            {summary.summary_text}
          </p>
        </div>
      )}

      {/* Medications Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Pill className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Your Prescription & Medications</h3>
            <p className="text-xs text-slate-500">Take these exactly as prescribed by your healthcare team</p>
          </div>
        </div>
        
        {summary?.medications ? (
          <div className="bg-sky-50/50 p-5 rounded-xl border border-sky-100 text-slate-800 font-medium text-base leading-relaxed whitespace-pre-line">
            {summary.medications}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">No specific medications listed on file.</p>
        )}
      </div>

      {/* Follow-up & Next Steps */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Follow-up Appointments & Steps</h3>
            <p className="text-xs text-slate-500">Important dates and instructions for your recovery</p>
          </div>
        </div>

        {summary?.follow_up_instructions ? (
          <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 text-slate-800 font-medium text-base leading-relaxed whitespace-pre-line">
            {summary.follow_up_instructions}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">No follow-up instructions specified.</p>
        )}
      </div>

      {/* Warning Box */}
      <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-6 flex items-start gap-4">
        <ShieldAlert className="w-8 h-8 text-rose-600 shrink-0 mt-1" />
        <div>
          <h4 className="text-lg font-bold text-rose-900 mb-1">When to Call Your Doctor or Emergency</h4>
          <p className="text-sm text-rose-800 leading-relaxed">
            If you experience severe pain, difficulty breathing, high fever (above 101°F / 38.3°C), or sudden worsening of your condition, contact the hospital helpline or go to the nearest emergency room immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
