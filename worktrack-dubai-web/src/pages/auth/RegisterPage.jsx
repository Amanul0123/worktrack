import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import AuthShell from '../../components/layout/AuthShell';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';

const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function RegisterPage() {
  const { t } = useTranslation(['auth', 'common']);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await registerUser(data);
      navigate('/onboarding', { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.error || t('common:error_generic'));
    }
  };

  return (
    <AuthShell>
      <Card>
        <h2 className="font-display text-2xl text-cream mb-1">{t('auth:create_account')}</h2>
        <p className="text-slate text-sm mb-6">Join WorkTrack Dubai to get started.</p>

        {serverError && (
          <div className="bg-rose/10 border border-rose/30 rounded-control px-4 py-2.5 text-rose text-sm mb-4">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">{t('auth:full_name')}</label>
            <input {...register('fullName')} className="input" placeholder="Ahmed Al-Rashidi" />
            {errors.fullName && <p className="text-rose text-xs mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="label">{t('auth:email')}</label>
            <input {...register('email')} type="email" className="input" placeholder={t('auth:email_placeholder')} />
            {errors.email && <p className="text-rose text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">{t('auth:password')}</label>
            <input {...register('password')} type="password" className="input" placeholder={t('auth:password_placeholder')} />
            {errors.password && <p className="text-rose text-xs mt-1">{errors.password.message}</p>}
          </div>
          <Button type="submit" loading={isSubmitting} className="w-full justify-center">
            {isSubmitting ? t('auth:creating') : t('auth:sign_up')}
          </Button>
        </form>

        <p className="text-center text-slate text-sm mt-5">
          {t('auth:have_account')}{' '}
          <Link to="/login" className="text-gold hover:text-gold-soft focus-gold rounded">
            {t('auth:sign_in')}
          </Link>
        </p>
      </Card>
    </AuthShell>
  );
}
