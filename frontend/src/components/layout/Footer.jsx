import React from 'react';
import { HeartPulse, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <HeartPulse className="h-4 w-4 text-teal-600" />
          <span className="font-semibold text-slate-700">AI-Powered Hospital Discharge Assistant</span>
          <span>&bull; Capstone Project</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1 text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Demo Interface — Capstone Project
          </span>
          <span>FastAPI + React + Tailwind</span>
        </div>
      </div>
    </footer>
  );
}
