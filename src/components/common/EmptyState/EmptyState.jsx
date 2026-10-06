import { SearchX } from 'lucide-react';
import styles from './EmptyState.module.scss';

export default function EmptyState({
  icon: Icon = SearchX,
  title = 'No records found',
  description = 'Try adjusting your search query or filter options to find what you are looking for.',
  actionLabel,
  onAction,
}) {
  return (
    <div className={styles.emptyContainer}>
      <div className={styles.iconCircle}>
        <Icon size={36} />
      </div>
      <h4 className={styles.title}>{title}</h4>
      <p className={styles.description}>{description}</p>
      {actionLabel && onAction && (
        <button type="button" className="btn btn-secondary btn-sm" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
