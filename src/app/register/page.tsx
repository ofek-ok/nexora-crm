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
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { t, language, toggleLanguage, dir } = useTranslation();
  const register = useCRMStore((state) => state.register);
  const theme = useCRMStore((state) => state.theme);
  const setTheme = useCRMStore((state) => state.setTheme);
  const addToast = useCRMStore((state) => state.addToast);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'agent'>('agent');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password || !confirmPassword) {
      addToast(language === 'he' ? 'נא למלא את כל השדות' : 'Please fill in all fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      addToast(language === 'he' ? 'הסיסמאות אינן תואמות' : 'Passwords do not match', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = register(email, name, role);
      setIsLoading(false);
      if (success) {
        addToast(t('auth.registerSuccess'), 'success');
        router.push('/dashboard');
      } else {
        addToast(language === 'he' ? 'דוא"ל זה כבר קיים במערכת' : 'Email already exists', 'error');
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
            {t('auth.register')}
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label={t('auth.fullName')}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<UserIcon className="w-4 h-4" />}
            required
          />

          <Input
            label={t('auth.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <Select
            label={t('auth.role')}
            value={role}
            onChange={(e) => setRole(e.target.value as 'admin' | 'agent')}
            options={[
              { value: 'agent', label: 'Agent (נציג מכירות)' },
              { value: 'admin', label: 'Admin (מנהל מערכת)' }
            ]}
          />

          <Input
            label={t('auth.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />

          <Input
            label={t('auth.confirmPassword')}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />

          <Button
            type="submit"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            {t('auth.register')}
          </Button>
        </form>

        <div className="text-center mt-6 text-sm text-text-secondary">
          <span>{t('auth.alreadyHaveAccount')} </span>
          <Link href="/login" className="text-brand-primary font-semibold hover:underline">
            {t('auth.login')}
          </Link>
        </div>
      </Card>
    </div>
  );
}
