import { Check, Pencil, Trash, Clock, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import { formatDate, isOverdue } from '../../utils/formatDate';
import { useLang } from '../../context/LanguageContext';

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const { t } = useTranslation('tasks');
  const { lang } = useLang();
  const overdue = task.status === 'pending' && isOverdue(task.dueDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className={`card flex items-start gap-4 transition-all ${task.status === 'done' ? 'opacity-70' : ''}`}
    >
      <button
        onClick={() => onToggle(task)}
        className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors focus-gold
          ${task.status === 'done' ? 'bg-emerald border-emerald' : 'border-slate hover:border-gold'}`}
        aria-label={task.status === 'done' ? t('mark_pending') : t('mark_done')}
      >
        {task.status === 'done' && <Check size={12} className="text-midnight" strokeWidth={3} />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-cream font-medium ${task.status === 'done' ? 'line-through text-slate' : ''}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-slate text-sm mt-0.5 line-clamp-2">{task.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <Badge variant={task.priority}>{t(task.priority)}</Badge>
          {task.status === 'done' && <Badge variant="done">{t('done')}</Badge>}
          {overdue && <Badge variant="overdue"><Clock size={10} />{t('overdue')}</Badge>}
          {task.category && <span className="text-slate text-xs">{task.category}</span>}
          {task.dueDate && (
            <span className={`text-xs flex items-center gap-1 ${overdue ? 'text-rose' : 'text-slate'}`}>
              <Clock size={10} />
              {formatDate(task.dueDate, lang)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {task.status === 'done' && (
          <button onClick={() => onToggle(task)} title={t('mark_pending')} className="p-1.5 text-slate hover:text-cream rounded focus-gold">
            <RotateCcw size={14} />
          </button>
        )}
        <button onClick={() => onEdit(task)} title={t('edit_task')} className="p-1.5 text-slate hover:text-gold rounded focus-gold">
          <Pencil size={14} />
        </button>
        <button onClick={() => onDelete(task)} title={t('delete')} className="p-1.5 text-slate hover:text-rose rounded focus-gold">
          <Trash size={14} />
        </button>
      </div>
    </motion.div>
  );
}
