import React from 'react';
import { Search, Filter, LayoutGrid, List } from 'lucide-react';

export default function SearchFilterBar({ 
  searchQuery, 
  setSearchQuery, 
  selectedDiagnosis, 
  setSelectedDiagnosis, 
  diagnosesList,
  viewMode,
  setViewMode
}) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      {/* Search Input */}
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by patient name, diagnosis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
        {/* Diagnosis Filter */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={selectedDiagnosis}
            onChange={(e) => setSelectedDiagnosis(e.target.value)}
            className="bg-transparent focus:outline-none text-slate-700 font-medium text-xs sm:text-sm cursor-pointer"
          >
            <option value="">All Diagnoses ({diagnosesList.length})</option>
            {diagnosesList.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* View Toggle (Grid / Table) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('table')}
            title="Table View"
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'table' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            title="Grid View"
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'grid' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
