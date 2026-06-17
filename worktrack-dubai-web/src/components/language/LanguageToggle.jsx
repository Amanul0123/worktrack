import { useLang } from '../../context/LanguageContext';

export default function LanguageToggle() {
  const { lang, toggleLanguage } = useLang();
  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center rounded-full bg-surface-raised border border-surface-raised overflow-hidden text-xs font-medium focus-gold"
      aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <span className={`px-3 py-1.5 transition-colors ${lang === 'en' ? 'bg-gold text-midnight' : 'text-slate hover:text-cream'}`}>EN</span>
      <span className={`px-3 py-1.5 transition-colors font-arabic ${lang === 'ar' ? 'bg-gold text-midnight' : 'text-slate hover:text-cream'}`}>عربي</span>
    </button>
  );
}
