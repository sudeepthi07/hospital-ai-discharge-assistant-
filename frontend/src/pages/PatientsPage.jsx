import React, { useState, useEffect } from 'react';
import { Users, UserPlus, RefreshCw, AlertCircle } from 'lucide-react';
import { getPatients } from '../services/api';
import SearchFilterBar from '../components/patients/SearchFilterBar';
import PatientTable from '../components/patients/PatientTable';
import PatientCard from '../components/patients/PatientCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Alert from '../components/common/Alert';

export default function PatientsPage({ onNavigate, onSelectPatient }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  const fetchPatientsList = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      console.error('Failed to load patients list:', err);
      setError('Failed to fetch patient records from http://127.0.0.1:8000. Is FastAPI server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientsList();
  }, []);

  // Unique list of diagnoses for filter dropdown
  const diagnosesList = Array.from(
    new Set(patients.map((p) => p.diagnosis).filter(Boolean))
  );

  // Filter logic
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiagnosis =
      !selectedDiagnosis || patient.diagnosis === selectedDiagnosis;
    return matchesSearch && matchesDiagnosis;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-teal-600" />
            Patient Directory
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage patient records, diagnoses, and view discharge summaries
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPatientsList}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-xs"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => onNavigate('add-patient')}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Add Patient
          </button>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Search & Filter Controls */}
      <SearchFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDiagnosis={selectedDiagnosis}
        setSelectedDiagnosis={setSelectedDiagnosis}
        diagnosesList={diagnosesList}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Patients Display Area */}
      {loading ? (
        <LoadingSpinner message="Fetching patient directory..." />
      ) : filteredPatients.length === 0 ? (
        patients.length === 0 ? (
          <EmptyState
            title="No patients registered yet"
            description="Start building your hospital patient directory by creating your first patient record."
            actionText="Add New Patient"
            onAction={() => onNavigate('add-patient')}
            icon={Users}
          />
        ) : (
          <EmptyState
            title="No matching records found"
            description={`No patients matched your search for "${searchQuery || selectedDiagnosis}". Try clearing your filters.`}
            actionText="Clear Search"
            onAction={() => {
              setSearchQuery('');
              setSelectedDiagnosis('');
            }}
            icon={AlertCircle}
          />
        )
      ) : viewMode === 'table' ? (
        <PatientTable patients={filteredPatients} onSelectPatient={onSelectPatient} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} onSelectPatient={onSelectPatient} />
          ))}
        </div>
      )}
    </div>
  );
}
