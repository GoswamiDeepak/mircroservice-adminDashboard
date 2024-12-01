import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { userAuthStore } from '../store';
import { Layout, Menu, theme } from 'antd';
import Icon,{ HomeOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Logo from '../components/icons/Logo';
import Restaurant from '../components/icons/Restaurant';
const { Header, Content, Footer, Sider } = Layout;
const items = [
    {
        key: '/',
        icon: <HomeOutlined />,
        label: <NavLink to="/">Home</NavLink>,
    },
    {
        key: '/users',
        icon: <UserOutlined />,
        label: <NavLink to="/users">Users</NavLink>,
    },
    {
        key: '/restaurants',
        icon: <Icon component={Restaurant} />,
        label: <NavLink to="/restaurants">Restaurants</NavLink>,
    },
    {
        key: '/products',
        icon: <UserOutlined />,
        label: <NavLink to="/products">Products</NavLink>,
    },
    {
        key: '/promos',
        icon: <UserOutlined />,
        label: <NavLink to="/promos">Promos</NavLink>,
    },
];

const Dasboard = () => {
    const [collapsed, setCollapsed] = useState(false);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { user } = userAuthStore();

    if (user === null) {
        return <Navigate to="/auth/login" replace={true} />;
    }

    return (
        <div>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsible
                    theme='light'
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}>
                    <div className="logo">
                        <Logo />
                    </div>
                    <Menu
                        theme="light"
                        defaultSelectedKeys={['/']}
                        mode="inline"
                        items={items}
                    />
                </Sider>
                <Layout>
                    <Header
                        style={{ padding: 0, background: colorBgContainer }}
                    />
                    <Content style={{ margin: '0 16px' }}>
                        <Outlet />
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Microservice Admin Dashboard
                    </Footer>
                </Layout>
            </Layout>
        </div>
    );
};

export default Dasboard;
