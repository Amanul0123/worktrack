import { AnimatePresence } from 'framer-motion';
import { CheckSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TaskCard from './TaskCard';
import EmptyState from '../ui/EmptyState';
import { SkeletonCard } from '../ui/Skeleton';

export default function TaskList({ tasks, loading, onToggle, onEdit, onDelete }) {
  const { t } = useTranslation('tasks');

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!tasks?.length) {
    return (
      <EmptyState
        icon={CheckSquare}
        title={t('no_tasks')}
      />
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </AnimatePresence>
    </div>
  );
}
