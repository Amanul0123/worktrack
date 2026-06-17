import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import AuthShell from '../../components/layout/AuthShell';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { COUNTRIES, DIAL_CODES, GENDERS } from '../../utils/constants';

export default function OnboardingPage() {
  const { t } = useTranslation(['auth', 'common']);
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      countryCode: '+971',
      country: 'UAE',
      gender: '',
      city: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await userService.updateMe({ ...data, onboardingDone: true });
      await refreshUser();
      navigate('/dashboard', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const skip = async () => {
    await userService.updateMe({ onboardingDone: true });
    await refreshUser();
    navigate('/dashboard', { replace: true });
  };

  return (
    <AuthShell>
      <Card>
        <h2 className="font-display text-2xl text-cream mb-1">{t('auth:complete_profile')}</h2>
        <p className="text-slate text-sm mb-6">{t('auth:complete_profile_desc')}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Full name</label>
            <input {...register('fullName')} className="input" placeholder="Your full name" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Country code</label>
              <select {...register('countryCode')} className="input">
                {DIAL_CODES.map(({ country, code }) => (
                  <option key={code} value={code}>{code} ({country})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Mobile number</label>
              <input {...register('mobile')} className="input" placeholder="501234567" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Country</label>
              <select {...register('country')} className="input">
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">City</label>
              <input {...register('city')} className="input" placeholder="Dubai" />
            </div>
          </div>
          <div>
            <label className="label">Gender</label>
            <select {...register('gender')} className="input">
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className="label">Bio (optional)</label>
            <textarea {...register('bio')} className="input min-h-[60px] resize-none" placeholder="A short bio…" />
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="submit" loading={loading} className="flex-1 justify-center">
              {t('auth:finish_setup')}
            </Button>
            <Button type="button" variant="ghost" onClick={skip}>
              {t('auth:skip')}
            </Button>
          </div>
        </form>
      </Card>
    </AuthShell>
  );
}
