import { JSX } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type PrivateRouteProps = {
  children: JSX.Element;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

//   useEffect(() => {
//     // 可以在此处添加路由访问跟踪逻辑
//   }, [location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/" state={{ from: location }} replace />;
};

export default PrivateRoute;