import styles from './Skeleton.module.scss';

export default function Skeleton({ width = '100%', height = '20px', borderRadius = '6px', className = '' }) {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}

export function TableSkeleton({ rows = 6, cols = 7 }) {
  return (
    <div className={styles.tableSkeletonWrap}>
      <div className={styles.skeletonHeader}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} height="20px" width={i === 0 ? '60px' : i === 1 ? '140px' : '100px'} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className={styles.skeletonRow}>
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={c}
              height="24px"
              width={c === 0 ? '40px' : c === 1 ? '160px' : '100px'}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
