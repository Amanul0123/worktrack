import LanguageToggle from '../language/LanguageToggle';
import Avatar from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ title }) {
  const { user } = useAuth();
  return (
    <header className="flex items-center justify-between px-5 py-3.5 border-b border-surface-raised bg-midnight sticky top-0 z-10">
      <h1 className="text-cream font-semibold text-lg">{title}</h1>
      <div className="flex items-center gap-3">
        <LanguageToggle />
        <Avatar user={user} size="sm" />
      </div>
    </header>
  );
}
