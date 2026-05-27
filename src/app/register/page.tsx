'use client';

import { useCRMStore } from '@/store/crmStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  Mail, Lock, User as UserIcon, Sun, Moon, Globe,
  ArrowRight, Eye, EyeOff, CheckCircle2, Shield, Zap, Globe2, AlertTriangle
} from 'lucide-react';

export default function RegisterPage() {
  const { t, language, toggleLanguage, dir } = useTranslation();
  const register = useCRMStore((state) => state.register);
  const theme = useCRMStore((state) => state.theme);
  const setTheme = useCRMStore((state) => state.setTheme);
  const addToast = useCRMStore((state) => state.addToast);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role] = useState<'admin' | 'agent'>('admin');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
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
    try {
      const success = await register(email, password, name, role);
      if (success) {
        addToast(t('auth.registerSuccess'), 'success');
        router.push('/dashboard');
      } else {
        addToast(language === 'he' ? 'דוא"ל זה כבר קיים במערכת' : 'Email already exists', 'error');
      }
    } catch (err: any) {
      console.error(err);
      addToast(
        language === 'he' 
          ? `שגיאה בהרשמה: ${err.message || 'פרטים לא תקינים'}` 
          : `Registration error: ${err.message || 'Invalid details'}`,
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Shield, label: language === 'he' ? 'אבטחת מידע ומסמכי שילוח' : 'Secure document management' },
    { icon: Zap, label: language === 'he' ? 'מעקב בזמן אמת אחר מטענים' : 'Real-time cargo tracking' },
    { icon: Globe2, label: language === 'he' ? 'תמיכה במעברים בינלאומיים' : 'Global shipping network support' },
  ];

  const inputClass = (field: string) => `
    w-full ps-10 pe-4 py-3 text-sm rounded-xl outline-none transition-all duration-200
  `.trim();

  const inputStyle = (field: string) => ({
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    border: focusedField === field ? '1.5px solid #3B82F6' : '1.5px solid var(--border-color)',
    boxShadow: focusedField === field ? '0 0 0 3px #3B82F620' : 'none',
  });

  return (
    <div className="min-h-screen flex" dir={dir}>
      {/* ── Left Panel (Desktop Only) ── */}
      <div
        className="hidden lg:flex lg:w-[42%] xl:w-[45%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #060b18 0%, #0d1526 40%, #0f172a 70%, #0c1020 100%)' }}
      >
        {/* Animated orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-60px] right-[-60px] w-[400px] h-[400px] rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)', filter: 'blur(60px)', animation: 'pulse 8s ease-in-out infinite' }} />
          <div className="absolute bottom-[-40px] left-[-40px] w-[350px] h-[350px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)', filter: 'blur(50px)', animation: 'pulse 11s ease-in-out infinite 3s' }} />
          <div className="absolute top-[50%] left-[10%] w-[180px] h-[180px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #10B981 0%, transparent 70%)', filter: 'blur(40px)', animation: 'pulse 14s ease-in-out infinite 5s' }} />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Nexora CRM" className="h-10 w-auto object-contain brightness-110" />
        </div>

        {/* Center hero */}
        <div className="relative z-10 flex flex-col gap-8">
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}>
              {language === 'he' ? (
                <>הצטרף אל<br /><span style={{ background: 'linear-gradient(90deg, #8B5CF6, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Nexora Logistics</span><br />היום</>
              ) : (
                <>Join<br /><span style={{ background: 'linear-gradient(90deg, #8B5CF6, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Nexora Logistics</span><br />today</>
              )}
            </h1>
            <p className="mt-4 text-slate-400 text-base leading-relaxed max-w-xs">
              {language === 'he'
                ? 'צור חשבון ותתחיל לנהל את משלוחי המטענים והבוקינגס בצורה חכמה ויעילה יותר.'
                : 'Create an account and start managing your cargo shipments and bookings more efficiently.'}
            </p>
          </div>

          {/* Features list */}
          <div className="flex flex-col gap-3">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.2)' }}>
                    <Icon className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                  </div>
                  <span className="text-slate-300 text-sm">{feat.label}</span>
                </div>
              );
            })}
          </div>

          {/* Progress bar mockup */}
          <div className="p-4 rounded-xl border"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs">{language === 'he' ? 'יעד מטענים חודשי' : 'Monthly shipping target'}</span>
              <span className="text-white text-xs font-semibold">68%</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-full rounded-full" style={{ width: '68%', background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)' }} />
            </div>
            <p className="text-slate-600 text-xs mt-2">684 / 1,000 TEU (מכולות)</p>
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
          <div className="w-full max-w-[420px]">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {language === 'he' ? 'צור חשבון חדש ✨' : 'Create your account ✨'}
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                {language === 'he' ? 'מלא את הפרטים כדי להתחיל להשתמש ב-Nexora CRM' : 'Fill in the details to get started with Nexora CRM'}
              </p>
            </div>

            {!isSupabaseConfigured && (
              <div className="mb-6 p-4 rounded-xl border flex items-start gap-3 bg-amber-500/10 border-amber-500/20 text-amber-500 text-xs animate-fade-in">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <p className="font-bold mb-1">
                    {language === 'he' ? 'מצב הדמיה מקומי (Mock Mode)' : 'Running in Local Mock Mode'}
                  </p>
                  <p>
                    {language === 'he' 
                      ? 'בסיס הנתונים של Supabase אינו מחובר. המשתמשים יישמרו בדפדפן בלבד. כדי לחבר את סופה בייס, הגדר את משתני הסביבה בקובץ env.local.'
                      : 'Supabase database is not connected. Users are saved in the browser only. Configure environment variables to connect.'}
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">{t('auth.fullName')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-text-tertiary">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="register-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={language === 'he' ? 'שמך המלא' : 'Your full name'}
                    required
                    className={inputClass('name')}
                    style={inputStyle('name')}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">{t('auth.email')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-text-tertiary">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@company.com"
                    required
                    className={inputClass('email')}
                    style={inputStyle('email')}
                  />
                </div>
              </div>



              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">{t('auth.password')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-text-tertiary">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    required
                    className={`${inputClass('password')} pe-11`}
                    style={inputStyle('password')}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">{t('auth.confirmPassword')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-text-tertiary">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="register-confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocusedField('confirm')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    required
                    className={`${inputClass('confirm')} pe-11`}
                    style={{
                      ...inputStyle('confirm'),
                      borderColor: confirmPassword && confirmPassword !== password
                        ? '#EF4444'
                        : focusedField === 'confirm' ? '#3B82F6' : 'var(--border-color)',
                      boxShadow: confirmPassword && confirmPassword !== password
                        ? '0 0 0 3px #EF444420'
                        : focusedField === 'confirm' ? '0 0 0 3px #3B82F620' : 'none',
                    }}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-xs text-red-500 font-medium">
                    {language === 'he' ? 'הסיסמאות אינן תואמות' : 'Passwords do not match'}
                  </p>
                )}
                {confirmPassword && confirmPassword === password && password.length > 0 && (
                  <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {language === 'he' ? 'הסיסמאות תואמות' : 'Passwords match'}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                id="register-submit"
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98] mt-2"
                style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {language === 'he' ? 'יוצר חשבון...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    {t('auth.register')}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="text-center mt-6 text-sm text-text-secondary">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link href="/login" className="text-brand-primary font-semibold hover:underline">
                {t('auth.login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
