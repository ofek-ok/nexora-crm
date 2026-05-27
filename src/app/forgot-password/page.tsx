'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { useCRMStore } from '@/store/crmStore';
import { useState } from 'react';
import Link from 'next/link';
import {
  Mail, Sun, Moon, Globe,
  ArrowRight, ArrowLeft, KeyRound, ShieldCheck
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const { t, language, toggleLanguage, dir } = useTranslation();
  const theme = useCRMStore((state) => state.theme);
  const setTheme = useCRMStore((state) => state.setTheme);
  const addToast = useCRMStore((state) => state.addToast);

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast(language === 'he' ? 'נא למלא את כתובת האימייל' : 'Please enter your email address', 'error');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      addToast(t('auth.forgotPasswordSuccess'), 'success');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex" dir={dir}>
      {/* ── Left Panel (Desktop Only) ── */}
      <div
        className="hidden lg:flex lg:w-[42%] xl:w-[45%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #060b18 0%, #0d1a2a 40%, #0f1e2e 70%, #0a1020 100%)' }}
      >
        {/* Animated orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-40px] left-[-40px] w-[380px] h-[380px] rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)', filter: 'blur(60px)', animation: 'pulse 9s ease-in-out infinite' }} />
          <div className="absolute bottom-[-60px] right-[-60px] w-[340px] h-[340px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)', filter: 'blur(50px)', animation: 'pulse 12s ease-in-out infinite 2s' }} />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Nexora CRM" className="h-10 w-auto object-contain brightness-110" />
        </div>

        {/* Center content */}
        <div className="relative z-10 flex flex-col gap-8">
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.2)' }}>
            <KeyRound className="w-10 h-10" style={{ color: '#06B6D4' }} />
          </div>

          <div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}>
              {language === 'he' ? (
                <>שחזר את<br /><span style={{ background: 'linear-gradient(90deg, #06B6D4, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>גישה</span><br />לחשבונך</>
              ) : (
                <>Recover<br /><span style={{ background: 'linear-gradient(90deg, #06B6D4, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>access</span><br />to your account</>
              )}
            </h1>
            <p className="mt-4 text-slate-400 text-base leading-relaxed max-w-xs">
              {language === 'he'
                ? 'הזן את כתובת האימייל שלך ואנחנו נשלח לך קישור לאיפוס הסיסמה.'
                : 'Enter your email address and we\'ll send you a link to reset your password.'}
            </p>
          </div>

          {/* Security note */}
          <div className="p-4 rounded-xl border"
            style={{ background: 'rgba(6,182,212,0.05)', borderColor: 'rgba(6,182,212,0.15)' }}>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#06B6D4' }} />
              <div>
                <p className="text-slate-300 text-sm font-medium">
                  {language === 'he' ? 'קישור מאובטח' : 'Secure link'}
                </p>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  {language === 'he'
                    ? 'קישור האיפוס יהיה בתוקף למשך 15 דקות בלבד.'
                    : 'The reset link will be valid for 15 minutes only.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-slate-600 text-xs">© 2026 Nexora CRM</p>
        </div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="flex-1 flex flex-col min-h-screen bg-bg-primary">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 md:px-10">
          <div className="lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Nexora CRM" className="h-8 w-auto object-contain dark:brightness-110" />
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}
            >
              <Globe className="w-3.5 h-3.5" />
              {language === 'he' ? 'EN' : 'עב'}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border transition-all duration-200 cursor-pointer"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-8 md:px-12">
          <div className="w-full max-w-[400px]">

            {/* Back to login */}
            <Link href="/login"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t('auth.backToLogin')}
            </Link>

            {!submitted ? (
              <>
                {/* Header */}
                <div className="mb-8">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
                    <KeyRound className="w-6 h-6" style={{ color: '#06B6D4' }} />
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {language === 'he' ? 'שכחת את הסיסמה?' : 'Forgot password?'}
                  </h2>
                  <p className="text-text-secondary text-sm mt-1">
                    {language === 'he'
                      ? 'לא דאגה! הזן את האימייל שלך ונשלח לך קישור לאיפוס.'
                      : "No worries! Enter your email and we'll send you a reset link."}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-text-secondary">{t('auth.email')}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-text-tertiary">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="forgot-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="admin@nexora.com"
                        required
                        className="w-full ps-10 pe-4 py-3 text-sm rounded-xl outline-none transition-all duration-200"
                        style={{
                          background: 'var(--bg-secondary)',
                          color: 'var(--text-primary)',
                          border: focusedField === 'email' ? '1.5px solid #06B6D4' : '1.5px solid var(--border-color)',
                          boxShadow: focusedField === 'email' ? '0 0 0 3px #06B6D420' : 'none',
                        }}
                      />
                    </div>
                  </div>

                  <button
                    id="forgot-submit"
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #0891B2 0%, #2563EB 100%)', boxShadow: '0 4px 14px rgba(8,145,178,0.35)' }}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {language === 'he' ? 'שולח...' : 'Sending...'}
                      </>
                    ) : (
                      <>
                        {language === 'he' ? 'שחזר סיסמה' : 'Reset Password'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success state */
              <div className="flex flex-col items-center text-center gap-6 py-8">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <ShieldCheck className="w-10 h-10" style={{ color: '#10B981' }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {language === 'he' ? 'הקישור נשלח! ✅' : 'Link sent! ✅'}
                  </h2>
                  <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
                    {language === 'he'
                      ? `שלחנו קישור לאיפוס הסיסמה אל ${email}. בדוק את תיבת הדואר שלך.`
                      : `We've sent a password reset link to ${email}. Please check your inbox.`}
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm text-brand-primary hover:underline cursor-pointer"
                >
                  {language === 'he' ? 'שלח שוב' : 'Resend link'}
                </button>
                <Link href="/login"
                  className="flex items-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1.5px solid var(--border-color)' }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('auth.backToLogin')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
