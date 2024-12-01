import { Link, Navigate, Outlet } from 'react-router-dom';
import { userAuthStore } from '../store';

const Dasboard = () => {
    const {user} = userAuthStore();
    if(user === null) {
        return <Navigate to="/auth/login" replace={true} />
    }
    return (
        <div>
            <h1>Dashboar</h1>
    <Link to="/auth/login" > back to login page</Link>

            <Outlet />
        </div>
    );
};

export default Dasboard;
