import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { CheckCircle, AlertCircle, ListTodo } from 'lucide-react';
import DashboardShell from '../../components/layout/DashboardShell';
import StatCard from '../../components/dashboard/StatCard';
import ProgressBar from '../../components/dashboard/ProgressBar';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import api from '../../services/apiClient';
import { getGreeting, formatDate } from '../../utils/formatDate';
import { useLang } from '../../context/LanguageContext';

export default function DashboardPage() {
  const { t } = useTranslation(['dashboard', 'common']);
  const { user } = useAuth();
  const { lang } = useLang();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => api.get('/dashboard/summary').then(r => r.data),
    refetchInterval: 30000,
  });

  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['activity', 1],
    queryFn: () => api.get('/activity', { params: { page: 1, limit: 8 } }).then(r => r.data),
  });

  const greetingKey = `greeting_${getGreeting()}`;
  const firstName = user?.fullName?.split(' ')[0];

  return (
    <DashboardShell title={t('dashboard:dashboard')}>
      <div className="space-y-6 max-w-5xl">
        <div>
          <h2 className="font-display text-3xl text-cream">
            {t(`dashboard:${greetingKey}`)}, {firstName}.
          </h2>
          <p className="text-slate mt-1">{formatDate(new Date(), lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label={t('dashboard:total_tasks')} value={stats?.total} icon={ListTodo} color="gold" loading={statsLoading} />
          <StatCard label={t('dashboard:completed')} value={stats?.completed} icon={CheckCircle} color="emerald" loading={statsLoading} />
          <StatCard label={t('dashboard:overdue')} value={stats?.overdue} icon={AlertCircle} color="rose" loading={statsLoading} />
        </div>

        <Card>
          <h3 className="text-cream font-medium mb-4">{t('dashboard:todays_progress')}</h3>
          {stats?.todayTotal === 0
            ? <p className="text-slate text-sm">{t('dashboard:no_tasks_today')}</p>
            : <ProgressBar
                value={stats?.todayDone ?? 0}
                max={stats?.todayTotal ?? 0}
                label={t('dashboard:todays_progress')}
                sublabel={`${stats?.todayTotal ?? 0} ${t('dashboard:tasks_due_today')}`}
              />
          }
        </Card>

        <Card>
          <h3 className="text-cream font-medium mb-4">{t('dashboard:recent_activity')}</h3>
          {activityLoading
            ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-10 animate-pulse bg-surface-raised rounded-control" />)}</div>
            : <ActivityFeed logs={activityData?.logs ?? []} />
          }
        </Card>
      </div>
    </DashboardShell>
  );
}
