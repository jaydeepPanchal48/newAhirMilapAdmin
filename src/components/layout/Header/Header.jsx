import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/userService';
import styles from './Header.module.scss';

export default function Header({ onToggleMobileSidebar }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [recentUsers, setRecentUsers] = useState([]);
  const [stats, setStats] = useState({ pendingVerification: 0 });

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const all = userService.getAllUsers();
    setRecentUsers(all.slice(0, 4));
    setStats(userService.getStats());

    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/users?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {/* Mobile Hamburger */}
        <button
          type="button"
          className={styles.menuToggle}
          onClick={onToggleMobileSidebar}
          aria-label="Open sidebar navigation"
        >
          <Menu size={22} />
        </button>

        {/* Global Quick Search Bar */}
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search profiles by name, ID, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <kbd className={styles.searchKbd}>↵</kbd>
        </form>
      </div>

      <div className={styles.rightSection}>
        {/* Platform Status Badge */}
        <div className={styles.statusBadge}>
          <span className={styles.statusDot} />
          <span>AhirMilap Desk Online</span>
        </div>

        {/* Notifications Dropdown */}
        <div className={styles.dropdownWrap} ref={notifRef}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setNotifDropdownOpen((prev) => !prev)}
            aria-label="Notifications"
            title="Recent Activity"
          >
            <Bell size={20} />
            {stats.pendingVerification > 0 && (
              <span className={styles.notifBadge}>{stats.pendingVerification}</span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownHeader}>
                <h6>Recent Registrations</h6>
                <span className={styles.headerSub}>Latest matrimonial submissions</span>
              </div>
              <div className={styles.notifList}>
                {recentUsers.map((u) => (
                  <Link
                    key={u.id}
                    to={`/users/${u.id}`}
                    className={styles.notifItem}
                    onClick={() => setNotifDropdownOpen(false)}
                  >
                    <img src={u.profilePhoto} alt={u.fullName} className={styles.notifAvatar} />
                    <div className={styles.notifContent}>
                      <span className={styles.notifName}>{u.fullName}</span>
                      <span className={styles.notifMeta}>
                        {u.gender} • {u.currentCity} • {u.id}
                      </span>
                    </div>
                    {u.verificationStatus === 'Pending' ? (
                      <Clock size={14} className={styles.textWarning} />
                    ) : (
                      <CheckCircle2 size={14} className={styles.textSuccess} />
                    )}
                  </Link>
                ))}
              </div>
              <div className={styles.dropdownFooter}>
                <Link
                  to="/users/pending"
                  className={styles.viewAllBtn}
                  onClick={() => setNotifDropdownOpen(false)}
                >
                  Review Pending Profiles ({stats.pendingVerification})
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className={styles.dropdownWrap} ref={profileRef}>
          <button
            type="button"
            className={styles.profileTrigger}
            onClick={() => setProfileDropdownOpen((prev) => !prev)}
            aria-label="Admin Profile menu"
          >
            <img
              src={admin?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120'}
              alt={admin?.name}
              className={styles.profileImg}
            />
            <div className={styles.profileMeta}>
              <span className={styles.adminName}>{admin?.name || 'Administrator'}</span>
              <span className={styles.adminRole}>{admin?.role || 'Super Admin'}</span>
            </div>
          </button>

          {profileDropdownOpen && (
            <div className={`${styles.dropdownMenu} ${styles.profileMenu}`}>
              <div className={styles.profileCard}>
                <p className={styles.profileName}>{admin?.name}</p>
                <p className={styles.profileEmail}>{admin?.email}</p>
                <div className={styles.roleTag}>
                  <ShieldCheck size={13} />
                  <span>{admin?.role}</span>
                </div>
              </div>

              <div className={styles.menuLinks}>
                <Link
                  to="/profile"
                  className={styles.menuLink}
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <User size={16} />
                  <span>Admin Profile & Security</span>
                </Link>
                <Link
                  to="/settings"
                  className={styles.menuLink}
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <Settings size={16} />
                  <span>Platform Settings</span>
                </Link>
              </div>

              <div className={styles.menuDivider} />

              <button
                type="button"
                className={styles.menuLogout}
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
