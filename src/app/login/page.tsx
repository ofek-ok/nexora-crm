'use client';

import { useCRMStore } from '@/store/crmStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User as UserIcon, Globe, Sun, Moon } from 'lucide-react';

export default function LoginPage() {
  const { t, language, toggleLanguage, dir } = useTranslation();
  const login = useCRMStore((state) => state.login);
  const theme = useCRMStore((state) => state.theme);
  const setTheme = useCRMStore((state) => state.setTheme);
  const addToast = useCRMStore((state) => state.addToast);

  const [email, setEmail] = useState('admin@nexora.com');
  const [name, setName] = useState('Ofek Ok');
  const [role, setRole] = useState<'admin' | 'agent'>('admin');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast(t('auth.loginSuccess') ? 'Please fill in all fields' : 'נא למלא את כל השדות', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = login(email, name || 'Demo User', role);
      setIsLoading(false);
      if (success) {
        addToast(t('auth.loginSuccess'), 'success');
      }
    }, 800);
  };

  return (
    <div className="w-full max-w-md" dir={dir}>
      {/* Header utility actions */}
      <div className="flex justify-end items-center gap-2 mb-4">


        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <Card className="shadow-xl border border-border-custom bg-bg-secondary p-8 rounded-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo.png" 
              alt="Nexora CRM" 
              className="h-16 w-auto object-contain dark:brightness-110" 
            />
          </div>
          <p className="text-sm text-text-secondary mt-1.5">
            {t('auth.login')}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label={t('auth.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label={t('auth.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />

          {/* Quick Mock Controls */}
          <div className="p-3 border border-border-custom rounded-xl bg-bg-tertiary/20 space-y-3">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider block">
              MVP Demo Controls (Auto-fills)
            </span>
            <Input
              label={t('auth.fullName')}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<UserIcon className="w-4 h-4" />}
            />
            <Select
              label={t('auth.role')}
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'agent')}
              options={[
                { value: 'admin', label: 'Admin (מנהל)' },
                { value: 'agent', label: 'Agent (נציג)' }
              ]}
            />
          </div>

          <div className="flex justify-between items-center text-xs">
            <Link 
              href="/forgot-password" 
              className="text-brand-primary hover:underline font-medium"
            >
              {t('auth.forgotPassword')}
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            {t('auth.login')}
          </Button>
        </form>

        <div className="text-center mt-6 text-sm text-text-secondary">
          <span>{t('auth.dontHaveAccount')} </span>
          <Link href="/register" className="text-brand-primary font-semibold hover:underline">
            {t('auth.register')}
          </Link>
        </div>
      </Card>
    </div>
  );
}
