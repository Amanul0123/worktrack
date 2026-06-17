import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Users, CheckCircle, Activity, TrendingUp } from 'lucide-react';
import DashboardShell from '../../components/layout/DashboardShell';
import StatCard from '../../components/dashboard/StatCard';
import StatsCharts from '../../components/admin/StatsCharts';
import { adminService } from '../../services/adminService';

export default function AdminOverviewPage() {
  const { t } = useTranslation('admin');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getStats,
    refetchInterval: 60000,
  });

  return (
    <DashboardShell title={t('overview')}>
      <div className="space-y-6 max-w-6xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label={t('total_users')} value={stats?.totalUsers} icon={Users} color="gold" loading={isLoading} />
          <StatCard label={t('total_tasks')} value={stats?.totalTasks} icon={CheckCircle} color="slate" loading={isLoading} />
          <StatCard label={t('active_today')} value={stats?.activeUsersToday} icon={Activity} color="emerald" loading={isLoading} />
          <StatCard label={t('completion_rate')} value={stats ? `${stats.completionRate}%` : undefined} icon={TrendingUp} color="gold" loading={isLoading} />
        </div>

        {stats && <StatsCharts stats={stats} />}
      </div>
    </DashboardShell>
  );
}
