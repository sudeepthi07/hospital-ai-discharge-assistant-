import React from 'react';
import { Calendar, User, Activity, ChevronRight, FileText } from 'lucide-react';

export default function PatientCard({ patient, onSelectPatient }) {
  return (
    <div 
      onClick={() => onSelectPatient(patient.id)}
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm border border-teal-100 shadow-xs">
              {patient.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                {patient.name}
              </h4>
              <p className="text-xs text-slate-500">
                Patient ID: #{patient.id} &bull; {patient.age ? `${patient.age} yrs` : 'N/A'} ({patient.gender || 'N/A'})
              </p>
            </div>
          </div>
        </div>

        <div className="my-3 py-2 px-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-xs">
          <Activity className="w-4 h-4 text-teal-600 shrink-0" />
          <span className="font-medium text-slate-700 truncate">
            {patient.diagnosis || 'General Clinical Record'}
          </span>
        </div>

        <div className="space-y-1.5 text-xs text-slate-500 mb-4">
          <div className="flex justify-between">
            <span>Admission:</span>
            <span className="font-medium text-slate-700">{patient.admission_date || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span>Discharge:</span>
            <span className="font-medium text-teal-700 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {patient.discharge_date || 'Pending'}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelectPatient(patient.id);
        }}
        className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 py-2.5 rounded-xl border border-teal-200 transition-all mt-auto"
      >
        <FileText className="w-4 h-4" />
        View Patient Record
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
