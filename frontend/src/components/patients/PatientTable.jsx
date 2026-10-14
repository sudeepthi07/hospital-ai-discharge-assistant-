import React from 'react';
import { Calendar, User, Activity, ChevronRight, FileText } from 'lucide-react';

export default function PatientTable({ patients, onSelectPatient }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-5">ID</th>
              <th className="py-3.5 px-5">Patient Name</th>
              <th className="py-3.5 px-5">Age / Gender</th>
              <th className="py-3.5 px-5">Diagnosis</th>
              <th className="py-3.5 px-5">Admission</th>
              <th className="py-3.5 px-5">Discharge Date</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {patients.map((patient) => (
              <tr 
                key={patient.id} 
                className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                onClick={() => onSelectPatient(patient.id)}
              >
                <td className="py-4 px-5 font-mono text-xs font-semibold text-slate-400">
                  #{patient.id}
                </td>
                <td className="py-4 px-5 font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs border border-teal-100">
                      {patient.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{patient.name}</span>
                  </div>
                </td>
                <td className="py-4 px-5 text-slate-600">
                  {patient.age ? `${patient.age} yrs` : 'N/A'} &bull;{' '}
                  <span className="capitalize">{patient.gender || 'Unspecified'}</span>
                </td>
                <td className="py-4 px-5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-800 border border-sky-100">
                    <Activity className="w-3 h-3 text-sky-600" />
                    {patient.diagnosis || 'General Checkup'}
                  </span>
                </td>
                <td className="py-4 px-5 text-slate-500 text-xs">
                  {patient.admission_date || '—'}
                </td>
                <td className="py-4 px-5 text-slate-700 font-medium text-xs">
                  <span className="inline-flex items-center gap-1 text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    {patient.discharge_date || 'Pending'}
                  </span>
                </td>
                <td className="py-4 px-5 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPatient(patient.id);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    View Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
