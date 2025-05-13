import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const EventManagerRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return user.role === 'event_manager' || user.role === 'admin' ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

export default EventManagerRoute;