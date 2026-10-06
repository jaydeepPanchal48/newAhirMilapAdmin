import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import styles from './NotFoundPage.module.scss';

export default function NotFoundPage() {
  return (
    <div className={styles.notFoundWrap}>
      <h1 className={styles.errorCode}>404</h1>
      <h2 className={styles.title}>Page Not Found</h2>
      <p className={styles.description}>
        The requested administrative route or user profile cannot be located.
      </p>
      <div className={styles.actions}>
        <Link to="/dashboard" className="btn btn-primary">
          <Home size={16} />
          <span>Return to Dashboard</span>
        </Link>
        <Link to="/users" className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>All User Profiles</span>
        </Link>
      </div>
    </div>
  );
}
