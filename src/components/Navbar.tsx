'use client';

import { useCRMStore } from '@/store/crmStore';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Menu, 
  Search, 
  Sun, 
  Moon, 
  Globe, 
  X,
  User as UserIcon,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface NavbarProps {
  onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const { t, language, toggleLanguage, dir } = useTranslation();
  const theme = useCRMStore((state) => state.theme);
  const setTheme = useCRMStore((state) => state.setTheme);
  const currentUser = useCRMStore((state) => state.currentUser);
  
  // Search state
  const searchQuery = useCRMStore((state) => state.searchQuery);
  const setSearchQuery = useCRMStore((state) => state.setSearchQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Toggle theme
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (typeof document !== 'undefined') {
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search results from store
  const leads = useCRMStore((state) => state.leads);
  const customers = useCRMStore((state) => state.customers);
  const tasks = useCRMStore((state) => state.tasks);

  const getFilteredResults = () => {
    const queryStr = searchQuery || '';
    if (!queryStr.trim()) return { leads: [], customers: [], tasks: [] };
    const query = queryStr.toLowerCase();

    const filteredLeads = leads.filter(l => 
      l.companyName.toLowerCase().includes(query) || 
      l.contactName.toLowerCase().includes(query) || 
      l.email.toLowerCase().includes(query) || 
      l.phone.includes(query)
    ).slice(0, 3);

    const filteredCustomers = customers.filter(c => 
      c.companyName.toLowerCase().includes(query) || 
      c.contactName.toLowerCase().includes(query) || 
      c.email.toLowerCase().includes(query) || 
      c.phone.includes(query)
    ).slice(0, 3);

    const filteredTasks = tasks.filter(t => 
      t.title.toLowerCase().includes(query) || 
      (t.description && t.description.toLowerCase().includes(query))
    ).slice(0, 3);

    return { leads: filteredLeads, customers: filteredCustomers, tasks: filteredTasks };
  };

  const results = getFilteredResults();
  const hasResults = results.leads.length > 0 || results.customers.length > 0 || results.tasks.length > 0;

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-border-custom bg-bg-secondary/80 backdrop-blur-md flex items-center justify-between px-6">
      
      {/* Mobile Menu & Search Input */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuToggle}
          className="p-2 -ms-2 rounded-lg hover:bg-bg-tertiary lg:hidden text-text-secondary hover:text-text-primary cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search */}
        <div ref={searchRef} className="relative max-w-md w-full hidden md:block">
          <div className="relative flex items-center">
            <Search className="absolute start-3 w-4 h-4 text-text-tertiary pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={t('common.searchAcross')}
              className="w-full py-2 ps-9 pe-9 text-sm border border-border-custom rounded-xl bg-bg-tertiary/40 text-text-primary placeholder-text-tertiary focus:bg-bg-secondary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 outline-none transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3 text-text-tertiary hover:text-text-primary p-0.5 rounded hover:bg-bg-tertiary cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Search Results Dropdown */}
          {isSearchFocused && searchQuery && searchQuery.trim() && (
            <div className="absolute top-full mt-2 w-full bg-bg-secondary border border-border-custom rounded-2xl shadow-xl z-50 p-4 max-h-[400px] overflow-y-auto animate-scale-up">
              {!hasResults ? (
                <div className="text-center py-6 text-sm text-text-tertiary">
                  {t('common.noData')}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Leads Results */}
                  {results.leads.length > 0 && (
                    <div>
                      <h6 className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 px-2">
                        {t('nav.leads')}
                      </h6>
                      <ul className="space-y-0.5">
                        {results.leads.map(lead => (
                          <li key={lead.id}>
                            <Link
                              href="/leads"
                              onClick={() => setIsSearchFocused(false)}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-bg-tertiary text-sm text-text-primary transition-colors"
                            >
                              <span>{lead.companyName} ({lead.contactName})</span>
                              <span className="text-xs text-brand-primary font-medium">{lead.dealValue.toLocaleString()}$</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Customers Results */}
                  {results.customers.length > 0 && (
                    <div>
                      <h6 className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 px-2">
                        {t('nav.customers')}
                      </h6>
                      <ul className="space-y-0.5">
                        {results.customers.map(customer => (
                          <li key={customer.id}>
                            <Link
                              href="/customers"
                              onClick={() => setIsSearchFocused(false)}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-bg-tertiary text-sm text-text-primary transition-colors"
                            >
                              <span>{customer.companyName}</span>
                              <span className="text-xs text-brand-success font-medium">{t('dashboard.activeCustomers')}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tasks Results */}
                  {results.tasks.length > 0 && (
                    <div>
                      <h6 className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 px-2">
                        {t('nav.tasks')}
                      </h6>
                      <ul className="space-y-0.5">
                        {results.tasks.map(task => (
                          <li key={task.id}>
                            <Link
                              href="/tasks"
                              onClick={() => setIsSearchFocused(false)}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-bg-tertiary text-sm text-text-primary transition-colors"
                            >
                              <span className={task.status === 'completed' ? 'line-through opacity-50' : ''}>
                                {task.title}
                              </span>
                              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                                task.priority === 'high' ? 'bg-brand-danger-light text-brand-danger' : 
                                task.priority === 'medium' ? 'bg-brand-warning-light text-brand-warning' : 
                                'bg-brand-primary-light text-brand-primary'
                              }`}>
                                {t(`tasks.${task.priority}`)}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* Language Toggler */}
        <button
          onClick={toggleLanguage}
          className="p-2.5 rounded-xl hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors cursor-pointer flex items-center gap-1.5"
          title={language === 'he' ? 'English LTR' : 'Hebrew RTL'}
        >
          <Globe className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase">{language === 'he' ? 'EN' : 'עב'}</span>
        </button>

        {/* Theme Toggler */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="w-px h-6 bg-border-custom mx-1 hidden sm:block" />

        {/* User Summary Button */}
        {currentUser && (
          <div className="flex items-center gap-2.5 ps-1.5">
            <div className="text-end hidden sm:block">
              <p className="text-xs font-semibold text-text-primary leading-tight">
                {currentUser.fullName}
              </p>
              <p className="text-[10px] text-text-tertiary mt-0.5">
                {currentUser.role === 'admin' ? 'Admin' : 'Agent'}
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center text-white text-sm font-semibold select-none border border-brand-primary/10 shadow-sm">
              {currentUser.fullName.charAt(0)}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
