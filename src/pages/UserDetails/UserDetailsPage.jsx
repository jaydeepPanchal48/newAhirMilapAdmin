import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Heart,
  Users as FamilyIcon,
  Shield,
  ShieldCheck,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { userService } from '@/services/userService';
import { useToast } from '@/context/ToastContext';
import Badge from '@/components/common/Badge/Badge';
import Modal from '@/components/common/Modal/Modal';
import styles from './UserDetailsPage.module.scss';

export default function UserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, personal, family, career, preferences, audit
  const [deleting, setDeleting] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const loadUser = async () => {
      setLoading(true);
      try {
        const registration = await userService.getRegistrationById(id, { signal: controller.signal });
        setUser(registration);
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error(error.message || `Profile ${id} not found.`);
          navigate('/users', { replace: true });
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    loadUser();
    return () => controller.abort();
  }, [id]);

  const handleDelete = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      await userService.deleteRegistration(user.id);
      toast.success(`Profile ${user.id} has been permanently deleted.`);
      navigate('/users', { replace: true });
    } catch (error) {
      toast.error(error.message || 'Unable to delete this profile.');
      setDeleting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner} />
        <p>Loading profile details...</p>
      </div>
    );
  }

  return (
    <div className={styles.detailsPage}>
      {/* Top Back Navigation */}
      <div className={styles.topNavRow}>
        <Link to="/users" className={styles.backBtn}>
          <ArrowLeft size={16} />
          <span>Back to All Profiles</span>
        </Link>
        <div className={styles.idIndicator}>
          <span>Profile Record: </span>
          <strong>{user.id}</strong>
        </div>
      </div>

      {/* 7. USER PROFILE HEADER */}
      <div className={styles.profileHeaderCard}>
        <div className={styles.headerMain}>
          <div className={styles.avatarWrapper}>
            <img
              src={user.profilePhoto}
              alt={user.fullName}
              className={styles.avatarImage}
            />
          </div>

          <div className={styles.headerInfo}>
            <div className={styles.titleRow}>
              <h1 className={styles.personName}>{user.fullName}</h1>
              <div className={styles.badgesGroup}>
                <Badge type={user.verificationStatus} />
                <Badge type={user.accountStatus} icon={false} />
              </div>
            </div>

            <div className={styles.keyAttributes}>
              <span className={styles.attrItem}>
                <strong>{user.id}</strong>
              </span>
              <span className={styles.dot}>•</span>
              <span className={styles.attrItem}>
                {user.age} Years ({user.gender})
              </span>
              <span className={styles.dot}>•</span>
              <span className={styles.attrItem}>
                <MapPin size={14} className={styles.iconGold} />
                {user.currentCity}
                {user.nativePlace ? ` (Native: ${user.nativePlace})` : ''}
              </span>
              <span className={styles.dot}>•</span>
              <span className={styles.attrItem}>
                <Calendar size={14} />
                Registered:{' '}
                {new Date(user.registrationDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>

            <p className={styles.professionSummary}>
              <Briefcase size={14} />
              <span>
                {user.occupation} at {user.company || 'Enterprise'} • {user.education}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className={styles.headerActions}>
          <Link to={`/users/${user.id}/edit`} className="btn btn-primary btn-sm">
            <Edit size={15} />
            <span>Edit Profile</span>
          </Link>

          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => setDeleteModalOpen(true)}
          >
            <Trash2 size={15} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className={styles.detailTabs}>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'personal' ? styles.active : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Personal & Contact
        </button>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'family' ? styles.active : ''}`}
          onClick={() => setActiveTab('family')}
        >
          Family Background
        </button>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'career' ? styles.active : ''}`}
          onClick={() => setActiveTab('career')}
        >
          Education & Career
        </button>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'preferences' ? styles.active : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          Partner Preferences
        </button>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === 'audit' ? styles.active : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          Verification & Notes
        </button>
      </div>

      {/* Main Tabbed Content Sections */}
      <div className={styles.tabContentArea}>
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className={styles.overviewGrid}>
            {/* Quick Summary Card */}
            <div className={styles.detailCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <ShieldCheck size={18} className={styles.iconBurgundy} />
                  <span>Matrimonial Profile Summary</span>
                </h3>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.infoRowGrid}>
                  <div className={styles.infoField}>
                    <span className={styles.fieldLabel}>Full Legal Name</span>
                    <span className={styles.fieldValue}>{user.fullName}</span>
                  </div>
                  <div className={styles.infoField}>
                    <span className={styles.fieldLabel}>Community</span>
                    <span className={styles.fieldValue}>Ahir (Yaduvanshi)</span>
                  </div>
                  <div className={styles.infoField}>
                    <span className={styles.fieldLabel}>Gender & Age</span>
                    <span className={styles.fieldValue}>
                      {user.gender} • {user.age} Years
                    </span>
                  </div>
                  <div className={styles.infoField}>
                    <span className={styles.fieldLabel}>Height</span>
                    <span className={styles.fieldValue}>{user.height || 'Not Specified'}</span>
                  </div>
                  <div className={styles.infoField}>
                    <span className={styles.fieldLabel}>Marital Status</span>
                    <span className={styles.fieldValue}>{user.maritalStatus}</span>
                  </div>
                  <div className={styles.infoField}>
                    <span className={styles.fieldLabel}>Location</span>
                    <span className={styles.fieldValue}>
                      {user.currentCity} (Native: {user.nativePlace || 'Gujarat'})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Career & Financial Snapshot */}
            <div className={styles.detailCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <GraduationCap size={18} className={styles.iconBurgundy} />
                  <span>Education & Profession</span>
                </h3>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.infoRowGrid}>
                  <div className={styles.infoField}>
                    <span className={styles.fieldLabel}>Highest Education</span>
                    <span className={styles.fieldValue}>{user.education}</span>
                  </div>
                  <div className={styles.infoField}>
                    <span className={styles.fieldLabel}>Profession / Designation</span>
                    <span className={styles.fieldValue}>{user.occupation}</span>
                  </div>
                  <div className={styles.infoField}>
                    <span className={styles.fieldLabel}>Employer / Business</span>
                    <span className={styles.fieldValue}>{user.company || 'Not Specified'}</span>
                  </div>
                  <div className={styles.infoField}>
                    <span className={styles.fieldLabel}>Annual Income Range</span>
                    <span className={styles.fieldValue}>
                      <span className={styles.highlightBadge}>
                        {user.incomeRange || 'Confidential'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Partner Expectations Box */}
            <div className={`${styles.detailCard} ${styles.fullWidthCard}`}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <Heart size={18} className={styles.iconBurgundy} />
                  <span>Partner Expectations & Matchmaking Criteria</span>
                </h3>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.preferencesParagraph}>
                  {user.partnerPreferences ||
                    'Looking for an understanding, educated life partner from the Ahir community with compatible family background and values.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PERSONAL & CONTACT TAB */}
        {activeTab === 'personal' && (
          <div className={styles.detailCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <Mail size={18} className={styles.iconBurgundy} />
                <span>Personal & Direct Contact Information</span>
              </h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.infoRowGrid}>
                <div className={styles.infoField}>
                  <span className={styles.fieldLabel}>Full Name</span>
                  <span className={styles.fieldValue}>{user.fullName}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.fieldLabel}>Gender</span>
                  <span className={styles.fieldValue}>{user.gender}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.fieldLabel}>Date of Birth</span>
                  <span className={styles.fieldValue}>
                    {user.dateOfBirth} ({user.age} Years Old)
                  </span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.fieldLabel}>Height</span>
                  <span className={styles.fieldValue}>{user.height || 'N/A'}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.fieldLabel}>Marital Status</span>
                  <span className={styles.fieldValue}>{user.maritalStatus}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.fieldLabel}>Primary Mobile / WhatsApp</span>
                  <span className={styles.fieldValue}>
                    <a href={`tel:${user.mobileNumber}`} className={styles.linkPhone}>
                      <Phone size={14} />
                      <strong>{user.mobileNumber}</strong>
                    </a>
                  </span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.fieldLabel}>Email Address</span>
                  <span className={styles.fieldValue}>
                    {user.emailAddress ? (
                      <a href={`mailto:${user.emailAddress}`} className={styles.linkMail}>
                        {user.emailAddress}
                      </a>
                    ) : (
                      'Not Provided'
                    )}
                  </span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.fieldLabel}>Current City of Residence</span>
                  <span className={styles.fieldValue}>{user.currentCity}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.fieldLabel}>Native Place / District</span>
                  <span className={styles.fieldValue}>{user.nativePlace || 'Gujarat'}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.fieldLabel}>Matchmaking Consent</span>
                  <span className={styles.fieldValue}>
                    <CheckCircle2 size={15} className={styles.textSuccess} />
                    Agreed & Signed
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAMILY BACKGROUND TAB */}
        {activeTab === 'family' && (
          <div className={styles.detailCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <FamilyIcon size={18} className={styles.iconBurgundy} />
                <span>Family Details & Heritage</span>
              </h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.infoRowGrid}>
                <div className={styles.infoField}>
                  <span className={styles.fieldLabel}>Father&apos;s Name</span>
                  <span className={styles.fieldValue}>{user.fatherName || 'Not Disclosed'}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.fieldLabel}>Mother&apos;s Name</span>
                  <span className={styles.fieldValue}>{user.motherName || 'Not Disclosed'}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.fieldLabel}>Siblings Details</span>
                  <span className={styles.fieldValue}>{user.siblings || 'None / Not Mentioned'}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.fieldLabel}>Community Tradition</span>
                  <span className={styles.fieldValue}>Ahir Community (Saurashtra / Kutch)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CAREER TAB */}
        {activeTab === 'career' && (
          <div className={styles.detailCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <Briefcase size={18} className={styles.iconBurgundy} />
                <span>Education, Career & Financial Details</span>
              </h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.infoRowGrid}>
                <div className={styles.infoField}>
                  <span className={styles.fieldLabel}>Educational Qualification</span>
                  <span className={styles.fieldValue}>{user.education}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.fieldLabel}>Designation / Role</span>
                  <span className={styles.fieldValue}>{user.occupation}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.fieldLabel}>Company / Institution</span>
                  <span className={styles.fieldValue}>{user.company || 'Private Firm / Enterprise'}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.fieldLabel}>Annual Income</span>
                  <span className={styles.fieldValue}>{user.incomeRange || 'Confidential'}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.fieldLabel}>Work Location</span>
                  <span className={styles.fieldValue}>{user.currentCity}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PREFERENCES TAB */}
        {activeTab === 'preferences' && (
          <div className={styles.detailCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <Heart size={18} className={styles.iconBurgundy} />
                <span>Partner Preferences & Expectations</span>
              </h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.prefDisplayBox}>
                <h4 className={styles.prefHeading}>Desired Partner Profile</h4>
                <p className={styles.preferencesParagraph}>
                  {user.partnerPreferences ||
                    'Looking for an educated, career-focused partner from the Ahir community who values joint family culture and mutual respect.'}
                </p>
              </div>

              <div className={styles.matchmakingChecklist}>
                <div className={styles.checkItem}>
                  <CheckCircle2 size={16} className={styles.textSuccess} />
                  <span>Respectful of traditional Ahir family traditions</span>
                </div>
                <div className={styles.checkItem}>
                  <CheckCircle2 size={16} className={styles.textSuccess} />
                  <span>Vegetarian lifestyle adherence</span>
                </div>
                <div className={styles.checkItem}>
                  <CheckCircle2 size={16} className={styles.textSuccess} />
                  <span>Prepared for private, human-assisted family coordination</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AUDIT & NOTES TAB */}
        {activeTab === 'audit' && (
          <div className={styles.detailCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <FileText size={18} className={styles.iconBurgundy} />
                <span>Verification Audit & Administrative Logs</span>
              </h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.auditBox}>
                <div className={styles.auditHeader}>
                  <ShieldCheck size={18} className={styles.iconGold} />
                  <span>Admin Internal Verification Notes</span>
                </div>
                <p className={styles.auditNotes}>
                  {user.notes ||
                    'Initial profile documents submitted and under review by AhirMilap verification team.'}
                </p>
                <div className={styles.auditFooter}>
                  <span>Registered Timestamp: {user.registrationDate}</span>
                  {user.lastModified && <span>Last Modified: {user.lastModified}</span>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Matrimonial Profile"
        subtitle="Permanent administrative action."
      >
        <div className={styles.deleteConfirmWrap}>
          <div className={styles.deleteWarning}>
            <AlertTriangle size={24} className={styles.iconDanger} />
            <div>
              <p>
                Are you sure you want to permanently delete{' '}
                <strong>{user.fullName}</strong>?
              </p>
              <small>
                This action will delete all registered matrimonial records and cannot be
                recovered.
              </small>
            </div>
          </div>

          <div className={styles.deleteActions}>
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
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 size={16} />
              <span>{deleting ? 'Deleting...' : 'Yes, Delete Profile'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
