import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, User, Activity, Settings, LogOut, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

const userNav = [
  { to: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard:dashboard' },
  { to: '/tasks', icon: CheckSquare, labelKey: 'tasks:tasks' },
  { to: '/activity', icon: Activity, labelKey: 'dashboard:activity' },
  { to: '/profile', icon: User, labelKey: 'Profile' },
  { to: '/settings', icon: Settings, labelKey: 'Settings' },
];

const adminNav = [
  { to: '/admin', icon: LayoutDashboard, labelKey: 'admin:overview' },
  { to: '/admin/users', icon: User, labelKey: 'admin:users' },
];

export default function Sidebar() {
  const { t } = useTranslation(['common', 'dashboard', 'tasks', 'admin', 'auth']);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const nav = user?.role === 'admin' ? adminNav : userNav;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-midnight border-e border-surface-raised min-h-screen">
      <div className="p-5 border-b border-surface-raised">
        <span className="font-display text-xl text-gold font-semibold tracking-wide">WorkTrack</span>
        <span className="block text-slate text-xs mt-0.5">Dubai</span>
      </div>

      {user?.role === 'admin' && (
        <div className="px-4 py-2">
          <span className="flex items-center gap-1.5 text-xs text-gold font-medium uppercase tracking-widest">
            <Shield size={12} />
            Admin
          </span>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ to, icon: Icon, labelKey }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-control text-sm transition-colors
              ${isActive ? 'bg-gold/10 text-gold font-medium' : 'text-slate hover:text-cream hover:bg-surface-raised'}`
            }
          >
            <Icon size={18} />
            {t(labelKey, labelKey.split(':')[1] || labelKey)}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-surface-raised">
        <div className="flex items-center gap-3 mb-3">
          <Avatar user={user} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-cream text-sm font-medium truncate">{user?.fullName}</p>
            <p className="text-slate text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate hover:text-rose text-sm w-full px-2 py-1.5 rounded-control hover:bg-rose/10 transition-colors focus-gold"
        >
          <LogOut size={15} />
          {t('auth:sign_out')}
        </button>
      </div>
    </aside>
  );
}
