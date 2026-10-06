import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
  UserPlus,
  Settings,
  UserCog,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/userService';
import styles from './Sidebar.module.scss';

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }) {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [usersSubmenuOpen, setUsersSubmenuOpen] = useState(true);
  const [stats, setStats] = useState({ pendingVerification: 0, totalUsers: 0 });

  // Update badge counts periodically or on route change
  useEffect(() => {
    const s = userService.getStats();
    setStats(s);
  }, [location.pathname]);

  // Keep users submenu open if we're on a users route
  useEffect(() => {
    if (location.pathname.startsWith('/users')) {
      setUsersSubmenuOpen(true);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isUsersActive = location.pathname.startsWith('/users');

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className={styles.mobileBackdrop}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${
          isOpen ? styles.mobileOpen : ''
        }`}
      >
        {/* Header / Logo */}
        <div className={styles.sidebarHeader}>
          <div className={styles.logoWrap}>
            <img src="/logo.png" alt="AhirMilap Admin" className={styles.logoImg} />
            <div className={styles.brandBadge}>
              <span className={styles.portalTag}>ADMIN</span>
            </div>
          </div>

          {/* Desktop collapse toggle */}
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className={styles.navMenu}>
          <div className={styles.navSection}>
            <span className={styles.sectionLabel}>MAIN</span>

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
              onClick={onClose}
            >
              <LayoutDashboard size={20} className={styles.navIcon} />
              <span className={styles.navLabel}>Dashboard</span>
            </NavLink>

            {/* Users with nested submenu */}
            <div className={`${styles.navItemParent} ${isUsersActive ? styles.parentActive : ''}`}>
              <button
                type="button"
                className={`${styles.parentButton} ${isUsersActive ? styles.active : ''}`}
                onClick={() => setUsersSubmenuOpen((prev) => !prev)}
                aria-expanded={usersSubmenuOpen}
              >
                <div className={styles.itemLeft}>
                  <Users size={20} className={styles.navIcon} />
                  <span className={styles.navLabel}>Profiles & Users</span>
                </div>
                <div className={styles.itemRight}>
                  {stats.pendingVerification > 0 && (
                    <span className={styles.badgePill}>{stats.pendingVerification}</span>
                  )}
                  <ChevronDown
                    size={16}
                    className={`${styles.chevron} ${usersSubmenuOpen ? styles.rotate : ''}`}
                  />
                </div>
              </button>

              {usersSubmenuOpen && !isCollapsed && (
                <div className={styles.submenu}>
                  <NavLink
                    to="/users"
                    end
                    className={({ isActive }) =>
                      `${styles.subItem} ${isActive ? styles.active : ''}`
                    }
                    onClick={onClose}
                  >
                    <span className={styles.subDot} />
                    <span>All Users</span>
                    <span className={styles.countTag}>{stats.totalUsers}</span>
                  </NavLink>

                  <NavLink
                    to="/users/pending"
                    className={({ isActive }) =>
                      `${styles.subItem} ${isActive ? styles.active : ''}`
                    }
                    onClick={onClose}
                  >
                    <Clock size={14} className={styles.pendingColor} />
                    <span>Pending Verification</span>
                    {stats.pendingVerification > 0 && (
                      <span className={styles.pendingTag}>{stats.pendingVerification}</span>
                    )}
                  </NavLink>

                  <NavLink
                    to="/users/verified"
                    className={({ isActive }) =>
                      `${styles.subItem} ${isActive ? styles.active : ''}`
                    }
                    onClick={onClose}
                  >
                    <CheckCircle2 size={14} className={styles.verifiedColor} />
                    <span>Verified Profiles</span>
                  </NavLink>

                  <NavLink
                    to="/users/active"
                    className={({ isActive }) =>
                      `${styles.subItem} ${isActive ? styles.active : ''}`
                    }
                    onClick={onClose}
                  >
                    <UserCheck size={14} />
                    <span>Active Users</span>
                  </NavLink>

                  <NavLink
                    to="/users/inactive"
                    className={({ isActive }) =>
                      `${styles.subItem} ${isActive ? styles.active : ''}`
                    }
                    onClick={onClose}
                  >
                    <UserX size={14} />
                    <span>Inactive Users</span>
                  </NavLink>
                </div>
              )}
            </div>

            <NavLink
              to="/users/new"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
              onClick={onClose}
            >
              <UserPlus size={20} className={styles.navIcon} />
              <span className={styles.navLabel}>Register New User</span>
            </NavLink>
          </div>

          <div className={styles.navSection}>
            <span className={styles.sectionLabel}>SYSTEM</span>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
              onClick={onClose}
            >
              <Settings size={20} className={styles.navIcon} />
              <span className={styles.navLabel}>Settings</span>
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
              onClick={onClose}
            >
              <UserCog size={20} className={styles.navIcon} />
              <span className={styles.navLabel}>Admin Profile</span>
            </NavLink>
          </div>
        </nav>

        {/* Live Website Link Teaser */}
        {!isCollapsed && (
          <div className={styles.websiteLinkBox}>
            <div className={styles.siteHeader}>
              <ShieldCheck size={16} className={styles.shieldIcon} />
              <span>Matrimony Site</span>
            </div>
            <p>Confidential Ahir matchmaking</p>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.openWebBtn}
            >
              <span>View Public Portal</span>
              <ExternalLink size={13} />
            </a>
          </div>
        )}

        {/* Footer / Admin User Card */}
        <div className={styles.sidebarFooter}>
          <div className={styles.userCard}>
            <img
              src={admin?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120'}
              alt={admin?.name || 'Admin'}
              className={styles.userAvatar}
            />
            {!isCollapsed && (
              <div className={styles.userInfo}>
                <span className={styles.userName}>{admin?.name || 'Administrator'}</span>
                <span className={styles.userRole}>{admin?.role || 'Super Admin'}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            className={styles.logoutBtn}
            onClick={handleLogout}
            title="Sign out of Admin Panel"
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}
