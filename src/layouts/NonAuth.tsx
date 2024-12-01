import { Navigate, Outlet } from 'react-router-dom';
import { userAuthStore } from '../store';

const NonAuth = () => {
    const { user } = userAuthStore();
    if (user !== null) {
        return <Navigate to="/" replace={true} />;
    }
    return (
        <div>
            <h1>Non Auth</h1>
            <Outlet />
        </div>
    );
};

export default NonAuth;
