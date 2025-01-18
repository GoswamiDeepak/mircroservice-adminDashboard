import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/login/login';
import Dasboard from './layouts/Dasboard';
import NonAuth from './layouts/NonAuth';
import Root from './layouts/Root';
import Users from './pages/users/Users';
import Tenants from './pages/tenants/Tenants';
import Products from './pages/products/Products';
import OrdersPage from './pages/orders/Orderspage';

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
                    {
                        path: '/restaurants',
                        element: <Tenants />,
                    },
                    {
                        path: '/products',
                        element: <Products />,
                    },
                    {
                        path: '/orders',
                        element: <OrdersPage />,
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
