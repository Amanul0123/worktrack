import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import DashboardShell from '../../components/layout/DashboardShell';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import TaskCard from '../../components/tasks/TaskCard';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { adminService } from '../../services/adminService';
import { formatDate } from '../../utils/formatDate';
import { useLang } from '../../context/LanguageContext';

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('admin');
  const { lang } = useLang();
  const [tab, setTab] = useState('tasks');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => adminService.getUserDetail(id),
  });

  const tabs = [
    { key: 'tasks', label: t('user_tasks') },
    { key: 'activity', label: t('user_activity') },
  ];

  if (isLoading) {
    return (
      <DashboardShell title="User detail">
        <div className="space-y-4 max-w-3xl">
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      </DashboardShell>
    );
  }

  const { user, tasks, activityLogs } = data;

  return (
    <DashboardShell title={user.fullName}>
      <div className="space-y-5 max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate hover:text-cream text-sm transition-colors focus-gold"
        >
          <ArrowLeft size={16} />
          {t('users')}
        </button>

        <Card>
          <div className="flex items-start gap-4">
            <Avatar user={user} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-2xl text-cream">{user.fullName}</h2>
                <Badge variant={user.isActive ? 'active' : 'inactive'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-slate text-sm mt-0.5">{user.email}</p>
              {user.city && <p className="text-slate text-sm">{user.city}, {user.country}</p>}
              {user.bio && <p className="text-cream text-sm mt-2">{user.bio}</p>}
              <p className="text-slate text-xs mt-3">Joined {formatDate(user.createdAt, lang)}</p>
            </div>
            <div className="text-end">
              <p className="tabular text-2xl font-display text-gold">{tasks.length}</p>
              <p className="text-slate text-xs">total tasks</p>
              <p className="tabular text-2xl font-display text-emerald mt-2">
                {tasks.filter(t => t.status === 'done').length}
              </p>
              <p className="text-slate text-xs">completed</p>
            </div>
          </div>
        </Card>

        <div className="flex border-b border-surface-raised">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors focus-gold
                ${tab === key ? 'border-gold text-gold' : 'border-transparent text-slate hover:text-cream'}`}
            >
              {label} {key === 'tasks' ? `(${tasks.length})` : `(${activityLogs.length})`}
            </button>
          ))}
        </div>

        {tab === 'tasks' && (
          <div className="space-y-3">
            {tasks.length === 0
              ? <p className="text-slate text-sm">No tasks yet.</p>
              : tasks.map((task) => (
                <div key={task.id} className="card flex items-start gap-3">
                  <div className={`mt-1 w-4 h-4 rounded-sm border flex items-center justify-center shrink-0
                    ${task.status === 'done' ? 'bg-emerald border-emerald' : 'border-slate'}`} />
                  <div>
                    <p className={`text-sm text-cream ${task.status === 'done' ? 'line-through text-slate' : ''}`}>{task.title}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant={task.priority}>{task.priority}</Badge>
                      {task.dueDate && <span className="text-slate text-xs">{formatDate(task.dueDate, lang)}</span>}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {tab === 'activity' && (
          <Card>
            <ActivityFeed logs={activityLogs} />
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
