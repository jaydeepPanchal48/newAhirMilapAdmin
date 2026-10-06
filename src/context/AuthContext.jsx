import { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ADMIN } from '../data/mockUsers';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'ahirmilap_admin_session';

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check saved session
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setAdmin(JSON.parse(stored));
      } else {
        // Pre-authenticated for convenience or prompt login
        // Default: logged in so developer can immediately explore, but login page is fully functional!
        setAdmin(INITIAL_ADMIN);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(INITIAL_ADMIN));
      }
    } catch (err) {
      console.error('Session parse error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, remember = true) => {
    // Simulate real auth delay
    await new Promise((res) => setTimeout(res, 600));

    // Basic credential validation
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail.includes('@') || password.length < 4) {
      throw new Error('Please enter a valid email address and password (min 4 characters).');
    }

    const sessionAdmin = {
      ...INITIAL_ADMIN,
      email: trimmedEmail,
      name: trimmedEmail.startsWith('admin') ? 'Administrator' : trimmedEmail.split('@')[0],
      lastLogin: new Date().toISOString(),
    };

    setAdmin(sessionAdmin);
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionAdmin));
    return sessionAdmin;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateProfile = (data) => {
    setAdmin((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        loading,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
