import { useCRMStore } from '@/store/crmStore';
import en from '@/locales/en.json';
import he from '@/locales/he.json';

export function useTranslation() {
  const language = useCRMStore((state) => state.language);
  const setLanguage = useCRMStore((state) => state.setLanguage);

  const dictionary = language === 'he' ? he : en;

  const t = (key: string): string => {
    const parts = key.split('.');
    let current: any = dictionary;
    for (const part of parts) {
      if (current[part] === undefined) {
        return key;
      }
      current = current[part];
    }
    return typeof current === 'string' ? current : key;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'he' : 'en');
  };

  const dir = language === 'he' ? 'rtl' : 'ltr';

  return { t, language, toggleLanguage, dir: dir as 'ltr' | 'rtl' };
}

export type TranslateFn = ReturnType<typeof useTranslation>['t'];
