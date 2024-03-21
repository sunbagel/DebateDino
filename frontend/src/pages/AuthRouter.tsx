
import useAuth from '@/hooks/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const AuthRouter = () => {

    const {currentUser} = useAuth();
    const location = useLocation();

    return (
        currentUser ? <Outlet/> : <Navigate to="/login" state={{ from: location}} replace/>
    )
}

export default AuthRouter
