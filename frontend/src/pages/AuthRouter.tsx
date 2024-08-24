
import useAuth from '@/hooks/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const AuthRouter = () => {

    const {currentUser, loading} = useAuth();
    const location = useLocation();

    if(loading){
        return (
            <div>
                Loading
            </div>
        )
    }
    return (
        currentUser ? <Outlet/> : <Navigate to="/login" state={{ from: location}} replace/>
    )
}

export default AuthRouter
