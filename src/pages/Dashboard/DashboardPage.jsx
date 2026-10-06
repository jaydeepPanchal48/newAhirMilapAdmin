import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Clock,
  CheckCircle2,
  TrendingUp,
  UserPlus,
  Download,
  Eye,
  ShieldCheck,
  ArrowRight,
  Filter,
  Check,
  Calendar,
} from 'lucide-react';
import { userService } from '@/services/userService';
import { useToast } from '@/context/ToastContext';
import Badge from '@/components/common/Badge/Badge';
import styles from './DashboardPage.module.scss';

const Mars = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="10" cy="14" r="5" />
    <path d="M19 5l-5.4 5.4" />
    <path d="M19 5h-5" />
    <path d="M19 5v5" />
  </svg>
);

const Venus = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="9" r="5" />
    <path d="M12 14v7" />
    <path d="M9 18h6" />
  </svg>
);

export default function DashboardPage() {
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [timeRange, setTimeRange] = useState('weekly'); // daily | weekly | monthly

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const s = userService.getStats();
    setStats(s);
    const all = userService.getAllUsers();
    setRecentUsers(all.slice(0, 6));
  };

  const handleExport = () => {
    userService.exportToCSV();
    toast.success('Matrimony users list exported to CSV successfully.');
  };

  const handleQuickVerify = (user) => {
    const newStatus = user.verificationStatus === 'Verified' ? 'Pending' : 'Verified';
    userService.updateVerification(user.id, newStatus);
    toast.success(`${user.fullName} is now ${newStatus}!`);
    loadDashboardData();
  };

  if (!stats) return null;

  // Chart dataset based on selected timeRange
  const trendData = {
    daily: [
      { label: 'Mon', value: 4, count: '4 profiles' },
      { label: 'Tue', value: 7, count: '7 profiles' },
      { label: 'Wed', value: 3, count: '3 profiles' },
      { label: 'Thu', value: 8, count: '8 profiles' },
      { label: 'Fri', value: 6, count: '6 profiles' },
      { label: 'Sat', value: 12, count: '12 profiles' },
      { label: 'Sun', value: 10, count: '10 profiles' },
    ],
    weekly: [
      { label: 'Week 1', value: 18, count: '18 profiles' },
      { label: 'Week 2', value: 24, count: '24 profiles' },
      { label: 'Week 3', value: 31, count: '31 profiles' },
      { label: 'Week 4', value: 28, count: '28 profiles' },
    ],
    monthly: [
      { label: 'May', value: 65, count: '65 profiles' },
      { label: 'Jun', value: 82, count: '82 profiles' },
      { label: 'Jul', value: 95, count: '95 profiles' },
      { label: 'Aug', value: 110, count: '110 profiles' },
      { label: 'Sep', value: 125, count: '125 profiles' },
      { label: 'Oct', value: 142, count: '142 profiles' },
    ],
  }[timeRange];

  const maxVal = Math.max(...trendData.map((d) => d.value));

  const malePercent = Math.round((stats.maleUsers / (stats.totalUsers || 1)) * 100);
  const femalePercent = 100 - malePercent;

  return (
    <div className={styles.dashboardPage}>
      {/* Top Welcome & Quick Actions */}
      <div className={styles.pageHeader}>
        <div>
          <span className={styles.breadcrumb}>PORTAL OVERVIEW</span>
          <h1 className={styles.title}>Matrimony Administration Dashboard</h1>
          <p className={styles.subtitle}>
            Monitor Ahir community matrimonial registrations, manage profile
            verification, and review incoming requests.
          </p>
        </div>

        <div className={styles.quickActions}>
          <Link to="/users/new" className="btn btn-primary btn-sm">
            <UserPlus size={16} />
            <span>Add User</span>
          </Link>
          <Link to="/users/pending" className="btn btn-secondary btn-sm">
            <Clock size={16} />
            <span>Pending ({stats.pendingVerification})</span>
          </Link>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleExport}
          >
            <Download size={16} />
            <span>Export Users</span>
          </button>
        </div>
      </div>

      {/* 7 Core Matrimony Metric Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>Total Registered</span>
            <div className={`${styles.iconWrap} ${styles.iconBurgundy}`}>
              <Users size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{stats.totalUsers}</div>
          <div className={styles.kpiFootnote}>
            <span className={styles.textSuccess}>+14%</span>
            <span>vs previous month</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>New This Week</span>
            <div className={`${styles.iconWrap} ${styles.iconGold}`}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{stats.newRegistrations}</div>
          <div className={styles.kpiFootnote}>
            <span className={styles.badgeSm}>Recent 7 Days</span>
          </div>
        </div>

        <div className={`${styles.kpiCard} ${stats.pendingVerification > 0 ? styles.kpiHighlight : ''}`}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>Pending Verification</span>
            <div className={`${styles.iconWrap} ${styles.iconWarning}`}>
              <Clock size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{stats.pendingVerification}</div>
          <div className={styles.kpiFootnote}>
            <Link to="/users/pending" className={styles.kpiActionLink}>
              Review queue <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>Verified Profiles</span>
            <div className={`${styles.iconWrap} ${styles.iconSuccess}`}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{stats.verifiedUsers}</div>
          <div className={styles.kpiFootnote}>
            <span>Aadhaar / Family verified</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>Active Profiles</span>
            <div className={`${styles.iconWrap} ${styles.iconInfo}`}>
              <UserCheck size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{stats.activeUsers}</div>
          <div className={styles.kpiFootnote}>
            <span>Available for matchmaking</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>Grooms (Male)</span>
            <div className={`${styles.iconWrap} ${styles.iconMale}`}>
              <Mars size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{stats.maleUsers}</div>
          <div className={styles.kpiFootnote}>
            <span>{malePercent}% of total profiles</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>Brides (Female)</span>
            <div className={`${styles.iconWrap} ${styles.iconFemale}`}>
              <Venus size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{stats.femaleUsers}</div>
          <div className={styles.kpiFootnote}>
            <span>{femalePercent}% of total profiles</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div className={styles.chartsGrid}>
        {/* Registration Trends Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Registration Trends</h3>
              <p className={styles.chartSubtitle}>
                New matrimonial submissions over time
              </p>
            </div>

            <div className={styles.rangeSelector}>
              <button
                type="button"
                className={`${styles.rangeBtn} ${timeRange === 'daily' ? styles.active : ''}`}
                onClick={() => setTimeRange('daily')}
              >
                Daily
              </button>
              <button
                type="button"
                className={`${styles.rangeBtn} ${timeRange === 'weekly' ? styles.active : ''}`}
                onClick={() => setTimeRange('weekly')}
              >
                Weekly
              </button>
              <button
                type="button"
                className={`${styles.rangeBtn} ${timeRange === 'monthly' ? styles.active : ''}`}
                onClick={() => setTimeRange('monthly')}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className={styles.barChartContainer}>
            <div className={styles.barsWrap}>
              {trendData.map((item, idx) => {
                const heightPercent = Math.max(15, Math.round((item.value / maxVal) * 100));
                return (
                  <div key={idx} className={styles.barColumn}>
                    <div className={styles.barTrack}>
                      <div
                        className={styles.barFill}
                        style={{ height: `${heightPercent}%` }}
                      >
                        <span className={styles.barTooltip}>{item.count}</span>
                      </div>
                    </div>
                    <span className={styles.barLabel}>{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Gender Distribution Card */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Gender Distribution</h3>
              <p className={styles.chartSubtitle}>
                Male vs Female profile ratio
              </p>
            </div>
          </div>

          <div className={styles.genderContainer}>
            <div className={styles.genderVisualBar}>
              <div
                className={styles.maleSegment}
                style={{ width: `${malePercent}%` }}
                title={`Male: ${stats.maleUsers} (${malePercent}%)`}
              />
              <div
                className={styles.femaleSegment}
                style={{ width: `${femalePercent}%` }}
                title={`Female: ${stats.femaleUsers} (${femalePercent}%)`}
              />
            </div>

            <div className={styles.genderLegends}>
              <div className={styles.legendItem}>
                <div className={styles.legendBox}>
                  <Mars size={18} className={styles.maleIcon} />
                  <div>
                    <span className={styles.legendTitle}>Male (Grooms)</span>
                    <strong className={styles.legendVal}>
                      {stats.maleUsers} <small>({malePercent}%)</small>
                    </strong>
                  </div>
                </div>
              </div>

              <div className={styles.legendItem}>
                <div className={styles.legendBox}>
                  <Venus size={18} className={styles.femaleIcon} />
                  <div>
                    <span className={styles.legendTitle}>Female (Brides)</span>
                    <strong className={styles.legendVal}>
                      {stats.femaleUsers} <small>({femalePercent}%)</small>
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.matchmakingTip}>
              <ShieldCheck size={16} className={styles.tipIcon} />
              <span>
                Healthy gender balance across registered Saurashtra Ahir community profiles.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Registrations Table Section */}
      <div className={styles.tableSection}>
        <div className={styles.tableSectionHeader}>
          <div>
            <h3 className={styles.sectionHeading}>Recent Registrations</h3>
            <p className={styles.sectionSubtitle}>
              Latest matrimonial profiles registered via AhirMilap registration form
            </p>
          </div>

          <Link to="/users" className="btn btn-secondary btn-sm">
            <span>View All {stats.totalUsers} Profiles</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Profile</th>
                <th>Age / Gender</th>
                <th>Location</th>
                <th>Education & Career</th>
                <th>Registered</th>
                <th>Verification</th>
                <th>Status</th>
                <th className={styles.thRight}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className={styles.userCell}>
                      <img
                        src={user.profilePhoto}
                        alt={user.fullName}
                        className={styles.userAvatar}
                      />
                      <div>
                        <Link to={`/users/${user.id}`} className={styles.userName}>
                          {user.fullName}
                        </Link>
                        <span className={styles.userId}>{user.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.genderCell}>
                      <span>{user.age} yrs</span>
                      <span className={styles.bullet}>•</span>
                      <span className={user.gender === 'Male' ? styles.tagMale : styles.tagFemale}>
                        {user.gender}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.locationCell}>
                      <strong>{user.currentCity}</strong>
                      {user.nativePlace && <small>Native: {user.nativePlace}</small>}
                    </div>
                  </td>
                  <td>
                    <div className={styles.careerCell}>
                      <span className={styles.occupation}>{user.occupation}</span>
                      <small className={styles.education}>{user.education}</small>
                    </div>
                  </td>
                  <td>
                    <span className={styles.dateCell}>
                      {new Date(user.registrationDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </td>
                  <td>
                    <Badge type={user.verificationStatus} />
                  </td>
                  <td>
                    <Badge type={user.accountStatus} icon={false} />
                  </td>
                  <td>
                    <div className={styles.actionsGroup}>
                      <Link
                        to={`/users/${user.id}`}
                        className="btn btn-secondary btn-sm"
                        title="View Full Profile Details"
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </Link>
                      <button
                        type="button"
                        className={`btn btn-sm ${
                          user.verificationStatus === 'Verified' ? 'btn-ghost' : 'btn-gold'
                        }`}
                        onClick={() => handleQuickVerify(user)}
                        title={
                          user.verificationStatus === 'Verified'
                            ? 'Mark as Pending'
                            : 'Quick Verify Profile'
                        }
                      >
                        <Check size={14} />
                        <span>
                          {user.verificationStatus === 'Verified' ? 'Unverify' : 'Verify'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
