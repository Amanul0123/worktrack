import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import DashboardShell from '../../components/layout/DashboardShell';
import TaskList from '../../components/tasks/TaskList';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskForm from '../../components/tasks/TaskForm';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { taskService } from '../../services/taskService';

export default function TasksPage() {
  const { t } = useTranslation(['tasks', 'common']);
  const qc = useQueryClient();
  const toast = useToast();

  const [filters, setFilters] = useState({ page: 1, limit: 20 });
  const [editTask, setEditTask] = useState(null);
  const [creating, setCreating] = useState(false);

  const qKey = ['tasks', filters];
  const { data, isLoading } = useQuery({
    queryKey: qKey,
    queryFn: () => taskService.list(filters),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['tasks'] });

  const createMutation = useMutation({
    mutationFn: taskService.create,
    onSuccess: () => {
      invalidate();
      qc.invalidateQueries({ queryKey: ['dashboard-summary'] });
      setCreating(false);
      toast({ message: t('tasks:task_created') });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => taskService.update(id, data),
    onSuccess: () => {
      invalidate();
      setEditTask(null);
      toast({ message: t('tasks:task_updated') });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }) => taskService.toggleStatus(id, status),
    onSuccess: (_, { status }) => {
      invalidate();
      qc.invalidateQueries({ queryKey: ['dashboard-summary'] });
      toast({ message: status === 'done' ? t('tasks:task_completed') : t('tasks:task_updated') });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => taskService.delete(id),
    onSuccess: () => {
      invalidate();
      qc.invalidateQueries({ queryKey: ['dashboard-summary'] });
      toast({ message: t('tasks:task_deleted') });
    },
  });

  const handleToggle = (task) => {
    toggleMutation.mutate({ id: task.id, status: task.status === 'done' ? 'pending' : 'done' });
  };

  const handleDelete = (task) => {
    if (window.confirm(t('tasks:confirm_delete_task'))) {
      deleteMutation.mutate(task.id);
    }
  };

  const totalPages = data ? Math.ceil(data.total / filters.limit) : 1;

  return (
    <DashboardShell title={t('tasks:tasks')}>
      <div className="space-y-5 max-w-3xl">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <TaskFilters
            filters={filters}
            onChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
          />
          <Button onClick={() => setCreating(true)} className="shrink-0">
            <Plus size={16} />
            {t('tasks:add_task')}
          </Button>
        </div>

        <TaskList
          tasks={data?.tasks}
          loading={isLoading}
          onToggle={handleToggle}
          onEdit={setEditTask}
          onDelete={handleDelete}
        />

        {totalPages > 1 && (
          <div className="flex items-center justify-between text-slate text-sm">
            <span>{t('common:showing')} {data?.tasks?.length} {t('common:of')} {data?.total} {t('common:results')}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
                disabled={filters.page <= 1}
                className="p-1.5 rounded border border-surface-raised hover:border-gold disabled:opacity-40 focus-gold"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-3 py-1.5 rounded border border-surface-raised tabular">{filters.page} / {totalPages}</span>
              <button
                onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
                disabled={filters.page >= totalPages}
                className="p-1.5 rounded border border-surface-raised hover:border-gold disabled:opacity-40 focus-gold"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title={t('tasks:add_task')}>
        <TaskForm onSubmit={(d) => createMutation.mutate(d)} loading={createMutation.isPending} />
      </Modal>

      <Modal open={!!editTask} onClose={() => setEditTask(null)} title={t('tasks:edit_task')}>
        {editTask && (
          <TaskForm
            defaultValues={editTask}
            onSubmit={(d) => updateMutation.mutate({ id: editTask.id, data: d })}
            loading={updateMutation.isPending}
          />
        )}
      </Modal>
    </DashboardShell>
  );
}
