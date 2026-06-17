import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DashboardShell from '../../components/layout/DashboardShell';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LanguageToggle from '../../components/language/LanguageToggle';
import { useToast } from '../../components/ui/Toast';
import { userService } from '../../services/userService';

const schema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function SettingsPage() {
  const toast = useToast();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data) => userService.changePassword(data),
    onSuccess: () => {
      toast({ message: 'Password updated' });
      reset();
    },
    onError: (err) => toast({ message: err.response?.data?.error || 'Failed to update password', type: 'error' }),
  });

  return (
    <DashboardShell title="Settings">
      <div className="space-y-5 max-w-md">
        <Card>
          <h3 className="text-cream font-medium mb-4">Language</h3>
          <div className="flex items-center justify-between">
            <p className="text-slate text-sm">Display language</p>
            <LanguageToggle />
          </div>
        </Card>

        <Card>
          <h3 className="text-cream font-medium mb-4">Change password</h3>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div>
              <label className="label">Current password</label>
              <input {...register('currentPassword')} type="password" className="input" />
              {errors.currentPassword && <p className="text-rose text-xs mt-1">{errors.currentPassword.message}</p>}
            </div>
            <div>
              <label className="label">New password</label>
              <input {...register('newPassword')} type="password" className="input" />
              {errors.newPassword && <p className="text-rose text-xs mt-1">{errors.newPassword.message}</p>}
            </div>
            <div>
              <label className="label">Confirm new password</label>
              <input {...register('confirmPassword')} type="password" className="input" />
              {errors.confirmPassword && <p className="text-rose text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" loading={isSubmitting}>Save changes</Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
