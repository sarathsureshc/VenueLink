import { HelmetProvider } from 'react-helmet-async';
import { Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import EventManagerRoute from './components/common/EventManagerRoute';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyOTPPage from './pages/auth/VerifyOTPPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import EventsPage from './pages/event/EventsPage';
import EventDetailPage from './pages/event/EventDetailPage';
import CreateEventPage from './pages/event/CreateEventPage';
import EditEventPage from './pages/event/EditEventPage';
import MyEventsPage from './pages/event/MyEventsPage';
import BookingsPage from './pages/booking/BookingsPage';
import BookingDetailPage from './pages/booking/BookingDetailPage';
import ProfilePage from './pages/user/ProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<VerifyOTPPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Private Routes */}
            <Route path="/profile" element={<PrivateRoute />}>
              <Route index element={<ProfilePage />} />
            </Route>

            <Route path="/my-bookings" element={<PrivateRoute />}>
              <Route index element={<BookingsPage />} />
            </Route>

            <Route path="/bookings/:id" element={<PrivateRoute />}>
              <Route index element={<BookingDetailPage />} />
            </Route>

            {/* Event Manager Routes */}
            <Route path="/my-events" element={<EventManagerRoute />}>
              <Route index element={<MyEventsPage />} />
            </Route>

            <Route path="/create-event" element={<EventManagerRoute />}>
              <Route index element={<CreateEventPage />} />
            </Route>

            <Route path="/edit-event/:id" element={<EventManagerRoute />}>
              <Route index element={<EditEventPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={<AdminDashboardPage />} />
            </Route>

            <Route path="/admin/users" element={<AdminRoute />}>
              <Route index element={<AdminUsersPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;