'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { useCRMStore } from '@/store/crmStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, Globe, Sun, Moon } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { t, language, toggleLanguage, dir } = useTranslation();
  const theme = useCRMStore((state) => state.theme);
  const setTheme = useCRMStore((state) => state.setTheme);
  const addToast = useCRMStore((state) => state.addToast);

  const [email, setEmail] = useState('');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast(language === 'he' ? 'נא למלא את כתובת האימייל' : 'Please fill in your email address', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast(t('auth.forgotPasswordSuccess'), 'success');
      setEmail('');
    }, 800);
  };

  return (
    <div className="w-full max-w-md" dir={dir}>
      {/* Header action widgets */}
      <div className="flex justify-end items-center gap-2 mb-4">
        <button
          onClick={toggleLanguage}
          className="p-2 rounded-xl hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Globe className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase">{language === 'he' ? 'EN' : 'עב'}</span>
        </button>

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
              className="h-10 w-auto object-contain dark:brightness-110" 
            />
          </div>
          <p className="text-sm text-text-secondary mt-1.5">
            {t('auth.forgotPassword')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('auth.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
            placeholder="admin@nexora.com"
          />

          <Button
            type="submit"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            {language === 'he' ? 'שחזר סיסמה' : 'Reset Password'}
          </Button>
        </form>

        <div className="text-center mt-6 text-sm text-text-secondary">
          <Link href="/login" className="text-brand-primary font-semibold hover:underline">
            {t('auth.backToLogin')}
          </Link>
        </div>
      </Card>
    </div>
  );
}
