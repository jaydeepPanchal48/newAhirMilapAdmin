import { CheckCircle2, Clock, XCircle, UserCheck, UserX, Shield } from 'lucide-react';

export default function Badge({ type = 'default', text, icon = true, className = '' }) {
  const normalized = (text || type).toLowerCase();

  let badgeClass = 'badge-primary';
  let IconComponent = null;

  if (normalized === 'verified') {
    badgeClass = 'badge-verified';
    IconComponent = CheckCircle2;
  } else if (normalized === 'pending') {
    badgeClass = 'badge-pending';
    IconComponent = Clock;
  } else if (normalized === 'rejected') {
    badgeClass = 'badge-rejected';
    IconComponent = XCircle;
  } else if (normalized === 'active') {
    badgeClass = 'badge-active';
    IconComponent = UserCheck;
  } else if (normalized === 'inactive') {
    badgeClass = 'badge-inactive';
    IconComponent = UserX;
  } else if (normalized === 'gold' || normalized === 'super administrator') {
    badgeClass = 'badge-gold';
    IconComponent = Shield;
  }

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {icon && IconComponent && <IconComponent size={12} />}
      <span>{text || type}</span>
    </span>
  );
}
