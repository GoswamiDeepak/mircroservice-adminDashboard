import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from 'antd';
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, getUsers } from '../../http/api';
import { CreateUserData, User } from '../../types';
import { userAuthStore } from '../../store';
import UserFilter from './UserFilter';
import { useState } from 'react';
import UserForm from './forms/UserForm';

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
    const queryClient = useQueryClient();

    const [form] = Form.useForm();

    const [isDraweropen, setDrawerOpen] = useState(false);

    const {
        token: { colorBgLayout },
    } = theme.useToken();

    

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

    const { mutate: userMutate } = useMutation({
        mutationKey: ['createUser'],
        mutationFn: async (data: CreateUserData) =>
            createUser(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['users'],
            });
            return;
        },
    });

    const onHandleSubmit = async () => {
        await form.validateFields();
        console.log(form.getFieldsValue());
        await userMutate(form.getFieldsValue());
        form.resetFields();
        setDrawerOpen(false);
    };

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
                    }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setDrawerOpen(true)}>
                        Add User
                    </Button>
                </UserFilter>

                {isLoading && <div>Loading...</div>}

                {isError && <div>{error.message}</div>}

                <Table columns={columns} dataSource={users} rowKey={'id'} />

                <Drawer
                    title="Create user"
                    width={720}
                    styles={{ body: { background: colorBgLayout } }}
                    open={isDraweropen}
                    destroyOnClose={true}
                    onClose={() => {
                        form.resetFields();
                        setDrawerOpen(false);
                    }}
                    extra={
                        <Space>
                            <Button
                                onClick={() => {
                                    form.resetFields();
                                    setDrawerOpen(false);
                                }}>
                                Cancel
                            </Button>
                            <Button type="primary" onClick={onHandleSubmit}>
                                Submit
                            </Button>
                        </Space>
                    }>
                    <Form layout="vertical" form={form}>
                        <UserForm />
                    </Form>
                </Drawer>
            </Space>
        </>
    );
};

export default Users;
