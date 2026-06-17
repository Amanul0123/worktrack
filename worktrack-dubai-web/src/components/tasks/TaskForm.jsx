import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(2000).optional(),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  category: z.string().max(100).optional(),
  dueDate: z.string().optional(),
});

export default function TaskForm({ defaultValues, onSubmit, loading }) {
  const { t } = useTranslation('tasks');
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      priority: 'medium',
      ...defaultValues,
      dueDate: defaultValues?.dueDate ? new Date(defaultValues.dueDate).toISOString().slice(0, 16) : '',
    },
  });

  const submit = (data) => {
    onSubmit({
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <label className="label">{t('task_title')} *</label>
        <input {...register('title')} className="input" placeholder={t('title_placeholder')} />
        {errors.title && <p className="text-rose text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="label">{t('description')}</label>
        <textarea {...register('description')} className="input min-h-[80px] resize-none" placeholder={t('description_placeholder')} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">{t('priority')}</label>
          <select {...register('priority')} className="input">
            <option value="high">{t('high')}</option>
            <option value="medium">{t('medium')}</option>
            <option value="low">{t('low')}</option>
          </select>
        </div>
        <div>
          <label className="label">{t('category')}</label>
          <input {...register('category')} className="input" placeholder={t('category_placeholder')} />
        </div>
      </div>

      <div>
        <label className="label">{t('due_date')}</label>
        <input type="datetime-local" {...register('dueDate')} className="input" />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading} className="flex-1">
          {t('save_changes', { ns: 'common' })}
        </Button>
      </div>
    </form>
  );
}
