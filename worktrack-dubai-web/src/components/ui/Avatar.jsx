import { getInitials } from '../../utils/formatDate';

export default function Avatar({ user, size = 'md' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-xl', xl: 'w-24 h-24 text-3xl' };
  const cls = `${sizes[size]} rounded-full flex items-center justify-center font-semibold shrink-0`;

  if (user?.avatarUrl) {
    return <img src={user.avatarUrl} alt={user.fullName} className={`${cls} object-cover`} />;
  }
  return (
    <div className={`${cls} bg-gold/20 text-gold`}>
      {getInitials(user?.fullName)}
    </div>
  );
}
