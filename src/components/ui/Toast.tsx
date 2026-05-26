'use client';

import { useCRMStore } from '@/store/crmStore';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

export function ToastContainer() {
  const toasts = useCRMStore((state) => state.toasts);
  const removeToast = useCRMStore((state) => state.removeToast);
  const language = useCRMStore((state) => state.language);
  const isRTL = language === 'he';

  return (
    <div 
      className={`fixed top-4 z-[9999] flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none transition-all duration-300 ${
        isRTL ? 'left-0 sm:left-4' : 'right-0 sm:right-4'
      }`}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ 
  toast, 
  onClose 
}: { 
  toast: { id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string }; 
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-brand-success" />,
    error: <AlertCircle className="w-5 h-5 text-brand-danger" />,
    warning: <AlertTriangle className="w-5 h-5 text-brand-warning" />,
    info: <Info className="w-5 h-5 text-brand-primary" />
  };

  const bgColors = {
    success: 'border-brand-success/20 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300',
    error: 'border-brand-danger/20 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-300',
    warning: 'border-brand-warning/20 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300',
    info: 'border-brand-primary/20 bg-blue-50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-300'
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 animate-slide-in hover:scale-[1.02] ${
        bgColors[toast.type]
      }`}
      role="alert"
    >
      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        aria-label="Close"
      >
        <X className="w-4 h-4 opacity-70 hover:opacity-100" />
      </button>
    </div>
  );
}
