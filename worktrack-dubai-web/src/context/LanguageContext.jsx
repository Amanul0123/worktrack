import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { userService } from '../services/userService';
import { useAuth } from './AuthContext';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');

  useEffect(() => {
    if (user?.preferredLanguage && user.preferredLanguage !== lang) {
      applyLanguage(user.preferredLanguage);
    }
  }, [user]);

  function applyLanguage(l) {
    setLang(l);
    localStorage.setItem('lang', l);
    i18n.changeLanguage(l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  }

  async function toggleLanguage() {
    const next = lang === 'en' ? 'ar' : 'en';
    applyLanguage(next);
    if (user) {
      try {
        await userService.updateLanguage(next);
      } catch {
        // non-fatal
      }
    }
  }

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
