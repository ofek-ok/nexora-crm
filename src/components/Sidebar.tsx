'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { useCRMStore } from '@/store/crmStore';
import { 
  LayoutDashboard, 
  Users2, 
  GitFork, 
  ShieldAlert, 
  CheckSquare, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { t, dir } = useTranslation();
  const logout = useCRMStore((state) => state.logout);
  const currentUser = useCRMStore((state) => state.currentUser);

  const menuItems = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.leads'), href: '/leads', icon: Users2 },
    { name: t('nav.pipeline'), href: '/pipeline', icon: GitFork },
    { name: t('nav.customers'), href: '/customers', icon: ShieldAlert },
    { name: t('nav.tasks'), href: '/tasks', icon: CheckSquare },
    { name: t('nav.settings'), href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 z-40 flex flex-col w-64 bg-bg-secondary border-e border-border-custom transition-transform duration-300 lg:translate-x-0 ${
          dir === 'rtl' 
            ? isOpen ? 'translate-x-0 right-0' : 'translate-x-full right-0 lg:translate-x-0'
            : isOpen ? 'translate-x-0 left-0' : '-translate-x-full left-0 lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-border-custom bg-bg-tertiary/10">
          <Link href="/dashboard" className="flex items-center py-1" onClick={onClose}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo.png" 
              alt="Nexora CRM" 
              className="h-9 w-auto object-contain dark:brightness-110" 
            />
          </Link>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg hover:bg-bg-tertiary lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* User Info Quick View */}
        {currentUser && (
          <div className="p-4 mx-4 my-3 rounded-xl bg-bg-tertiary/30 border border-border-custom flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-border-custom flex-shrink-0 bg-brand-primary-light flex items-center justify-center">
              {currentUser.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="font-semibold text-brand-primary text-sm uppercase">
                  {currentUser.fullName.charAt(0)}
                </span>
              )}
            </div>
            <div className="overflow-hidden">
              <h5 className="text-xs font-semibold text-text-primary truncate">
                {currentUser.fullName}
              </h5>
              <p className="text-[10px] text-text-tertiary capitalize mt-0.5">
                {currentUser.role === 'admin' ? t('settings.userManagement') : t('common.owner')}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-text-secondary group-hover:text-text-primary'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-border-custom">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex items-center gap-3.5 w-full px-4 py-3 text-sm font-medium text-brand-danger hover:bg-brand-danger-light/20 rounded-xl transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
