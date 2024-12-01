import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { userAuthStore } from '../store';
import {
    Avatar,
    Badge,
    Dropdown,
    Flex,
    Layout,
    Menu,
    Space,
    theme,
} from 'antd';
import Icon, {
    BellFilled,
    HomeOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import Logo from '../components/icons/Logo';
import Restaurant from '../components/icons/Restaurant';
import { useLogout } from '../hooks/useLogout';
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
    const { logoutMutate } = useLogout();

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
                    theme="light"
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
                        style={{
                            padding: '0 16px',
                            background: colorBgContainer,
                        }}>
                        <Flex
                            gap="middle"
                            align="start"
                            justify="space-between">
                            <Badge text={user.role === 'admin' ? 'You are an admin.' : user.tenant?.name} status="success" />
                            <Space size={16}>
                                <Badge dot={true}>
                                    <BellFilled />
                                </Badge>
                                <Dropdown
                                    menu={{
                                        items: [
                                            {
                                                key: 'logout',
                                                label: 'Logout',
                                                onClick: () => logoutMutate(),
                                            },
                                        ],
                                    }}
                                    placement="bottomRight">
                                    <Avatar
                                        style={{
                                            backgroundColor: '#fde3cf',
                                            color: '#f56a00',
                                        }}>
                                        U
                                    </Avatar>
                                </Dropdown>
                            </Space>
                        </Flex>
                    </Header>
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
