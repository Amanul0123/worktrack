import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback';

export default function TaskFilters({ filters, onChange }) {
  const { t } = useTranslation('tasks');
  const debouncedSearch = useDebouncedCallback((val) => onChange({ search: val, page: 1 }), 350);

  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative flex-1 min-w-48">
        <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate pointer-events-none" />
        <input
          type="search"
          placeholder={t('search_tasks')}
          defaultValue={filters.search}
          onChange={(e) => debouncedSearch(e.target.value)}
          className="input ps-9"
        />
      </div>

      <select value={filters.status || ''} onChange={(e) => onChange({ status: e.target.value || undefined, page: 1 })} className="input w-auto">
        <option value="">{t('all_statuses')}</option>
        <option value="pending">{t('pending')}</option>
        <option value="done">{t('done')}</option>
      </select>

      <select value={filters.priority || ''} onChange={(e) => onChange({ priority: e.target.value || undefined, page: 1 })} className="input w-auto">
        <option value="">{t('all_priorities')}</option>
        <option value="high">{t('high')}</option>
        <option value="medium">{t('medium')}</option>
        <option value="low">{t('low')}</option>
      </select>

      <select value={filters.sort || 'createdAt'} onChange={(e) => onChange({ sort: e.target.value })} className="input w-auto">
        <option value="createdAt">Newest</option>
        <option value="dueDate">Due date</option>
        <option value="priority">Priority</option>
      </select>
    </div>
  );
}
