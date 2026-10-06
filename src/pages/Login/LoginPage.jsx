import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Users,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import styles from './LoginPage.module.scss';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('admin@ahirmilap.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password, rememberMe);
      toast.success('Welcome back, Administrator!');
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Invalid credentials.');
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Brand Visual Column (Desktop) */}
      <div className={styles.brandHeroSide}>
        <div className={styles.brandHeroInner}>
          <div className={styles.logoBadge}>
            <img src="/logo.png" alt="AhirMilap" className={styles.brandLogo} />
          </div>

          <div className={styles.heroContent}>
            <span className={styles.taglineBadge}>
              <ShieldCheck size={16} /> Confidential Matrimony SaaS
            </span>
            <h1 className={styles.heroTitle}>
              Ahir Community Matrimonial Management Portal
            </h1>
            <p className={styles.heroSubtitle}>
              Dedicated verification desk and matchmaking administration for Ahir
              families across Saurashtra, Kutch, Gujarat, and global communities.
            </p>

            <div className={styles.featurePills}>
              <div className={styles.pillItem}>
                <CheckCircle2 size={16} className={styles.checkIcon} />
                <span>Strict Human-Assisted Profile Verification</span>
              </div>
              <div className={styles.pillItem}>
                <CheckCircle2 size={16} className={styles.checkIcon} />
                <span>Confidential Family Records Management</span>
              </div>
              <div className={styles.pillItem}>
                <CheckCircle2 size={16} className={styles.checkIcon} />
                <span>Automated Partner Preference Matching</span>
              </div>
            </div>
          </div>

          <div className={styles.portalFootnote}>
            <span>AhirMilap Administration System v2.6 • Secure Access</span>
          </div>
        </div>
      </div>

      {/* Form Column */}
      <div className={styles.formSide}>
        <div className={styles.formCard}>
          {/* Mobile Logo View */}
          <div className={styles.mobileLogoHeader}>
            <img src="/logo.png" alt="AhirMilap" />
          </div>

          <div className={styles.formHeader}>
            <span className={styles.eyebrow}>ADMINISTRATOR PORTAL</span>
            <h2 className={styles.loginTitle}>Admin Sign In</h2>
            <p className={styles.loginDesc}>
              Enter your credentials to manage registrations, review pending
              profiles, and update platform records.
            </p>
          </div>

          {errorMessage && (
            <div className={styles.errorAlert} role="alert">
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            {/* Email Field */}
            <div className={styles.formGroup}>
              <label htmlFor="adminEmail">Email Address or Username</label>
              <div className={styles.inputWrap}>
                <Mail size={18} className={styles.inputIcon} />
                <input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@ahirmilap.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage('');
                  }}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className={styles.formGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="adminPassword">Password</label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info('Please contact the IT Security officer to reset your credentials.');
                  }}
                  className={styles.forgotLink}
                >
                  Forgot Password?
                </a>
              </div>
              <div className={styles.inputWrap}>
                <Lock size={18} className={styles.inputIcon} />
                <input
                  id="adminPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage('');
                  }}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className={styles.checkboxRow}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.btnSpinner} />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Quick Demo Credentials Info */}
            <div className={styles.quickTip}>
              <span>Default Admin Demo:</span>
              <code>admin@ahirmilap.com</code> / <code>admin123</code>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
