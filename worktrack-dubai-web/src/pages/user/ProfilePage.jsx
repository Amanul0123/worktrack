import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Camera } from 'lucide-react';
import { useRef } from 'react';
import DashboardShell from '../../components/layout/DashboardShell';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { COUNTRIES, DIAL_CODES } from '../../utils/constants';

export default function ProfilePage() {
  const { t } = useTranslation('common');
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const fileRef = useRef();

  const { register, handleSubmit, formState: { isDirty } } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      mobile: user?.mobile || '',
      countryCode: user?.countryCode || '+971',
      country: user?.country || '',
      city: user?.city || '',
      bio: user?.bio || '',
    },
  });

  const updateMutation = useMutation({
    mutationFn: userService.updateMe,
    onSuccess: () => {
      refreshUser();
      toast({ message: 'Changes saved' });
    },
  });

  const avatarMutation = useMutation({
    mutationFn: userService.uploadAvatar,
    onSuccess: () => {
      refreshUser();
      toast({ message: 'Profile photo updated' });
    },
    onError: () => toast({ message: 'Failed to upload photo', type: 'error' }),
  });

  return (
    <DashboardShell title="Profile">
      <div className="space-y-5 max-w-xl">
        <Card>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <Avatar user={user} size="xl" />
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 end-0 p-1.5 bg-gold rounded-full text-midnight hover:bg-gold-soft transition-colors focus-gold"
              >
                <Camera size={14} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && avatarMutation.mutate(e.target.files[0])}
              />
            </div>
            <div>
              <p className="font-display text-2xl text-cream">{user?.fullName}</p>
              <p className="text-slate text-sm">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <input {...register('fullName')} className="input" />
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
                <label className="label">Mobile</label>
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
              <label className="label">Bio</label>
              <textarea {...register('bio')} className="input min-h-[80px] resize-none" />
            </div>
            <Button type="submit" loading={updateMutation.isPending} disabled={!isDirty}>
              {t('save_changes')}
            </Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
