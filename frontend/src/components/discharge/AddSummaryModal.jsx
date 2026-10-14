import React, { useState } from 'react';
import { FilePlus, X, Pill, Calendar, FileText, Send, Sparkles } from 'lucide-react';
import { createDischargeSummary } from '../../services/api';
import Alert from '../common/Alert';

export default function AddSummaryModal({ patient, onClose, onSummaryAdded }) {
  const [summaryText, setSummaryText] = useState('');
  const [medications, setMedications] = useState('');
  const [followUpInstructions, setFollowUpInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        patient_id: patient.id,
        summary_text: summaryText.trim() || null,
        medications: medications.trim() || null,
        follow_up_instructions: followUpInstructions.trim() || null,
      };

      const newSummary = await createDischargeSummary(payload);
      onSummaryAdded(newSummary);
      onClose();
    } catch (err) {
      console.error('Failed to create summary:', err);
      setError(err.response?.data?.detail || 'Failed to submit discharge summary. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
              <FilePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">New Discharge Summary</h3>
              <p className="text-xs text-slate-500">For Patient: <span className="font-semibold text-teal-800">{patient.name}</span> (#{patient.id})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError(null)} /></div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Summary Text */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-600" />
              Clinical Summary / Notes
            </label>
            <textarea
              rows={4}
              required
              placeholder="e.g. Patient responded well to treatment. Stable vitals upon discharge..."
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-800"
            />
          </div>

          {/* Medications */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-sky-600" />
              Prescribed Medications
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Amoxicillin 500mg - 1 tablet three times daily for 7 days. Paracetamol 500mg as needed for fever."
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-800"
            />
          </div>

          {/* Follow-up Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Follow-up & Care Instructions
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Follow-up appointment in OPD Room 204 on October 12, 2026. Rest adequately and drink plenty of fluids."
              value={followUpInstructions}
              onChange={(e) => setFollowUpInstructions(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Saving Summary...' : 'Save Discharge Summary'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
