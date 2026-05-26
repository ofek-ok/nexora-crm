'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCRMStore } from '@/store/crmStore';
import { 
  Globe, 
  ShieldCheck, 
  TrendingDown, 
  Clock, 
  ArrowLeft, 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  Phone, 
  User, 
  Package, 
  HelpCircle, 
  Check, 
  Menu, 
  X, 
  ChevronDown,
  DollarSign,
  AlertTriangle,
  FileText,
  Activity,
  ChevronRight,
  TrendingUp,
  LayoutDashboard,
  Mail,
  Building
} from 'lucide-react';

export default function LandingPage() {
  const addLead = useCRMStore((state) => state.addLead);
  const pipelineStatuses = useCRMStore((state) => state.pipelineStatuses);
  const isAuthenticated = useCRMStore((state) => state.isAuthenticated);
  const addToast = useCRMStore((state) => state.addToast);

  // Form State
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [product, setProduct] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // UI State
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll spy & Header background shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Section spy
      const sections = ['hero', 'pain', 'solution', 'about', 'risk', 'roadmap', 'cta'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !companyName || !email || !phone || !product) {
      addToast('אנא מלא את כל השדות', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const statusId = pipelineStatuses[0]?.id || 's-1';
      
      // Dispatch to CRM state store (Zustand saves to LocalStorage automatically)
      await addLead({
        companyName: companyName,
        contactName: fullName,
        email: email,
        phone: phone,
        country: 'סין / ספק גלובלי',
        industry: 'ייבוא מסחרי',
        leadSource: 'דף נחיתה',
        dealValue: 0, // Calculated during process
        assignedOwnerId: 'u-1', // Assigned to Admin (Ofek Ok)
        statusId: statusId,
        tags: ['בדיקת רווחיות חינם', 'דף נחיתה', `מוצר: ${product}`]
      });

      setIsSuccess(true);
      addToast('פנייתך התקבלה! נציג יחזור אליך בהקדם', 'success');
      
      // Reset form fields
      setFullName('');
      setCompanyName('');
      setEmail('');
      setPhone('');
      setProduct('');
    } catch (error) {
      console.error(error);
      addToast('אירעה שגיאה בשליחת הטופס. אנא נסה שנית.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-[#1E293B] min-h-screen selection:bg-[#2563EB] selection:text-white" dir="rtl">
      
      {/* Dynamic shipping route styles injected inline */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shipping-dash {
          to {
            stroke-dashoffset: -40px;
          }
        }
        .animate-shipping-route {
          stroke-dasharray: 6, 6;
          animation: shipping-dash 25s linear infinite;
        }
        .animate-shipping-route-fast {
          stroke-dasharray: 5, 5;
          animation: shipping-dash 12s linear infinite;
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.5); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .ping-ring {
          animation: pulse-ring 3s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
        }
      `}} />

      {/* HEADER / NAVIGATION */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 shadow-lg py-3' 
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-white/5 border border-white/10 shadow-inner">
              <img src="/logo.png" alt="Nexora Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className={`text-xl font-bold font-display tracking-wide transition-colors duration-300 ${
              scrolled ? 'text-white' : 'text-white'
            }`}>
              Nexora
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 rounded-full px-1.5 py-1 backdrop-blur-sm">
            {[
              { id: 'hero', label: 'עמוד ראשי' },
              { id: 'pain', label: 'איך מוזילים עלויות?' },
              { id: 'solution', label: 'איך זה עובד' },
              { id: 'about', label: 'מי אנחנו' },
              { id: 'risk', label: 'הפחתת סיכון ואחריות' },
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleScrollTo(e, link.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 ${
                  activeSection === link.id
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA & Dashboard Button */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link 
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#10B981] hover:bg-[#059669] rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                אזור ניהול ה-CRM
              </Link>
            ) : (
              <Link 
                href="/login"
                className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 transition-colors"
              >
                התחברות
              </Link>
            )}
            
            <a
              href="#cta"
              onClick={(e) => handleScrollTo(e, 'cta')}
              className="px-4.5 py-2.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-95 border border-blue-400/20"
            >
              בדיקת רווחיות חינם
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#0F172A] border-b border-slate-800 px-6 py-5 shadow-2xl flex flex-col gap-4 animate-fade-in">
            {[
              { id: 'hero', label: 'עמוד ראשי' },
              { id: 'pain', label: 'איך מוזילים עלויות?' },
              { id: 'solution', label: 'שיטת הייבוא המוגן' },
              { id: 'about', label: 'מי אנחנו' },
              { id: 'risk', label: 'הפחתת סיכון ואחריות' },
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleScrollTo(e, link.id)}
                className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                  activeSection === link.id
                    ? 'bg-[#2563EB]/15 text-[#60A5FA]'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
            <hr className="border-slate-800 my-1" />
            <div className="flex flex-col gap-3">
              {isAuthenticated && (
                <Link 
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold text-white bg-[#10B981] hover:bg-[#059669] rounded-xl text-center"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  אזור ניהול ה-CRM
                </Link>
              )}
              <a
                href="#cta"
                onClick={(e) => handleScrollTo(e, 'cta')}
                className="w-full py-3 text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl text-center shadow-lg shadow-blue-500/20"
              >
                בדיקת רווחיות חינם
              </a>
              {!isAuthenticated && (
                <Link 
                  href="/login"
                  className="w-full py-3 text-sm font-bold text-slate-300 hover:text-white rounded-xl text-center bg-slate-800/50"
                >
                  התחברות למערכת
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* SECTION 1: HERO SECTION */}
      <section 
        id="hero" 
        className="relative min-h-[90vh] md:min-h-[100vh] bg-[#0F172A] text-white pt-32 pb-16 flex items-center overflow-hidden"
      >
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none -translate-x-1/2" />
        <div className="absolute bottom-10 right-10 w-[600px] h-[600px] rounded-full bg-indigo-700/10 blur-[140px] pointer-events-none translate-x-1/4" />
        
        {/* Fine background grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Right Column - Text & Copy (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col items-start text-right">
            
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold mb-6 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              מפסיקים להפסיד: מעבירים את הרכש ישירות ליבוא מוגן
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl md:text-5xl lg:text-[46px] font-extrabold leading-tight tracking-tight text-white mb-6">
              למה להמשיך לקנות מספקים בארץ ולשלם כפול, כשאפשר לייבא את אותם המוצרים בדיוק –
              <span className="text-[#3B82F6] block mt-2 relative">
                בחצי מחיר ובאפס דאגות?
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg md:text-xl font-medium text-slate-200 mb-8 border-r-4 border-[#2563EB] pr-4 max-w-2xl leading-relaxed">
              חברת הייבוא שלוקחת אחריות מלאה על הסחורה שלך – מהמפעל בחו"ל ועד דלת העסק.
            </p>

            {/* Explanatory texts */}
            <div className="space-y-5 text-slate-300 max-w-2xl mb-10 text-sm md:text-base leading-relaxed">
              <p>
                הרבה בעלי עסקים בטוחים שייבוא מחו"ל מתאים רק לחברות ענק, ושזה דורש יותר מדי בלגן, בירוקרטיה ושבירת שיניים באנגלית מול ספקים. האמת היא שאתה לא צריך להבין בייבוא בשביל להרוויח ממנו.
              </p>
              <p className="font-semibold text-slate-100 flex items-center gap-2">
                <Check className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                אנחנו עושים הכל בשבילך: מוצאים לך את המוצר ישירות מהמפעל בחו"ל במחיר הכי נמוך, מנהלים את השילוח בים ומשחררים מהמכס בארץ ישר אל דלת העסק שלך. אתה מקבל מוצרים זולים בהרבה, ושקט נפשי מוחלט.
              </p>
            </div>

            {/* CTA Button */}
            <a
              href="#cta"
              onClick={(e) => handleScrollTo(e, 'cta')}
              className="group inline-flex items-center gap-3 px-8 py-4.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl font-bold transition-all duration-200 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 text-right w-full sm:w-auto"
            >
              <div className="flex flex-col items-start">
                <span className="text-sm font-extrabold text-white">לחץ כאן לבדיקת רווחיות בחינם</span>
                <span className="text-xs text-blue-200 font-normal mt-0.5">נבדוק כמה כסף תחסוך אם תייבא את המוצר שלך</span>
              </div>
              <ArrowLeft className="w-5 h-5 text-white transition-transform group-hover:-translate-x-1" />
            </a>

          </div>

          {/* Left Column - Shipping Map Illustration (5 cols on desktop) */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center min-h-[300px] lg:min-h-[400px]">
            <div className="relative w-full max-w-lg aspect-square lg:aspect-auto rounded-3xl bg-slate-900/50 border border-slate-800/80 p-4 shadow-2xl backdrop-blur-md">
              
              {/* Map Title Tag */}
              <div className="absolute top-4 right-4 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                NEXORA ROUTE SYSTEM ACTIVE
              </div>

              {/* Dotted Global Map and Glowing Path SVG */}
              <svg viewBox="0 0 500 380" className="w-full h-full text-slate-700 select-none" fill="none">
                {/* Background Dotted Map Grid */}
                <g opacity="0.15">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <line key={`lh-${i}`} x1="0" y1={30 + i * 22} x2="500" y2={30 + i * 22} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,8" />
                  ))}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <line key={`lv-${i}`} x1={25 + i * 24} y1="0" x2={25 + i * 24} y2="380" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,8" />
                  ))}
                </g>

                {/* Country outlines representation (minimalistic shapes) */}
                <g fill="currentColor" opacity="0.08">
                  {/* Asia / China Area */}
                  <path d="M 370 120 C 400 110, 440 140, 430 180 C 410 220, 350 250, 360 210 Z" />
                  {/* Europe Area */}
                  <path d="M 120 70 C 160 50, 200 80, 210 110 C 180 140, 140 120, 120 90 Z" />
                  {/* Middle East Area */}
                  <path d="M 230 160 C 260 150, 280 180, 260 200 Z" />
                  {/* USA Area */}
                  <path d="M 30 100 C 60 90, 80 120, 70 150 C 40 170, 20 130, 30 100 Z" />
                </g>

                {/* Shipping Routes (Animate dash offset via CSS) */}
                
                {/* Route 1: China (Shenzhen) to Israel (Haifa) */}
                <path 
                  id="china-route"
                  d="M 400 170 Q 320 200, 250 180" 
                  stroke="#3B82F6" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  className="animate-shipping-route" 
                />
                
                {/* Route 2: USA (New York) to Israel */}
                <path 
                  id="usa-route"
                  d="M 60 130 Q 150 150, 250 180" 
                  stroke="#3B82F6" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                  className="animate-shipping-route-fast" 
                />

                {/* Route 3: Europe (Hamburg) to Israel */}
                <path 
                  id="europe-route"
                  d="M 160 90 Q 200 130, 250 180" 
                  stroke="#3B82F6" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                  className="animate-shipping-route" 
                />

                {/* Nodes / Hub Locations */}
                
                {/* Hub: China */}
                <g transform="translate(400, 170)">
                  <circle r="12" fill="#2563EB" opacity="0.15" />
                  <circle r="6" fill="#2563EB" opacity="0.35" className="animate-ping" />
                  <circle r="4" fill="#3B82F6" />
                  <text y="-12" textAnchor="middle" fill="#94A3B8" fontSize="9" fontWeight="bold" className="font-sans">סין (Shenzhen)</text>
                </g>

                {/* Hub: US East */}
                <g transform="translate(60, 130)">
                  <circle r="4" fill="#64748B" />
                  <text y="-10" textAnchor="middle" fill="#64748B" fontSize="8">ארה"ב (NY)</text>
                </g>

                {/* Hub: Europe */}
                <g transform="translate(160, 90)">
                  <circle r="4" fill="#64748B" />
                  <text y="-10" textAnchor="middle" fill="#64748B" fontSize="8">אירופה</text>
                </g>

                {/* Hub: Israel (Destination - Green success highlight) */}
                <g transform="translate(250, 180)">
                  <circle r="18" fill="#10B981" opacity="0.1" />
                  <circle r="10" fill="#10B981" opacity="0.25" className="ping-ring" />
                  <circle r="6" fill="#10B981" />
                  <text y="22" textAnchor="middle" fill="#10B981" fontSize="10" fontWeight="bold" className="font-sans">העסק שלך (ישראל)</text>
                </g>

                {/* Interactive Status Tag */}
                <g transform="translate(200, 280)">
                  <rect width="100" height="34" rx="6" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" opacity="0.95" />
                  <text x="50" y="15" textAnchor="middle" fill="#F8FAFC" fontSize="8" fontWeight="bold">סטטוס שילוח:</text>
                  <text x="50" y="27" textAnchor="middle" fill="#10B981" fontSize="8" fontWeight="bold">באחריות מלאה 100%</text>
                </g>
              </svg>

              {/* Decorative elements representing real-time import data */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[10px] text-slate-400">אחריות</div>
                  <div className="text-xs font-bold text-emerald-400">דלת לדלת</div>
                </div>
                <div className="border-r border-slate-800">
                  <div className="text-[10px] text-slate-400">עמילות מכס</div>
                  <div className="text-xs font-bold text-[#3B82F6]">כולל הכל</div>
                </div>
                <div className="border-r border-slate-800">
                  <div className="text-[10px] text-slate-400">עלות מוצר</div>
                  <div className="text-xs font-bold text-white">עד 50% חיסכון</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: PAIN SECTION */}
      <section 
        id="pain" 
        className="py-24 bg-[#F8FAFC] border-y border-slate-200"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          
          {/* Broken coin / warning icon */}
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6 text-amber-600 animate-bounce">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h2 className="text-2xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-8">
            הסוד שספקי המוצרים בארץ לא רוצים שתגלו
          </h2>

          <div className="text-right text-[#1E293B] space-y-6 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
            <p className="font-semibold text-slate-900">
              כשאתה קונה סחורה מספק, יבואן גדול או סיטונאי כאן בארץ, זה מרגיש לך "קל ובטוח". אתה מרים טלפון, משלם, ומקבל משטח למחסן.
            </p>
            <p>
              אבל בפועל? <span className="font-bold text-[#EF4444] underline decoration-wavy decoration-2">אתה משלם לו קנס ענק סתם</span>. אתה משלם על המשרדים המפוארים שלו, על אנשי המכירות שלו, ועל מתח הרווחים המטורף שהוא גוזר עליך באמצע. הכסף הזה יוצא ישירות מכיס של העסק שלך ומוריד לך את שורת הרווח לחצי.
            </p>
            
            {/* interactive Supply Chain Leak Chart */}
            <div className="my-10 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-md">
              <h3 className="text-sm font-bold text-[#0F172A] mb-5 text-center">כך דולף הכסף שלך בשרשרת התיווך הישראלית:</h3>
              <div className="space-y-4 max-w-xl mx-auto">
                {/* Factory cost */}
                <div className="relative">
                  <div className="flex justify-between items-center text-xs font-semibold mb-1 text-slate-500">
                    <span>מחיר במפעל בחו"ל</span>
                    <span>30% מעלות המוצר</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
                {/* Middlemen fee */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-1 text-[#EF4444]">
                    <span>קנס סיטונאים ומתווכים בארץ (משרדים, מנהלים, רווחי יבואן)</span>
                    <span>+ 70% קנס תיווך!</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 text-center mt-4">
                * מבוסס על ממוצעי פער תיווך ברכש תעשייתי ומסחרי בישראל
              </p>
            </div>

            <p>
              הפחד הכל כך הגיוני שלך "לברוח מהבלגן של חו"ל" גורם לך להשאיר <span className="font-bold text-slate-900">עשרות אלפי שקלים על הרצפה בכל חודש</span> – פשוט כי אף אחד לא הראה לך שאפשר לעשות את זה אחרת, בלי שום כאב ראש מצידך.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 3: THE SOLUTION - CPB METHOD */}
      <section 
        id="solution" 
        className="py-24 bg-[#0F172A] text-white"
      >
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#3B82F6] tracking-wider uppercase mb-3 block">הפתרון: נוסחת ה-CPB</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              להביא את חו"ל לדלת העסק – בביטחון של קנייה בארץ
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              הטענה שלנו: בעזרת מעטפת הייבוא המלאה שלנו, לקנות ישירות מהמפעל בחו"ל הופך להיות פשוט, שקוף ובטוח בדיוק כמו לקנות מספק בתל אביב – <span className="text-[#10B981] font-bold">רק ברבע מהמחיר.</span>
            </p>
          </div>

          {/* 3 Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Column 1: הוזלת עלויות (הכסף) */}
            <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-2xl hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                הוזלת עלויות
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">הכסף</span>
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                אנחנו חותכים את כל פערי התיווך והסיטונאים באמצע. אתה מקבל "מחיר נחיתה" סופי, נמוך וידוע מראש לכל מוצר – בלי הפתעות ובלי אותיות קטנות בנמלים.
              </p>
            </div>

            {/* Column 2: חיסכון בזמן (הניהול) */}
            <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-2xl hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                חיסכון בזמן
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">הניהול</span>
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                יש לך מנהל תיק לקוח אישי בארץ, בעברית, שמנהל עבורך את כל הקצוות מקצה לקצה. אתה לא צריך לדעת אנגלית, לא להתעסק עם ניירת ולא לרוץ למכס – אנחנו עושים הכל.
              </p>
            </div>

            {/* Column 3: ראש שקט (הביטחון) */}
            <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-2xl hover:border-slate-700 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-slate-500/10 border border-slate-500/25 flex items-center justify-center text-slate-400 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                ראש שקט
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-500/10 text-slate-400">הביטחון</span>
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                השקט הנפשי לדעת שהכסף והסחורה שלך נמצאים תחת השגחה קפדנית ובטוחה, בזמן שאתה מתרכז רק בדבר אחד: לשווק, למכור ולהביא כסף הביתה.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: "מי אנחנו" */}
      <section 
        id="about" 
        className="py-24 bg-[#F8FAFC]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Photo Column - Now with 2 separate partner photo placeholders */}
            <div className="lg:col-span-5 order-2 lg:order-1 grid grid-cols-2 gap-4 w-full max-w-md mx-auto">
              
              {/* Partner 1: Ofek */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-200/80 shadow-md bg-white p-2 flex flex-col justify-end group hover:border-[#2563EB] hover:shadow-lg transition-all duration-300">
                <div className="w-full h-full bg-[#1E293B] rounded-xl flex flex-col justify-end p-4 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10" />
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-xs font-bold text-blue-400 z-20">
                    א
                  </div>
                  {/* Photo Area placeholder inside the card */}
                  <div className="w-full h-24 bg-slate-800/40 rounded-lg mb-2 flex items-center justify-center border border-slate-700/50 z-20 overflow-hidden">
                    <User className="w-8 h-8 text-slate-500 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h4 className="text-sm font-bold z-20 relative text-right">אופק אוק</h4>
                  <p className="text-[10px] text-slate-400 z-20 relative text-right">שותף מייסד ומנהל רכש</p>
                </div>
              </div>

              {/* Partner 2: Co-founder */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-200/80 shadow-md bg-white p-2 flex flex-col justify-end group hover:border-[#10B981] hover:shadow-lg transition-all duration-300">
                <div className="w-full h-full bg-[#1E293B] rounded-xl flex flex-col justify-end p-4 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10" />
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-xs font-bold text-emerald-400 z-20">
                    ש
                  </div>
                  {/* Photo Area placeholder inside the card */}
                  <div className="w-full h-24 bg-slate-800/40 rounded-lg mb-2 flex items-center justify-center border border-slate-700/50 z-20 overflow-hidden">
                    <User className="w-8 h-8 text-slate-500 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h4 className="text-sm font-bold z-20 relative text-right">שותף מייסד</h4>
                  <p className="text-[10px] text-slate-400 z-20 relative text-right">שותף מייסד ומנהל לוגיסטיקה</p>
                </div>
              </div>

            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 order-1 lg:order-2 text-right">
              <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase mb-3 block">שותפים לדרך</span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-[#0F172A] mb-6">
                נעים להכיר, אנחנו האנשים שלוקחים אחריות על הסחורה שלך
              </h2>
              
              <div className="space-y-6 text-[#475569] text-sm md:text-base leading-relaxed">
                <p>
                  הקמנו את החברה הזו אחרי שנים שראינו את אותו הסיפור המרגיז חוזר על עצמו: בעלי עסקים ויזמים מדהימים בישראל שעובדים קשה מהבוקר עד הלילה, אבל בסוף החודש לא נשאר להם כמעט כלום בכיס – רק בגלל שהסיטונאים והספקים בארץ שוחטים אותם במחירים.
                </p>
                <p>
                  כשהיינו שואלים אותם "למה אתם לא מייבאים ישירות?", כולם היו עונים לנו בדיוק את אותו הדבר: <span className="font-semibold text-slate-800">"עזבו אתכם, אין לנו זמן לבלגן הזה, זה מפחיד, יעקצו אותנו בסין, המכס יתקע אותנו והכסף ילך לפח"</span>.
                </p>
                <p className="font-medium text-slate-900 border-r-4 border-emerald-500 pr-4">
                  הבנו שיש כאן בעיה ענקית. החלטנו לחבר את הניסיון, הקשרים והידע של שנינו בעולם הלוגיסטיקה, הרכש ועמילות המכס, ולבנות גוף שנותן פתרון אחד ברור: אנחנו נהיה הגב שלכם בשטח. המטרה שלנו היא לפתוח את השוק העולמי לכל עסק בישראל, ולהוכיח לכם שאתם יכולים לשלם חצי מחיר על המוצרים שלכם – בלי לעבוד דקה אחת קשה יותר.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: ANTI-BULLSHIT & RISK REDUCTION */}
      <section 
        id="risk" 
        className="py-24 bg-[#F1F5F9]"
      >
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Container with prominent glowing gradient border */}
          <div className="bg-[#0F172A] text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl border border-blue-500/25">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[80px] pointer-events-none" />
            
            <span className="text-xs font-mono text-[#3B82F6] font-bold block mb-4 tracking-widest text-right">דברו דוגרי, בלי סיפורים</span>
            
            <h2 className="text-xl md:text-3xl font-extrabold text-right mb-6 text-white leading-tight">
              בוא נשים את הקלפים על השולחן (ולמה כדאי לך לעבוד איתנו דווקא עכשיו)
            </h2>

            <div className="space-y-5 text-slate-300 text-sm md:text-base text-right leading-relaxed mb-8">
              <p>
                אתה בטח אומר לעצמך עכשיו: "החבר'ה האלה נשמעים מעולה, אבל למה שאני אסמוך עליהם? איפה הלקוחות הקודמים שלהם? איפה הפידבקים?"
              </p>
              <p className="font-semibold text-white">
                קבל את האמת דוגרי, בלי סיפורים: אנחנו חברה צעירה ורעבה. אין לנו 500 לקוחות תעשייתיים שיושבים לנו על הראש, וזה בדיוק היתרון הכי גדול שלך.
              </p>
              <p>
                בחברות הגדולות והוותיקות, אתה תהיה עוד תיק לקוח קטן שנזרק בין פקידים, ואף אחד לא יענה לך בוואטסאפ בערב כשתהיה בלחץ על הסחורה שלך. אצלנו – אתה מלך. הפרויקט שלך מקבל 100% מהפוקוס, מהזמן ומהלב של שנינו באופן אישי. אנחנו נלחם על כל שקל ועל כל אישור מכס שלך כאילו זה העסק הפרטי שלנו.
              </p>
            </div>

            {/* Zero Risk Box with Emerald highlights */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row gap-4 items-start md:items-center text-right">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-400 mb-1">אנחנו מורידים את הסיכון שלך לאפס מוחלט:</h4>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  אנחנו עובדים אך ורק על בסיס הצלחה ואבני דרך. בשלב הראשון אנחנו לא מבקשים ממך שקל על השירות. אנחנו עושים עבורך את בדיקת ההיתכנות, איתור המפעל וחישוב העלויות בחינם. אתה תשלם לנו על הניהול רק כשהכול מאושר, חתום ויוצא לדרך לפי התוכנית. <span className="text-white font-semibold">אם לא מצאנו לך חיסכון משמעותי – לא שילמת כלום.</span>
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 6: ROADMAP */}
      <section 
        id="roadmap" 
        className="py-24 bg-white"
      >
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase mb-3 block">מפת הדרכים</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#0F172A]">
              הדרך שלך לחיסכון ושקט נפשי ב-4 צעדים קלים:
            </h2>
          </div>

          {/* Timeline steps */}
          <div className="relative pr-6 md:pr-12 border-r-2 border-slate-100 space-y-12">
            
            {/* Step 1 */}
            <div className="relative text-right">
              {/* Pulsing step number */}
              <span className="absolute right-0 top-0 translate-x-[calc(50%+1px)] md:translate-x-[calc(50%+1px)] w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border-2 border-[#2563EB] flex items-center justify-center text-xs md:text-sm font-bold text-[#2563EB] shadow-md shadow-blue-500/10">
                01
              </span>
              <div className="pr-4 md:pr-6">
                <h3 className="text-base md:text-lg font-bold text-[#0F172A] mb-2">שלב 1: שיחת בדיקה (בחינם)</h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed max-w-2xl">
                  אתה מראה לנו מה אתה קונֶה היום בארץ ובאיזה מחיר, ואנחנו בודקים לך תוך כמה ימים בכמה אפשר להביא את זה ישירות מחו"ל.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative text-right">
              <span className="absolute right-0 top-0 translate-x-[calc(50%+1px)] w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center text-xs md:text-sm font-bold text-slate-500 shadow-md">
                02
              </span>
              <div className="pr-4 md:pr-6">
                <h3 className="text-base md:text-lg font-bold text-[#0F172A] mb-2">שלב 2: איתור המפעל וסגירת המחיר</h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed max-w-2xl">
                  אנחנו מוצאים את המפעל האמין ביותר בחו"ל, סוגרים את מחיר הרכש הנמוך ביותר ומפיקים את כל אישורי הייבוא הנדרשים.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative text-right">
              <span className="absolute right-0 top-0 translate-x-[calc(50%+1px)] w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center text-xs md:text-sm font-bold text-slate-500 shadow-md">
                03
              </span>
              <div className="pr-4 md:pr-6">
                <h3 className="text-base md:text-lg font-bold text-[#0F172A] mb-2">שלב 3: הובלה ושחרור מהמכס</h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed max-w-2xl">
                  אנחנו מעלים את הסחורה לים או לאוויר, ומטפלים בכל הבירוקרטיה, הניירות והשחרור בנמלים בישראל.
                </p>
              </div>
            </div>

            {/* Step 4 (Emerald green Success flag) */}
            <div className="relative text-right">
              <span className="absolute right-0 top-0 translate-x-[calc(50%+1px)] w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border-2 border-[#10B981] flex items-center justify-center text-xs md:text-sm font-bold text-[#10B981] shadow-md shadow-emerald-500/10">
                04
              </span>
              <div className="pr-4 md:pr-6">
                <h3 className="text-base md:text-lg font-bold text-[#10B981] mb-2">שלב 4: פריקה אצלך בעסק</h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed max-w-2xl">
                  משאית מגיעה ופורקת את המוצרים אצלך במחסן. אתה חותם, מתחיל למכור ומרוויח פי 2.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 7: THE LEAD FORM (CTA BOX) */}
      <section 
        id="cta" 
        className="py-24 bg-[#0F172A] text-white relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-600/5 blur-[160px] pointer-events-none" />

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          
          <div className="bg-[#1E293B] border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative">
            
            {/* Header copy */}
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-[#10B981] tracking-widest uppercase block mb-3">בדיקת היתכנות חינם ללא התחייבות</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                חבל על כל חודש שאתה ממשיך לשלם ביוקר על מוצרים בארץ.
              </h2>
              <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto">
                השאר פרטים קצרים, ונחזור אליך עם תחזית חיסכון ראשונית למוצר שלך:
              </p>
            </div>

            {/* Form */}
            {isSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 animate-scale-in">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">הפנייה נשלחה בהצלחה!</h3>
                <p className="text-slate-400 text-sm max-w-sm mb-8">
                  תודה רבה, אפק וצוות הלוגיסטיקה כבר בודקים את הפרטים שלך. נחזור אליך עם תחזית חיסכון בתוך 48 שעות.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 rounded-xl transition-all"
                >
                  שלח פנייה נוספת
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
                
                {/* Row 1: Name and Business Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full name input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      שם מלא <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="ישראל ישראלי"
                        className="w-full px-5 py-3.5 bg-slate-900/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 outline-none transition-all pr-12"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 pointer-events-none">
                        <User className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Business name input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      שם העסק <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="שם החברה או העסק שלך"
                        className="w-full px-5 py-3.5 bg-slate-900/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 outline-none transition-all pr-12"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 pointer-events-none">
                        <Building className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Phone and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mobile Phone input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      טלפון נייד <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="052-1234567"
                        className="w-full px-5 py-3.5 bg-slate-900/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 outline-none transition-all pr-12"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 pointer-events-none">
                        <Phone className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Email input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      כתובת אימייל <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full px-5 py-3.5 bg-slate-900/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 outline-none transition-all pr-12 text-left"
                        dir="ltr"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 pointer-events-none">
                        <Mail className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product input (Textarea open field) */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    מה המוצר שאתה קונה כרגע בארץ והיית רוצה לבדוק כמה הוא יעלה בייבוא ישיר? <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea 
                      required
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      placeholder="לדוגמה: כלי עבודה ממתכת, חלקי פלסטיק למכונות, ריהוט משרדי מעץ מורכב..."
                      rows={3}
                      className="w-full px-5 py-3.5 bg-slate-900/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 outline-none transition-all pr-12 resize-none"
                    />
                    <div className="absolute top-4 right-4 text-slate-500 pointer-events-none">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Submit button (Emerald green success color) */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-2xl transition-all duration-200 shadow-xl shadow-emerald-500/20 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-4 cursor-pointer text-sm md:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>מחשב נתוני היתכנות...</span>
                    </>
                  ) : (
                    <>
                      <span>אני רוצה בדיקת רווחיות והוזלת עלויות חינם לייבוא הבא שלי</span>
                      <ArrowLeft className="w-5 h-5" />
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#090D16] text-slate-500 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center items-center gap-2.5 mb-6">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center bg-white/5 border border-white/10 shadow-inner">
              <img src="/logo.png" alt="Nexora Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-base font-bold font-display text-white tracking-wider">
              Nexora
            </span>
          </div>
          <p className="text-xs mb-4">
            כל הזכויות שמורות © {new Date().getFullYear()} Nexora בע"מ. מיוצר בארץ, מביא מחו"ל.
          </p>
          <div className="flex justify-center gap-6 text-xs font-semibold text-slate-400">
            <a href="#hero" onClick={(e) => handleScrollTo(e, 'hero')} className="hover:text-white transition-colors">עמוד ראשי</a>
            <span className="text-slate-800">|</span>
            <a href="#pain" onClick={(e) => handleScrollTo(e, 'pain')} className="hover:text-white transition-colors">איך אנחנו מוזילים עלויות?</a>
            <span className="text-slate-800">|</span>
            <a href="#solution" onClick={(e) => handleScrollTo(e, 'solution')} className="hover:text-white transition-colors">שיטת הייבוא המוגן</a>
            <span className="text-slate-800">|</span>
            <Link href="/login" className="hover:text-white transition-colors">כניסת סוכנים</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
