import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Activity, User, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const userNav = [
  { to: '/dashboard', icon: LayoutDashboard },
  { to: '/tasks', icon: CheckSquare },
  { to: '/activity', icon: Activity },
  { to: '/profile', icon: User },
  { to: '/settings', icon: Settings },
];

const adminNav = [
  { to: '/admin', icon: LayoutDashboard },
  { to: '/admin/users', icon: User },
];

export default function BottomNav() {
  const { user } = useAuth();
  const nav = user?.role === 'admin' ? adminNav : userNav;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-surface border-t border-surface-raised flex z-20">
      {nav.map(({ to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/admin'}
          className={({ isActive }) =>
            `flex-1 flex items-center justify-center py-3 transition-colors ${isActive ? 'text-gold' : 'text-slate'}`
          }
        >
          <Icon size={22} />
        </NavLink>
      ))}
    </nav>
  );
}
