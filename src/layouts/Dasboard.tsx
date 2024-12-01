import { Outlet } from 'react-router-dom';

const Dasboard = () => {
    return (
        <div>
            <h1>Dashboar</h1>
            <Outlet />
        </div>
    );
};

export default Dasboard;
