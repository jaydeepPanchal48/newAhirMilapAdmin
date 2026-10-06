import { INITIAL_USERS } from '../data/mockUsers';

const STORAGE_KEY = 'ahirmilap_admin_users_v1';

// Initialize LocalStorage with seed data if not present
const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_USERS;
  } catch (err) {
    console.error('Error reading users from localStorage:', err);
    return INITIAL_USERS;
  }
};

const saveUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving users to localStorage:', err);
  }
};

export const userService = {
  getAllUsers() {
    return getStoredUsers();
  },

  getUserById(id) {
    const users = getStoredUsers();
    return users.find((u) => u.id === id) || null;
  },

  createUser(userData) {
    const users = getStoredUsers();
    const nextNumber = users.length + 1;
    const formattedId = `AM-2026-${String(nextNumber).padStart(3, '0')}`;

    // Calculate age from DOB if DOB is provided
    let calculatedAge = 25;
    if (userData.dateOfBirth) {
      const dobYear = new Date(userData.dateOfBirth).getFullYear();
      const currentYear = new Date().getFullYear();
      if (!isNaN(dobYear)) {
        calculatedAge = currentYear - dobYear;
      }
    }

    const newUser = {
      ...userData,
      id: formattedId,
      age: calculatedAge,
      verificationStatus: userData.verificationStatus || 'Pending',
      accountStatus: userData.accountStatus || 'Active',
      registrationDate: new Date().toISOString(),
      consentAgreed: true,
      profilePhoto: userData.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      notes: userData.notes || 'Created manually by Administrator.',
    };

    const updated = [newUser, ...users];
    saveUsers(updated);
    return newUser;
  },

  updateUser(id, updatedFields) {
    const users = getStoredUsers();
    let updatedUser = null;

    const updated = users.map((user) => {
      if (user.id === id) {
        let age = user.age;
        if (updatedFields.dateOfBirth && updatedFields.dateOfBirth !== user.dateOfBirth) {
          const dobYear = new Date(updatedFields.dateOfBirth).getFullYear();
          const currentYear = new Date().getFullYear();
          if (!isNaN(dobYear)) {
            age = currentYear - dobYear;
          }
        }

        updatedUser = {
          ...user,
          ...updatedFields,
          age,
          lastModified: new Date().toISOString(),
        };
        return updatedUser;
      }
      return user;
    });

    saveUsers(updated);
    return updatedUser;
  },

  deleteUser(id) {
    const users = getStoredUsers();
    const updated = users.filter((u) => u.id !== id);
    saveUsers(updated);
    return true;
  },

  updateStatus(id, newStatus) {
    return this.updateUser(id, { accountStatus: newStatus });
  },

  updateVerification(id, newVerificationStatus) {
    return this.updateUser(id, { verificationStatus: newVerificationStatus });
  },

  getStats() {
    const users = getStoredUsers();
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.accountStatus === 'Active').length;
    const inactiveUsers = users.filter((u) => u.accountStatus === 'Inactive').length;
    const verifiedUsers = users.filter((u) => u.verificationStatus === 'Verified').length;
    const pendingVerification = users.filter((u) => u.verificationStatus === 'Pending').length;
    const rejectedProfiles = users.filter((u) => u.verificationStatus === 'Rejected').length;
    const maleUsers = users.filter((u) => u.gender === 'Male').length;
    const femaleUsers = users.filter((u) => u.gender === 'Female').length;

    // Recent 7 days registrations
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newRegistrations = users.filter(
      (u) => new Date(u.registrationDate) >= oneWeekAgo
    ).length;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      verifiedUsers,
      pendingVerification,
      rejectedProfiles,
      maleUsers,
      femaleUsers,
      newRegistrations,
    };
  },

  resetDefaults() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  },

  exportToCSV(usersToExport = null) {
    const users = usersToExport || getStoredUsers();
    const headers = [
      'Profile ID',
      'Full Name',
      'Gender',
      'Age',
      'Date of Birth',
      'Mobile Number',
      'Email',
      'Current City',
      'Native Place',
      'Education',
      'Occupation',
      'Income Range',
      'Height',
      'Marital Status',
      'Verification Status',
      'Account Status',
      'Registration Date',
    ];

    const rows = users.map((u) => [
      `"${u.id}"`,
      `"${u.fullName}"`,
      `"${u.gender}"`,
      u.age,
      `"${u.dateOfBirth}"`,
      `"${u.mobileNumber}"`,
      `"${u.emailAddress || ''}"`,
      `"${u.currentCity}"`,
      `"${u.nativePlace || ''}"`,
      `"${u.education}"`,
      `"${u.occupation}"`,
      `"${u.incomeRange || ''}"`,
      `"${u.height || ''}"`,
      `"${u.maritalStatus}"`,
      `"${u.verificationStatus}"`,
      `"${u.accountStatus}"`,
      `"${u.registrationDate}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AhirMilap_Users_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
