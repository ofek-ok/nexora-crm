import { useCRMStore } from '@/store/crmStore';
import { useEffect } from 'react';
import en from '@/locales/en.json';
import he from '@/locales/he.json';

type LocaleType = typeof en;

const locales = { en, he };

export function useTranslation() {
  const language = useCRMStore((state) => state.language);
  const setLanguage = useCRMStore((state) => state.setLanguage);

  useEffect(() => {
    // Dynamic body direction updates
    if (typeof document !== 'undefined') {
      const dir = language === 'he' ? 'rtl' : 'ltr';
      document.documentElement.dir = dir;
      document.documentElement.lang = language;
      
      // Also apply RTL/LTR classes for tailwind variant if needed
      document.body.dir = dir;
    }
  }, [language]);

  const t = (key: string): string => {
    const dictionary = locales[language] || en;
    const parts = key.split('.');
    
    let current: any = dictionary;
    for (const part of parts) {
      if (current[part] === undefined) {
        // Fallback to English
        let fallback: any = en;
        for (const fPart of parts) {
          if (fallback[fPart] === undefined) {
            return key; // return raw key if missing completely
          }
          fallback = fallback[fPart];
        }
        return typeof fallback === 'string' ? fallback : key;
      }
      current = current[part];
    }

    return typeof current === 'string' ? current : key;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'he' : 'en');
  };

  return { t, language, toggleLanguage, dir: language === 'he' ? 'rtl' : 'ltr' };
}
export type TranslateFn = ReturnType<typeof useTranslation>['t'];
