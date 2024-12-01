import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/login/login';
import Dasboard from './layouts/Dasboard';
import NonAuth from './layouts/NonAuth';
import Root from './layouts/Root';
import Users from './pages/users/Users';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '',
                element: <Dasboard />,
                children: [
                    {
                        path: '', //we can add '/' also here
                        element: <Home />,
                    },
                    {
                        path: '/users', 
                        element: <Users />,
                    },
                ],
            },
            {
                path: '/auth', //prefix
                element: <NonAuth />,
                children: [
                    {
                        path: 'login',
                        element: <LoginPage />,
                    },
                ],
            },
        ],
    },
]);
