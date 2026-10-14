import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading details...' }) {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-slate-500 space-y-3">
      <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
