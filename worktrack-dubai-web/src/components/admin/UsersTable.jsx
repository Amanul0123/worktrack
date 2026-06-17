import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatDate';
import { useLang } from '../../context/LanguageContext';
import { SkeletonRow } from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';
import { Users } from 'lucide-react';

export default function UsersTable({ users, loading, onToggleStatus }) {
  const { t } = useTranslation(['admin', 'common']);
  const { lang } = useLang();
  const navigate = useNavigate();

  if (loading) {
    return <div className="card divide-y divide-surface-raised">{[1,2,3,4,5].map(i => <SkeletonRow key={i} />)}</div>;
  }

  if (!users?.length) {
    return <EmptyState icon={Users} title={t('admin:no_users')} />;
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-raised">
              {[t('common:name'), t('common:email'), 'Country', t('common:status'), t('admin:tasks'), t('admin:joined'), t('common:actions')].map((h) => (
                <th key={h} className="text-start px-4 py-3 text-slate font-medium text-xs uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-surface-raised hover:bg-surface-raised/40 cursor-pointer transition-colors"
                onClick={() => navigate(`/admin/users/${u.id}`)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar user={u} size="sm" />
                    <span className="text-cream font-medium">{u.fullName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate">{u.email}</td>
                <td className="px-4 py-3 text-slate">{u.country || '—'}</td>
                <td className="px-4 py-3">
                  <Badge variant={u.isActive ? 'active' : 'inactive'}>
                    {u.isActive ? t('common:active') : t('common:inactive')}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate">{u._count?.tasks ?? '—'}</td>
                <td className="px-4 py-3 text-slate">{formatDate(u.createdAt, lang)}</td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onToggleStatus(u)}
                    className={`text-xs px-3 py-1 rounded-control border transition-colors focus-gold
                      ${u.isActive ? 'border-rose/30 text-rose hover:bg-rose/10' : 'border-emerald/30 text-emerald hover:bg-emerald/10'}`}
                  >
                    {u.isActive ? t('admin:deactivate') : t('admin:activate')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
