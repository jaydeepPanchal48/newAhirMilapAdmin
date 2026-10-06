import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  UserPlus,
  Download,
  Eye,
  Edit,
  Trash2,
  LoaderCircle,
  Clock,
  CheckCircle2,
  UserCheck,
  UserX,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { userService } from '@/services/userService';
import { useToast } from '@/context/ToastContext';
import Badge from '@/components/common/Badge/Badge';
import Pagination from '@/components/common/Pagination/Pagination';
import Modal from '@/components/common/Modal/Modal';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import styles from './UsersListPage.module.scss';

export default function UsersListPage({ presetFilter = 'all' }) {
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [users, setUsers] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshVersion, setRefreshVersion] = useState(0);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [genderFilter, setGenderFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState(
    presetFilter === 'pending'
      ? 'Pending'
      : presetFilter === 'verified'
      ? 'Verified'
      : 'all'
  );
  const [statusFilter, setStatusFilter] = useState(
    presetFilter === 'active'
      ? 'Active'
      : presetFilter === 'inactive'
      ? 'Inactive'
      : 'all'
  );
  const [cityFilter, setCityFilter] = useState('all');
  const [maritalFilter, setMaritalFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, name_asc, age_asc, age_desc

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter drawer toggle for mobile/tablet
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  // Delete Confirmation Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Status Change Confirmation Modal State
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [userToChangeStatus, setUserToChangeStatus] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const result = await userService.getRegistrationList({
          pageNumber: currentPage,
          pageSize,
          search: searchQuery.trim(),
          sortBy,
          signal: controller.signal,
        });
        setUsers(result.users);
        setTotalRecords(result.totalRecords);
        if (result.pageSize !== pageSize) setPageSize(result.pageSize);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setUsers([]);
          setTotalRecords(0);
          toast.error(error.message || 'Unable to load registered profiles.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchUsers();
    return () => controller.abort();
  }, [currentPage, pageSize, searchQuery, sortBy, refreshVersion]);

  // Update preset filter if route changes
  useEffect(() => {
    if (presetFilter === 'pending') setVerificationFilter('Pending');
    else if (presetFilter === 'verified') setVerificationFilter('Verified');
    else if (presetFilter === 'active') setStatusFilter('Active');
    else if (presetFilter === 'inactive') setStatusFilter('Inactive');
    else {
      setVerificationFilter('all');
      setStatusFilter('all');
    }
    setCurrentPage(1);
  }, [presetFilter]);

  // Sync search param from URL
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  const loadUsers = () => {
    setRefreshVersion((version) => version + 1);
  };

  // Distinct cities from data
  const availableCities = useMemo(() => {
    const cities = new Set(users.map((u) => u.currentCity).filter(Boolean));
    return Array.from(cities).sort();
  }, [users]);

  // Filter and Sort Users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Gender
      if (genderFilter !== 'all' && user.gender !== genderFilter) {
        return false;
      }

      // Verification Status
      if (verificationFilter !== 'all' && user.verificationStatus !== verificationFilter) {
        return false;
      }

      // Account Status
      if (statusFilter !== 'all' && user.accountStatus !== statusFilter) {
        return false;
      }

      // Current City
      if (cityFilter !== 'all' && user.currentCity !== cityFilter) {
        return false;
      }

      // Marital Status
      if (maritalFilter !== 'all' && user.maritalStatus !== maritalFilter) {
        return false;
      }

      return true;
    });
  }, [users, genderFilter, verificationFilter, statusFilter, cityFilter, maritalFilter]);

  const paginatedUsers = filteredUsers;

  // Reset all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setGenderFilter('all');
    setVerificationFilter('all');
    setStatusFilter('all');
    setCityFilter('all');
    setMaritalFilter('all');
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({});
    toast.info('All filters have been reset.');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    genderFilter !== 'all' ||
    verificationFilter !== 'all' ||
    statusFilter !== 'all' ||
    cityFilter !== 'all' ||
    maritalFilter !== 'all';

  // Delete execution
  const confirmDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await userService.deleteRegistration(userToDelete.id);
      toast.success(`Profile ${userToDelete.id} (${userToDelete.fullName}) has been deleted.`);
      setDeleteModalOpen(false);
      setUserToDelete(null);
      loadUsers();
    } catch (error) {
      toast.error(error.message || 'Unable to delete this profile.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.usersPage}>
      {/* Top Header */}
      <div className={styles.pageHeader}>
        <div>
          <span className={styles.breadcrumb}>USER MANAGEMENT</span>
          <h1 className={styles.title}>Registered Matrimonial Profiles</h1>
          <p className={styles.subtitle}>
            Review and manage all Ahir community member registrations, verify credentials,
            and monitor platform status.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => userService.exportToCSV(filteredUsers)}
            title="Export filtered records as CSV"
          >
            <Download size={16} />
            <span>Export ({filteredUsers.length})</span>
          </button>
          <Link to="/users/new" className="btn btn-primary btn-sm">
            <UserPlus size={16} />
            <span>Register Profile</span>
          </Link>
        </div>
      </div>

      {/* Quick Navigation Tabs */}
      <div className={styles.statusTabs}>
        <button
          type="button"
          className={`${styles.tabBtn} ${
            verificationFilter === 'all' && statusFilter === 'all' ? styles.active : ''
          }`}
          onClick={() => {
            setVerificationFilter('all');
            setStatusFilter('all');
            setCurrentPage(1);
          }}
        >
          <span>All Profiles</span>
          <span className={styles.tabCount}>{totalRecords}</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${verificationFilter === 'Pending' ? styles.active : ''}`}
          onClick={() => {
            setVerificationFilter('Pending');
            setStatusFilter('all');
            setCurrentPage(1);
          }}
        >
          <Clock size={14} className={styles.textWarning} />
          <span>Pending Verification</span>
          <span className={styles.tabCount}>
            {users.filter((u) => u.verificationStatus === 'Pending').length}
          </span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${verificationFilter === 'Verified' ? styles.active : ''}`}
          onClick={() => {
            setVerificationFilter('Verified');
            setStatusFilter('all');
            setCurrentPage(1);
          }}
        >
          <CheckCircle2 size={14} className={styles.textSuccess} />
          <span>Verified Profiles</span>
          <span className={styles.tabCount}>
            {users.filter((u) => u.verificationStatus === 'Verified').length}
          </span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${statusFilter === 'Active' ? styles.active : ''}`}
          onClick={() => {
            setStatusFilter('Active');
            setVerificationFilter('all');
            setCurrentPage(1);
          }}
        >
          <UserCheck size={14} />
          <span>Active</span>
          <span className={styles.tabCount}>
            {users.filter((u) => u.accountStatus === 'Active').length}
          </span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${statusFilter === 'Inactive' ? styles.active : ''}`}
          onClick={() => {
            setStatusFilter('Inactive');
            setVerificationFilter('all');
            setCurrentPage(1);
          }}
        >
          <UserX size={14} />
          <span>Inactive</span>
          <span className={styles.tabCount}>
            {users.filter((u) => u.accountStatus === 'Inactive').length}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar Section */}
      <div className={styles.filterSection}>
        <div className={styles.filterTopRow}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by Name, Mobile (+91), ID (AM-2026-...), City..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery('')}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className={styles.rightFilterControls}>
            <div className={styles.selectFilter}>
              <select
                value={genderFilter}
                onChange={(e) => {
                  setGenderFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Genders</option>
                <option value="Male">Male (Grooms)</option>
                <option value="Female">Female (Brides)</option>
              </select>
            </div>

            <div className={styles.selectFilter}>
              <select
                value={cityFilter}
                onChange={(e) => {
                  setCityFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Cities</option>
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.selectFilter}>
              <select
                value={maritalFilter}
                onChange={(e) => {
                  setMaritalFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Marital Statuses</option>
                <option value="Never Married">Never Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
                <option value="Awaiting Divorce">Awaiting Divorce</option>
              </select>
            </div>

            <div className={styles.selectFilter}>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="name_asc">Sort: Name (A-Z)</option>
                <option value="age_asc">Sort: Age (Youngest)</option>
                <option value="age_desc">Sort: Age (Oldest)</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleClearFilters}
                title="Reset all filters"
              >
                <RotateCcw size={14} />
                <span>Clear Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table and Mobile Cards */}
      <div className={styles.tableCard} aria-busy={loading}>
        {loading && (
          <div className={styles.listLoading} role="status">
            <LoaderCircle size={20} className={styles.loadingIcon} />
            <span>{users.length ? 'Updating registrations...' : 'Loading registrations...'}</span>
          </div>
        )}
        {paginatedUsers.length === 0 && !loading ? (
          <EmptyState
            title="No Matrimonial Profiles Found"
            description="No user profiles match your active filters or search keyword. Try clearing some filters or searching with different terms."
            actionLabel="Reset Filters"
            onAction={handleClearFilters}
          />
        ) : paginatedUsers.length > 0 ? (
          <>
            {/* Desktop & Tablet Data Table */}
            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Profile Photo & Name</th>
                    <th>Age / Gender</th>
                    <th>Current City & Native</th>
                    <th>Education & Profession</th>
                    <th>Registered</th>
                    <th>Verification</th>
                    <th>Status</th>
                    <th className={styles.textRight}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id}>
                      {/* Photo & Name */}
                      <td>
                        <div className={styles.userCell}>
                          <img
                            src={user.profilePhoto}
                            alt={user.fullName}
                            className={styles.avatarImg}
                          />
                          <div className={styles.userInfoCol}>
                            <Link to={`/users/${user.id}`} className={styles.userNameLink}>
                              {user.fullName}
                            </Link>
                            <div className={styles.idContactMeta}>
                              <span className={styles.idTag}>{user.id}</span>
                              <span className={styles.dot}>•</span>
                              <span className={styles.phoneTag}>{user.mobileNumber}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Age & Gender */}
                      <td>
                        <div className={styles.ageGenderCol}>
                          <span className={styles.ageText}>{user.age} yrs</span>
                          <span
                            className={
                              user.gender === 'Male' ? styles.badgeMale : styles.badgeFemale
                            }
                          >
                            {user.gender}
                          </span>
                        </div>
                      </td>

                      {/* Location */}
                      <td>
                        <div className={styles.locationCol}>
                          <strong>{user.currentCity}</strong>
                          {user.nativePlace && (
                            <span className={styles.nativeTag}>
                              Native: {user.nativePlace}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Education & Occupation */}
                      <td>
                        <div className={styles.careerCol}>
                          <span className={styles.occupationText} title={user.occupation}>
                            {user.occupation}
                          </span>
                          <span className={styles.educationText} title={user.education}>
                            {user.education}
                          </span>
                          {user.incomeRange && (
                            <span className={styles.incomePill}>{user.incomeRange}</span>
                          )}
                        </div>
                      </td>

                      {/* Registration Date */}
                      <td>
                        <span className={styles.dateText}>
                          {new Date(user.registrationDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </td>

                      {/* Verification Status */}
                      <td>
                        <Badge type={user.verificationStatus} />
                      </td>

                      {/* Account Status */}
                      <td>
                        <Badge type={user.accountStatus} icon={false} />
                      </td>

                      {/* Actions */}
                      <td>
                        <div className={styles.actionButtonGroup}>
                          <Link
                            to={`/users/${user.id}`}
                            className={styles.actionIconBtn}
                            title="View Full Profile Details"
                          >
                            <Eye size={16} />
                          </Link>

                          <Link
                            to={`/users/${user.id}/edit`}
                            className={styles.actionIconBtn}
                            title="Edit Profile"
                          >
                            <Edit size={16} />
                          </Link>

                          <button
                            type="button"
                            className={`${styles.actionIconBtn} ${styles.deleteBtn}`}
                            onClick={() => {
                              setUserToDelete(user);
                              setDeleteModalOpen(true);
                            }}
                            title="Delete Profile"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View: Cards */}
            <div className={styles.mobileCardList}>
              {paginatedUsers.map((user) => (
                <div key={user.id} className={styles.mobileCard}>
                  <div className={styles.mobileCardTop}>
                    <img
                      src={user.profilePhoto}
                      alt={user.fullName}
                      className={styles.mobileAvatar}
                    />
                    <div className={styles.mobileTopInfo}>
                      <Link to={`/users/${user.id}`} className={styles.mobileName}>
                        {user.fullName}
                      </Link>
                      <span className={styles.mobileId}>{user.id}</span>
                      <div className={styles.badgeRow}>
                        <Badge type={user.verificationStatus} />
                        <Badge type={user.accountStatus} icon={false} />
                      </div>
                    </div>
                  </div>

                  <div className={styles.mobileCardDetails}>
                    <div className={styles.mobileDetailItem}>
                      <span className={styles.mobileLabel}>Age & Gender:</span>
                      <span>
                        {user.age} yrs • {user.gender}
                      </span>
                    </div>
                    <div className={styles.mobileDetailItem}>
                      <span className={styles.mobileLabel}>Location:</span>
                      <span>
                        {user.currentCity}
                        {user.nativePlace ? ` (Native: ${user.nativePlace})` : ''}
                      </span>
                    </div>
                    <div className={styles.mobileDetailItem}>
                      <span className={styles.mobileLabel}>Profession:</span>
                      <span>{user.occupation}</span>
                    </div>
                    <div className={styles.mobileDetailItem}>
                      <span className={styles.mobileLabel}>Education:</span>
                      <span>{user.education}</span>
                    </div>
                    <div className={styles.mobileDetailItem}>
                      <span className={styles.mobileLabel}>Contact:</span>
                      <span>{user.mobileNumber}</span>
                    </div>
                  </div>

                  <div className={styles.mobileCardActions}>
                    <Link
                      to={`/users/${user.id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      <Eye size={14} />
                      <span>Details</span>
                    </Link>
                    <Link
                      to={`/users/${user.id}/edit`}
                      className="btn btn-secondary btn-sm"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setUserToDelete(user);
                        setDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalItems={totalRecords}
              pageSize={pageSize}
              onPageChange={(p) => setCurrentPage(p)}
              onPageSizeChange={(sz) => {
                setPageSize(sz);
                setCurrentPage(1);
              }}
            />
          </>
        ) : null}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Profile Deletion"
        subtitle="This action cannot be undone."
      >
        <div className={styles.deleteConfirmModal}>
          <div className={styles.warningBox}>
            <AlertTriangle size={24} className={styles.warningIcon} />
            <div>
              <p className={styles.warningText}>
                Are you sure you want to permanently delete{' '}
                <strong>{userToDelete?.fullName}</strong> ({userToDelete?.id})?
              </p>
              <p className={styles.warningSub}>
                All associated contact details, family records, partner preferences, and
                verification audits will be removed from the matrimonial database.
              </p>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={confirmDelete}
              disabled={deleting}
            >
              <Trash2 size={16} />
              <span>{deleting ? 'Deleting...' : 'Delete Profile Permanently'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
