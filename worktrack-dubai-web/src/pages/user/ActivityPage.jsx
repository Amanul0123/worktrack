import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DashboardShell from '../../components/layout/DashboardShell';
import Card from '../../components/ui/Card';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import { SkeletonRow } from '../../components/ui/Skeleton';
import api from '../../services/apiClient';

export default function ActivityPage() {
  const { t } = useTranslation('dashboard');
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['activity', page],
    queryFn: () => api.get('/activity', { params: { page, limit } }).then(r => r.data),
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  return (
    <DashboardShell title={t('activity')}>
      <div className="max-w-xl">
        <Card>
          {isLoading
            ? <div className="space-y-2">{[1,2,3,4,5].map(i => <SkeletonRow key={i} />)}</div>
            : <ActivityFeed logs={data?.logs ?? []} />
          }

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-raised text-slate text-sm">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page <= 1}
                className="flex items-center gap-1 hover:text-cream disabled:opacity-40"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <span className="tabular">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
                className="flex items-center gap-1 hover:text-cream disabled:opacity-40"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </Card>
      </div>
    </DashboardShell>
  );
}
