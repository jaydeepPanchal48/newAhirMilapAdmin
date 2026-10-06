import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  X,
  Camera,
  ShieldCheck,
  User,
  Users as FamilyIcon,
  GraduationCap,
  Heart,
  Sliders,
} from 'lucide-react';
import { userService } from '@/services/userService';
import { useToast } from '@/context/ToastContext';
import styles from './UserEditPage.module.scss';

export default function UserEditPage({ isNew = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'Male',
    dateOfBirth: '',
    mobileNumber: '',
    emailAddress: '',
    currentCity: '',
    nativePlace: '',
    fatherName: '',
    motherName: '',
    siblings: '',
    education: '',
    occupation: '',
    company: '',
    incomeRange: '',
    height: '',
    maritalStatus: 'Never Married',
    partnerPreferences: '',
    verificationStatus: 'Pending',
    accountStatus: 'Active',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    notes: '',
  });

  const [photoPreview, setPhotoPreview] = useState(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
  );
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (isNew || !id) return undefined;
    const controller = new AbortController();

    const loadRegistration = async () => {
      setLoading(true);
      try {
        const existing = await userService.getRegistrationById(id, { signal: controller.signal });
        setFormData({
          fullName: existing.fullName || '',
          gender: existing.gender || 'Male',
          dateOfBirth: existing.dateOfBirth ? existing.dateOfBirth.slice(0, 10) : '',
          mobileNumber: existing.mobileNumber || '',
          emailAddress: existing.emailAddress || '',
          currentCity: existing.currentCity || '',
          nativePlace: existing.nativePlace || '',
          fatherName: existing.fatherName || '',
          motherName: existing.motherName || '',
          siblings: existing.siblings || '',
          education: existing.education || '',
          occupation: existing.occupation || '',
          company: existing.company || '',
          incomeRange: existing.incomeRange || '',
          height: existing.height || '',
          maritalStatus: existing.maritalStatus || 'Never Married',
          partnerPreferences: existing.partnerPreferences || '',
          verificationStatus: existing.verificationStatus || 'Pending',
          accountStatus: existing.accountStatus || 'Active',
          profilePhoto: existing.profilePhoto || '',
          notes: existing.notes || '',
        });
        setPhotoPreview(existing.profilePhoto || '');
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error(error.message || `Unable to load profile ${id}.`);
          navigate('/users', { replace: true });
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadRegistration();
    return () => controller.abort();
  }, [id, isNew, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData((prev) => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.dateOfBirth || !formData.mobileNumber || !formData.currentCity || !formData.education || !formData.occupation) {
      toast.error('Please complete all mandatory fields marked with *');
      return;
    }

    setSubmitting(true);

    try {
      if (isNew) {
        const created = userService.createUser({
          ...formData,
          profilePhoto: photoPreview,
        });
        toast.success(`Matrimonial profile ${created.id} created successfully!`);
        navigate(`/users/${created.id}`);
      } else {
        await userService.updateRegistration(id, {
          ...formData,
          profilePhoto: photoPreview,
        });
        toast.success(`Profile ${id} updated successfully!`);
        navigate(`/users/${id}`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save profile. Please check the inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.editPage}>Loading profile...</div>;
  }

  return (
    <div className={styles.editPage}>
      {/* Top Header */}
      <div className={styles.topNavRow}>
        <Link to={isNew ? '/users' : `/users/${id}`} className={styles.backBtn}>
          <ArrowLeft size={16} />
          <span>{isNew ? 'Back to Users List' : 'Back to Profile'}</span>
        </Link>
      </div>

      <div className={styles.pageHeader}>
        <div>
          <span className={styles.breadcrumb}>
            {isNew ? 'NEW MATRIMONIAL REGISTRATION' : `EDIT PROFILE • ${id}`}
          </span>
          <h1 className={styles.title}>
            {isNew ? 'Register Matrimonial Profile' : `Edit: ${formData.fullName}`}
          </h1>
          <p className={styles.subtitle}>
            Matches the authentic AhirMilap registration form structure with
            administrative controls.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        {/* Photo Management Card */}
        <div className={styles.formSectionCard}>
          <div className={styles.cardHeader}>
            <Camera size={18} className={styles.iconBurgundy} />
            <h3>Profile Photo Management</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.photoUploadRow}>
              <div className={styles.previewBox}>
                <img src={photoPreview} alt="Preview" className={styles.previewImage} />
              </div>
              <div className={styles.photoControls}>
                <label className="btn btn-secondary btn-sm" htmlFor="fileUploadBtn">
                  <Camera size={15} />
                  <span>Choose Photo File</span>
                </label>
                <input
                  id="fileUploadBtn"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                <div className={styles.urlInputRow}>
                  <label htmlFor="photoUrlDirect">Or Enter Image URL:</label>
                  <input
                    id="photoUrlDirect"
                    type="url"
                    placeholder="https://..."
                    value={formData.profilePhoto}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, profilePhoto: e.target.value }));
                      if (e.target.value) setPhotoPreview(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: PERSONAL DETAILS */}
        <div className={styles.formSectionCard}>
          <div className={styles.cardHeader}>
            <User size={18} className={styles.iconBurgundy} />
            <h3>1. Personal Information</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.gridTwo}>
              <div className={styles.formGroup}>
                <label htmlFor="fullName">Full Name *</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="e.g. Ramesh Ahir"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="gender">Gender *</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="Male">Male (Groom)</option>
                  <option value="Female">Female (Bride)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="dateOfBirth">Date of Birth *</label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="mobileNumber">Mobile Number *</label>
                <input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="emailAddress">Email Address</label>
                <input
                  id="emailAddress"
                  name="emailAddress"
                  type="email"
                  placeholder="user@example.com"
                  value={formData.emailAddress}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="currentCity">Current City *</label>
                <input
                  id="currentCity"
                  name="currentCity"
                  type="text"
                  placeholder="e.g. Rajkot / Ahmedabad"
                  value={formData.currentCity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="nativePlace">Native Place</label>
                <input
                  id="nativePlace"
                  name="nativePlace"
                  type="text"
                  placeholder="e.g. Junagadh / Kutch / Dwarka"
                  value={formData.nativePlace}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: FAMILY DETAILS */}
        <div className={styles.formSectionCard}>
          <div className={styles.cardHeader}>
            <FamilyIcon size={18} className={styles.iconBurgundy} />
            <h3>2. Family Background</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.gridTwo}>
              <div className={styles.formGroup}>
                <label htmlFor="fatherName">Father&apos;s Name</label>
                <input
                  id="fatherName"
                  name="fatherName"
                  type="text"
                  placeholder="Father's full name"
                  value={formData.fatherName}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="motherName">Mother&apos;s Name</label>
                <input
                  id="motherName"
                  name="motherName"
                  type="text"
                  placeholder="Mother's full name"
                  value={formData.motherName}
                  onChange={handleChange}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="siblings">Siblings Details</label>
                <input
                  id="siblings"
                  name="siblings"
                  type="text"
                  placeholder="e.g. 1 elder brother, 1 sister"
                  value={formData.siblings}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: EDUCATION & PROFESSION */}
        <div className={styles.formSectionCard}>
          <div className={styles.cardHeader}>
            <GraduationCap size={18} className={styles.iconBurgundy} />
            <h3>3. Education & Profession</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.gridTwo}>
              <div className={styles.formGroup}>
                <label htmlFor="education">Education *</label>
                <input
                  id="education"
                  name="education"
                  type="text"
                  placeholder="e.g. B.Tech / MBBS / CA / M.Com"
                  value={formData.education}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="occupation">Occupation / Profession *</label>
                <input
                  id="occupation"
                  name="occupation"
                  type="text"
                  placeholder="e.g. Software Engineer / Govt Officer / Business"
                  value={formData.occupation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="company">Company / Business Name</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Employer or Firm name"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="incomeRange">Annual Income Range</label>
                <select
                  id="incomeRange"
                  name="incomeRange"
                  value={formData.incomeRange}
                  onChange={handleChange}
                >
                  <option value="">Select Annual Income</option>
                  <option value="Under 3 LPA">Under 3 LPA</option>
                  <option value="3 to 6 LPA">3 to 6 LPA</option>
                  <option value="6 to 10 LPA">6 to 10 LPA</option>
                  <option value="10 to 18 LPA">10 to 18 LPA</option>
                  <option value="18 LPA+">18 LPA+</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: BASIC LIFESTYLE */}
        <div className={styles.formSectionCard}>
          <div className={styles.cardHeader}>
            <Heart size={18} className={styles.iconBurgundy} />
            <h3>4. Basic Lifestyle</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.gridTwo}>
              <div className={styles.formGroup}>
                <label htmlFor="height">Height</label>
                <select
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                >
                  <option value="">Select Height</option>
                  <option value="5'0&quot; (152 cm)">5&apos;0&quot; (152 cm)</option>
                  <option value="5'2&quot; (157 cm)">5&apos;2&quot; (157 cm)</option>
                  <option value="5'4&quot; (163 cm)">5&apos;4&quot; (163 cm)</option>
                  <option value="5'6&quot; (168 cm)">5&apos;6&quot; (168 cm)</option>
                  <option value="5'8&quot; (173 cm)">5&apos;8&quot; (173 cm)</option>
                  <option value="5'10&quot; (178 cm)">5&apos;10&quot; (178 cm)</option>
                  <option value="6'0&quot; (183 cm)">6&apos;0&quot; (183 cm)</option>
                  <option value="6'2&quot;+ (188 cm+)">6&apos;2&quot;+ (188 cm+)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="maritalStatus">Marital Status *</label>
                <select
                  id="maritalStatus"
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="Never Married">Never Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Awaiting Divorce">Awaiting Divorce</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: PARTNER PREFERENCES */}
        <div className={styles.formSectionCard}>
          <div className={styles.cardHeader}>
            <Heart size={18} className={styles.iconBurgundy} />
            <h3>5. Partner Preferences</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.formGroup}>
              <label htmlFor="partnerPreferences">Partner Preferences & Expectations</label>
              <textarea
                id="partnerPreferences"
                name="partnerPreferences"
                rows={4}
                placeholder="Describe what the candidate is looking for in a life partner..."
                value={formData.partnerPreferences}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* SECTION 6: ADMINISTRATIVE STATUS */}
        <div className={styles.formSectionCard}>
          <div className={styles.cardHeader}>
            <Sliders size={18} className={styles.iconBurgundy} />
            <h3>6. Administrative Status & Verification</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.gridTwo}>
              <div className={styles.formGroup}>
                <label htmlFor="verificationStatus">Verification Status</label>
                <select
                  id="verificationStatus"
                  name="verificationStatus"
                  value={formData.verificationStatus}
                  onChange={handleChange}
                >
                  <option value="Pending">Pending Verification</option>
                  <option value="Verified">Verified Profile</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="accountStatus">Account Status</label>
                <select
                  id="accountStatus"
                  name="accountStatus"
                  value={formData.accountStatus}
                  onChange={handleChange}
                >
                  <option value="Active">Active Profile</option>
                  <option value="Inactive">Inactive / Suspended</option>
                </select>
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="notes">Admin Verification Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Record identity checks, Aadhaar review, or guardian confirmation notes..."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className={styles.formActionBar}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(isNew ? '/users' : `/users/${id}`)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            <Save size={16} />
            <span>{isNew ? 'Create Matrimonial Profile' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
