'use client';

import { useCRMStore } from '@/store/crmStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useState } from 'react';
import Link from 'next/link';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  Mail, Lock, Sun, Moon, Globe,
  TrendingUp, Users, BarChart3, ArrowRight, Eye, EyeOff, AlertTriangle
} from 'lucide-react';

export default function LoginPage() {
  const { t, language, toggleLanguage, dir } = useTranslation();
  const login = useCRMStore((state) => state.login);
  const theme = useCRMStore((state) => state.theme);
  const setTheme = useCRMStore((state) => state.setTheme);
  const addToast = useCRMStore((state) => state.addToast);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast(language === 'he' ? 'נא למלא את כל השדות' : 'Please fill in all fields', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        addToast(t('auth.loginSuccess'), 'success');
      } else {
        addToast(
          language === 'he' 
            ? 'שגיאה בהתחברות – פרטים שגויים או משתמש לא קיים במערכת' 
            : 'Login failed – incorrect credentials or user not found',
          'error'
        );
      }
    } catch (err: any) {
      console.error(err);
      addToast(
        language === 'he' 
          ? `שגיאה בהתחברות: ${err.message || 'פרטים שגויים'}` 
          : `Login error: ${err.message || 'Invalid credentials'}`,
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { icon: TrendingUp, label: language === 'he' ? 'נפח הובלות' : 'Freight Volume', value: '+28%', color: '#10B981' },
    { icon: Users, label: language === 'he' ? 'יבואנים ויצואנים' : 'Active Clients', value: '1,284', color: '#3B82F6' },
    { icon: BarChart3, label: language === 'he' ? 'מטענים בדרך' : 'Active Shipments', value: '142', color: '#8B5CF6' },
  ];

  return (
    <div className="min-h-screen flex" dir={dir}>
      {/* ── Left Panel (Desktop Only) ── */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[45%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #060b18 0%, #0d1526 40%, #111827 70%, #0c1020 100%)' }}
      >
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] left-[-80px] w-[420px] h-[420px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)', filter: 'blur(60px)', animation: 'pulse 8s ease-in-out infinite' }} />
          <div className="absolute bottom-[-60px] right-[-60px] w-[360px] h-[360px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)', filter: 'blur(50px)', animation: 'pulse 10s ease-in-out infinite 2s' }} />
          <div className="absolute top-[40%] left-[30%] w-[200px] h-[200px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)', filter: 'blur(40px)', animation: 'pulse 12s ease-in-out infinite 4s' }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Nexora CRM" className="h-10 w-auto object-contain brightness-110" />
        </div>

        {/* Center hero text */}
        <div className="relative z-10 flex flex-col gap-6">
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}>
              {language === 'he' ? (
                <>נהל את<br /><span style={{ background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>משלוחי המטענים</span><br />בקלות ובחכמה</>
              ) : (
                <>Manage your<br /><span style={{ background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>cargo & shipments</span><br />smarter</>
              )}
            </h1>
            <p className="mt-4 text-slate-400 text-base leading-relaxed max-w-xs">
              {language === 'he'
                ? 'מערכת CRM מתקדמת לניהול מטענים, שילוח בינלאומי, יבואנים ויצואנים.'
                : 'Advanced CRM system for managing cargo, international logistics, and client bookings.'}
            </p>
          </div>

          {/* Stats cards */}
          <div className="flex flex-col gap-3">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl border"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderColor: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(8px)'
                  }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${stat.color}22` }}>
                    <Icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                  <span className="text-slate-400 text-sm flex-1">{stat.label}</span>
                  <span className="font-bold text-white text-sm">{stat.value}</span>
                </div>
              );
            })}
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-2 pt-2">
            <div className="flex -space-x-2">
              {['#3B82F6','#8B5CF6','#10B981','#F59E0B'].map((c, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: c }}>
                  {['O','S','D','A'][i]}
                </div>
              ))}
            </div>
            <p className="text-slate-500 text-xs">
              {language === 'he' ? '+240 משתמשים מרוצים' : '+240 happy users'}
            </p>
          </div>
        </div>

        {/* Bottom label */}
        <div className="relative z-10">
          <p className="text-slate-600 text-xs">© 2026 Nexora CRM</p>
        </div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="flex-1 flex flex-col min-h-screen bg-bg-primary">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 md:px-10">
          {/* Mobile logo */}
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
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {language === 'he' ? 'ברוך הבא בחזרה 👋' : 'Welcome back 👋'}
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                {language === 'he' ? 'הזן את פרטיך כדי להתחבר לחשבונך' : 'Enter your details to sign in to your account'}
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
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-text-tertiary">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@company.com"
                    required
                    className="w-full ps-10 pe-4 py-3 text-sm rounded-xl outline-none transition-all duration-200"
                    style={{
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      border: focusedField === 'email' ? '1.5px solid #3B82F6' : '1.5px solid var(--border-color)',
                      boxShadow: focusedField === 'email' ? '0 0 0 3px #3B82F620' : 'none',
                    }}
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-text-tertiary">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    required
                    className="w-full ps-10 pe-11 py-3 text-sm rounded-xl outline-none transition-all duration-200"
                    style={{
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      border: focusedField === 'password' ? '1.5px solid #3B82F6' : '1.5px solid var(--border-color)',
                      boxShadow: focusedField === 'password' ? '0 0 0 3px #3B82F620' : 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-xs font-medium text-brand-primary hover:underline">
                  {t('auth.forgotPassword')}
                </Link>
              </div>

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)', boxShadow: '0 4px 14px rgba(37,99,235,0.35)' }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {language === 'he' ? 'מתחבר...' : 'Signing in...'}
                  </>
                ) : (
                  <>
                    {t('auth.login')}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Register link */}
            <p className="text-center mt-6 text-sm text-text-secondary">
              {t('auth.dontHaveAccount')}{' '}
              <Link href="/register" className="text-brand-primary font-semibold hover:underline">
                {t('auth.register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
