import en from '@/locales/en.json';

type LocaleType = typeof en;

export function useTranslation() {
  const language = 'en';

  const t = (key: string): string => {
    const dictionary = en;
    const parts = key.split('.');
    
    let current: any = dictionary;
    for (const part of parts) {
      if (current[part] === undefined) {
        return key; // return raw key if missing completely
      }
      current = current[part];
    }

    return typeof current === 'string' ? current : key;
  };

  const toggleLanguage = () => {};

  return { t, language: 'en' as 'en' | 'he', toggleLanguage, dir: 'ltr' as 'ltr' | 'rtl' };
}
export type TranslateFn = ReturnType<typeof useTranslation>['t'];
