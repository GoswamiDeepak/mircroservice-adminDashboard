import { Breadcrumb, Space, Table } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../http/api';
import { User } from '../../types';

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
    return (
        <>
            <Space direction='vertical' size={'large'} style={{width: '100%'}}>
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[
                        { title: <Link to="/">Dashboard</Link> },
                        { title: 'Users' },
                    ]}
                />

                {isLoading && <div>Loading...</div>}

                {isError && <div>{error.message}</div>}

                <Table columns={columns} dataSource={users} />
            </Space>
        </>
    );
};

export default Users;
