'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCRMStore } from '@/store/crmStore';

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useCRMStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-text-secondary animate-pulse">Loading Nexora CRM...</span>
      </div>
    </div>
  );
}
