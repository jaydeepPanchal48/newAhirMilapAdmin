import { useState } from 'react';
import {
  User,
  Shield,
  Key,
  Save,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import styles from './AdminProfilePage.module.scss';

export default function AdminProfilePage() {
  const { admin, updateProfile } = useAuth();
  const toast = useToast();

  const [profileForm, setProfileForm] = useState({
    name: admin?.name || 'Administrator',
    email: admin?.email || 'admin@ahirmilap.com',
    department: admin?.department || 'Matchmaking & Verification Desk',
    role: admin?.role || 'Super Administrator',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    toast.success('Admin profile details updated successfully.');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }

    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    toast.success('Security password has been changed successfully.');
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.pageHeader}>
        <div>
          <span className={styles.breadcrumb}>ADMINISTRATOR CREDENTIALS</span>
          <h1 className={styles.title}>Admin Profile & Security</h1>
          <p className={styles.subtitle}>
            Manage your administrator credentials, access permissions, and account
            security settings.
          </p>
        </div>
      </div>

      <div className={styles.gridContainer}>
        {/* Profile Card */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <User size={18} className={styles.iconBurgundy} />
            <h3>Administrator Details</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.avatarRow}>
              <img
                src={admin?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160'}
                alt="Admin"
                className={styles.avatarImg}
              />
              <div>
                <strong className={styles.adminTitle}>{admin?.name}</strong>
                <span className={styles.adminRole}>{admin?.role}</span>
                <span className={styles.badgePerm}>
                  <ShieldCheck size={12} /> Full Administrative Access
                </span>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className={styles.formCol}>
              <div className={styles.formGroup}>
                <label>Admin Display Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Login Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Department / Desk</label>
                <input
                  type="text"
                  value={profileForm.department}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, department: e.target.value }))
                  }
                />
              </div>

              <button type="submit" className="btn btn-primary btn-sm">
                <Save size={15} />
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>
        </div>

        {/* Change Password Card */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <Key size={18} className={styles.iconBurgundy} />
            <h3>Change Access Password</h3>
          </div>
          <div className={styles.cardBody}>
            <form onSubmit={handlePasswordSubmit} className={styles.formCol}>
              <div className={styles.formGroup}>
                <label>Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({
                      ...p,
                      currentPassword: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>New Password (min 6 characters)</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({
                      ...p,
                      confirmPassword: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <button type="submit" className="btn btn-secondary btn-sm">
                <Lock size={15} />
                <span>Update Password</span>
              </button>
            </form>
          </div>
        </div>

        {/* Recent Admin Audit Activity */}
        <div className={`${styles.sectionCard} ${styles.fullWidth}`}>
          <div className={styles.cardHeader}>
            <Clock size={18} className={styles.iconBurgundy} />
            <h3>Recent Administrative Actions Log</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.auditList}>
              <div className={styles.auditItem}>
                <span className={styles.auditDot} />
                <div>
                  <strong>Aadhaar Verification Completed</strong>
                  <p>Verified profile AM-2026-004 (Dr. Nishaben Jadav) with medical council records.</p>
                  <small>Today at 10:45 AM</small>
                </div>
              </div>
              <div className={styles.auditItem}>
                <span className={styles.auditDot} />
                <div>
                  <strong>Profile Activated</strong>
                  <p>Activated profile AM-2026-005 (Hardik Devayatbhai Gojiya) after business GST review.</p>
                  <small>Yesterday at 04:20 PM</small>
                </div>
              </div>
              <div className={styles.auditItem}>
                <span className={styles.auditDot} />
                <div>
                  <strong>Security Sign-in Recorded</strong>
                  <p>Successful admin login from workstation IP 172.20.10.3.</p>
                  <small>06 Oct 2026 at 00:28 AM</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
