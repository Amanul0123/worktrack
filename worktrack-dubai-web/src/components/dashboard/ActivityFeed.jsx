import { useTranslation } from 'react-i18next';
import { CheckCircle, Plus, Edit, Trash, LogIn, User } from 'lucide-react';
import { formatDateTime } from '../../utils/formatDate';
import { useLang } from '../../context/LanguageContext';

const icons = {
  login: { Icon: LogIn, color: 'text-slate' },
  task_created: { Icon: Plus, color: 'text-gold' },
  task_updated: { Icon: Edit, color: 'text-slate' },
  task_completed: { Icon: CheckCircle, color: 'text-emerald' },
  task_deleted: { Icon: Trash, color: 'text-rose' },
  profile_updated: { Icon: User, color: 'text-slate' },
};

const labels = {
  login: 'Signed in',
  task_created: 'Created task',
  task_updated: 'Updated task',
  task_completed: 'Completed task',
  task_deleted: 'Deleted task',
  profile_updated: 'Updated profile',
};

export default function ActivityFeed({ logs = [] }) {
  const { t } = useTranslation('dashboard');
  const { lang } = useLang();

  if (!logs.length) {
    return <p className="text-slate text-sm py-4">{t('no_activity')}</p>;
  }

  return (
    <ol className="space-y-3">
      {logs.map((log) => {
        const { Icon, color } = icons[log.action] || icons.login;
        const title = log.metadata?.title;
        return (
          <li key={log.id} className="flex items-start gap-3">
            <div className="mt-0.5 w-7 h-7 rounded-full bg-surface-raised flex items-center justify-center shrink-0">
              <Icon size={14} className={color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-cream text-sm">{labels[log.action]}{title ? `: "${title}"` : ''}</p>
              <p className="text-slate text-xs mt-0.5">{formatDateTime(log.createdAt, lang)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
