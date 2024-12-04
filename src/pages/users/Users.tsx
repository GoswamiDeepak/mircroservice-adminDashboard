import { Breadcrumb, Space, Table } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../http/api';
import { User } from '../../types';
import { userAuthStore } from '../../store';
import UserFilter from './UserFilter';

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'firstname',
        key: 'firstname',
        render: (_text: string, record: User) => (
            <Link to={`/users/${record.id}`}>
                {record.firstname} {record.lastname}
            </Link>
        ),
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
    },
];

const Users = () => {
    const {
        data: users,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await getUsers();
            return res.data;
        },
    });

    const { user } = userAuthStore();

    if (user?.role !== 'admin') {
        return <Navigate to="/" replace={true} />;
    }

    return (
        <>
            <Space
                direction="vertical"
                size={'large'}
                style={{ width: '100%' }}>
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[
                        { title: <Link to="/">Dashboard</Link> },
                        { title: 'Users' },
                    ]}
                />
                <UserFilter
                    onFilterChange={(
                        filterName: string,
                        filterValue: string
                    ) => {
                        console.log(filterName, filterValue);
                    }}
                />
                {isLoading && <div>Loading...</div>}

                {isError && <div>{error.message}</div>}

                <Table columns={columns} dataSource={users} rowKey={'id'} />
            </Space>
        </>
    );
};

export default Users;
