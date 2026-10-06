import { useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  Database,
  Save,
  RotateCcw,
  Download,
  CheckCircle2,
  Lock,
  Globe,
} from 'lucide-react';
import { userService } from '@/services/userService';
import { useToast } from '@/context/ToastContext';
import styles from './SettingsPage.module.scss';

export default function SettingsPage() {
  const toast = useToast();

  const [platformSettings, setPlatformSettings] = useState({
    platformName: 'AhirMilap Matrimonial Matchmaking',
    supportPhone: '+91 98765 43210',
    supportEmail: 'contact@ahirmilap.com',
    deskHours: 'Monday - Sunday: 9:00 AM to 9:00 PM (IST)',
    officeLocation: 'Ahmedabad, Gujarat, India',
    strictAhirCommunity: true,
    requirePhotoForMatch: true,
    requireAadhaarVerification: true,
    enableEmailNotifications: true,
    enableSmsAlerts: false,
  });

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Platform configuration saved successfully.');
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to restore the initial 30 mock profiles? Any custom edits will be replaced.'
      )
    ) {
      userService.resetDefaults();
      toast.success('Matrimony database restored to default 30 sample profiles.');
    }
  };

  const handleExportBackup = () => {
    const users = userService.getAllUsers();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(users, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `AhirMilap_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Complete database JSON backup downloaded.');
  };

  return (
    <div className={styles.settingsPage}>
      <div className={styles.pageHeader}>
        <div>
          <span className={styles.breadcrumb}>SYSTEM SETTINGS</span>
          <h1 className={styles.title}>Platform & Verification Configuration</h1>
          <p className={styles.subtitle}>
            Manage operational parameters, matchmaking verification policies, and data
            backups.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className={styles.settingsForm}>
        {/* Verification Policy Card */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <Shield size={18} className={styles.iconBurgundy} />
            <div>
              <h3>Matchmaking & Verification Policies</h3>
              <p>Control criteria for profile verification and community screening</p>
            </div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.checkboxList}>
              <label className={styles.checkItem}>
                <input
                  type="checkbox"
                  checked={platformSettings.strictAhirCommunity}
                  onChange={(e) =>
                    setPlatformSettings((p) => ({
                      ...p,
                      strictAhirCommunity: e.target.checked,
                    }))
                  }
                />
                <div>
                  <strong>Enforce Ahir Community Verification</strong>
                  <span>
                    Profiles must specify native place in Gujarat/Kutch/Saurashtra and Ahir
                    family background.
                  </span>
                </div>
              </label>

              <label className={styles.checkItem}>
                <input
                  type="checkbox"
                  checked={platformSettings.requireAadhaarVerification}
                  onChange={(e) =>
                    setPlatformSettings((p) => ({
                      ...p,
                      requireAadhaarVerification: e.target.checked,
                    }))
                  }
                />
                <div>
                  <strong>Mandatory Identity Proof Check</strong>
                  <span>
                    Admin must verify government ID card or Aadhaar before granting the
                    &quot;Verified&quot; badge.
                  </span>
                </div>
              </label>

              <label className={styles.checkItem}>
                <input
                  type="checkbox"
                  checked={platformSettings.requirePhotoForMatch}
                  onChange={(e) =>
                    setPlatformSettings((p) => ({
                      ...p,
                      requirePhotoForMatch: e.target.checked,
                    }))
                  }
                />
                <div>
                  <strong>Require Profile Photograph</strong>
                  <span>
                    Do not coordinate match introductions until clear candidate photograph is
                    on file.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Contact Information Desk Settings */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <Globe size={18} className={styles.iconBurgundy} />
            <div>
              <h3>Public Matchmaking Desk Information</h3>
              <p>Displayed on public registration confirmations and communications</p>
            </div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.gridTwo}>
              <div className={styles.formGroup}>
                <label>Helpline Phone / WhatsApp</label>
                <input
                  type="text"
                  value={platformSettings.supportPhone}
                  onChange={(e) =>
                    setPlatformSettings((p) => ({ ...p, supportPhone: e.target.value }))
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>Official Desk Email</label>
                <input
                  type="email"
                  value={platformSettings.supportEmail}
                  onChange={(e) =>
                    setPlatformSettings((p) => ({ ...p, supportEmail: e.target.value }))
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>Assistance Hours</label>
                <input
                  type="text"
                  value={platformSettings.deskHours}
                  onChange={(e) =>
                    setPlatformSettings((p) => ({ ...p, deskHours: e.target.value }))
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>Desk Location</label>
                <input
                  type="text"
                  value={platformSettings.officeLocation}
                  onChange={(e) =>
                    setPlatformSettings((p) => ({
                      ...p,
                      officeLocation: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Database Management & Backups */}
        <div className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <Database size={18} className={styles.iconBurgundy} />
            <div>
              <h3>Database Tools & Mock Data Controls</h3>
              <p>Manage test datasets, download backups, or restore seed data</p>
            </div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.databaseActions}>
              <div className={styles.dbActionRow}>
                <div>
                  <strong>Export Full Database Backup</strong>
                  <p>Save all matrimonial profiles and metadata as an offline JSON backup.</p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleExportBackup}
                >
                  <Download size={15} />
                  <span>Download Backup</span>
                </button>
              </div>

              <div className={styles.dbActionRow}>
                <div>
                  <strong>Restore 30 Seed Profiles</strong>
                  <p>Reset mock data to the initial 30 realistic Ahir matrimonial candidate records.</p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleResetData}
                >
                  <RotateCcw size={15} />
                  <span>Reset Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.saveBar}>
          <button type="submit" className="btn btn-primary">
            <Save size={16} />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
