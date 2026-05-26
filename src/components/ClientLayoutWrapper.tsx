'use client';

import { useCRMStore } from '@/store/crmStore';
import { useTranslation } from '@/hooks/useTranslation';
import { ToastContainer } from '@/components/ui/Toast';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthenticated = useCRMStore((state) => state.isAuthenticated);
  const theme = useCRMStore((state) => state.theme);
  const { dir, language } = useTranslation();
  
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';
  const isLandingPage = pathname === '/';
  const isPublicPage = isAuthPage || isLandingPage;

  // Apply theme class on initial mount and when theme changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  // Auth Guard
  useEffect(() => {
    if (!isAuthenticated && !isPublicPage) {
      router.replace('/login');
    } else if (isAuthenticated && isAuthPage) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isPublicPage, isAuthPage, router]);

  // If loading or state mismatch, wait (prevents flash of content)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    useCRMStore.getState().fetchData();
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Render public pages or unauthenticated layouts directly (without CRM sidebar/navbar)
  if (isLandingPage || isAuthPage || !isAuthenticated) {
    return (
      <main className={`min-h-screen bg-bg-primary flex flex-col ${isLandingPage ? '' : 'justify-center items-center p-4'}`}>
        {children}
        <ToastContainer />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex" dir={dir}>
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main layout container */}
      <div 
        className={`flex-1 flex flex-col min-h-screen overflow-x-hidden transition-all duration-300 ${
          dir === 'rtl' ? 'lg:pr-64 lg:pl-0' : 'lg:pl-64 lg:pr-0'
        }`}
      >
        {/* Navbar */}
        <Navbar onMenuToggle={() => setSidebarOpen(true)} />
        
        {/* Content body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  );
}
