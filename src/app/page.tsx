'use client';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-text-secondary animate-pulse">Loading Nexora CRM...</span>
      </div>
    </div>
  );
}

