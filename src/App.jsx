import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout/AdminLayout';
import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import UsersListPage from './pages/Users/UsersListPage';
import UserDetailsPage from './pages/UserDetails/UserDetailsPage';
import UserEditPage from './pages/UserEdit/UserEditPage';
import SettingsPage from './pages/Settings/SettingsPage';
import AdminProfilePage from './pages/AdminProfile/AdminProfilePage';
import NotFoundPage from './pages/NotFound/NotFoundPage';

export default function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Admin Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* User Management Routes */}
        <Route path="/users" element={<UsersListPage presetFilter="all" />} />
        <Route
          path="/users/pending"
          element={<UsersListPage presetFilter="pending" />}
        />
        <Route
          path="/users/verified"
          element={<UsersListPage presetFilter="verified" />}
        />
        <Route
          path="/users/active"
          element={<UsersListPage presetFilter="active" />}
        />
        <Route
          path="/users/inactive"
          element={<UsersListPage presetFilter="inactive" />}
        />
        <Route path="/users/new" element={<UserEditPage isNew={true} />} />
        <Route path="/users/:id" element={<UserDetailsPage />} />
        <Route path="/users/:id/edit" element={<UserEditPage isNew={false} />} />

        {/* System Settings & Profile */}
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<AdminProfilePage />} />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
