import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enDashboard from './locales/en/dashboard.json';
import enTasks from './locales/en/tasks.json';
import enAdmin from './locales/en/admin.json';

import arCommon from './locales/ar/common.json';
import arAuth from './locales/ar/auth.json';
import arDashboard from './locales/ar/dashboard.json';
import arTasks from './locales/ar/tasks.json';
import arAdmin from './locales/ar/admin.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon, auth: enAuth, dashboard: enDashboard, tasks: enTasks, admin: enAdmin },
    ar: { common: arCommon, auth: arAuth, dashboard: arDashboard, tasks: arTasks, admin: arAdmin },
  },
  lng: localStorage.getItem('lang') || 'en',
  fallbackLng: 'en',
  ns: ['common', 'auth', 'dashboard', 'tasks', 'admin'],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
});

export default i18n;
