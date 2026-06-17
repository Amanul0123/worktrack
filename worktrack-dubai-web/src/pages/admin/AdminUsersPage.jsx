import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import DashboardShell from '../../components/layout/DashboardShell';
import UsersTable from '../../components/admin/UsersTable';
import ExportMenu from '../../components/admin/ExportMenu';
import { adminService } from '../../services/adminService';
import { useToast } from '../../components/ui/Toast';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback';
import { COUNTRIES } from '../../utils/constants';

export default function AdminUsersPage() {
  const { t } = useTranslation('admin');
  const qc = useQueryClient();
  const toast = useToast();

  const [filters, setFilters] = useState({ page: 1, limit: 20 });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', filters],
    queryFn: () => adminService.listUsers(filters),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) => adminService.setUserStatus(id, isActive),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ message: vars.isActive ? 'User activated' : 'User deactivated' });
    },
  });

  const debouncedSearch = useDebouncedCallback(
    (val) => setFilters((p) => ({ ...p, search: val || undefined, page: 1 })),
    350
  );

  const totalPages = data ? Math.ceil(data.total / filters.limit) : 1;

  return (
    <DashboardShell title={t('users')}>
      <div className="space-y-5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate pointer-events-none" />
            <input
              type="search"
              placeholder={t('search_users')}
              onChange={(e) => debouncedSearch(e.target.value)}
              className="input ps-9"
            />
          </div>
          <select
            value={filters.isActive ?? ''}
            onChange={(e) => setFilters((p) => ({ ...p, isActive: e.target.value || undefined, page: 1 }))}
            className="input w-auto"
          >
            <option value="">{t('all_statuses')}</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select
            value={filters.country || ''}
            onChange={(e) => setFilters((p) => ({ ...p, country: e.target.value || undefined, page: 1 }))}
            className="input w-auto"
          >
            <option value="">{t('all_countries')}</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ExportMenu filters={filters} />
        </div>

        <UsersTable
          users={data?.users}
          loading={isLoading}
          onToggleStatus={(u) => toggleMutation.mutate({ id: u.id, isActive: !u.isActive })}
        />

        {totalPages > 1 && (
          <div className="flex items-center justify-between text-slate text-sm">
            <span>{data?.total} users</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))} disabled={filters.page <= 1}
                className="p-1.5 rounded border border-surface-raised hover:border-gold disabled:opacity-40 focus-gold">
                <ChevronLeft size={16} />
              </button>
              <span className="tabular">{filters.page} / {totalPages}</span>
              <button onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))} disabled={filters.page >= totalPages}
                className="p-1.5 rounded border border-surface-raised hover:border-gold disabled:opacity-40 focus-gold">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
