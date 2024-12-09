import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { userAuthStore } from '../store';

const NonAuth = () => {
    const location = useLocation();

    const { user } = userAuthStore();

    if (user !== null) {
        const returnTo = new URLSearchParams(location.search).get('returnTo') || '/'
        return <Navigate to={returnTo} replace={true} />;
    }
    
    return (
        <div>
            <Outlet />
        </div>
    );
};

export default NonAuth;
