import {
    Breadcrumb,
    Button,
    Drawer,
    Flex,
    Form,
    Space,
    Spin,
    Table,
    theme,
    Typography,
} from 'antd';
import {
    LoadingOutlined,
    PlusOutlined,
    RightOutlined,
} from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, getUsers } from '../../http/api';
import { CreateUserData, User } from '../../types';
import { userAuthStore } from '../../store';
import UserFilter from './UserFilter';
import { useState } from 'react';
import UserForm from './forms/UserForm';
import { PER_PAGE } from '../../constant';

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

    const [queryParams, setQueryParams] = useState({
        perPage: PER_PAGE,
        currentPage: 1,
    });

    const [form] = Form.useForm();

    const [isDraweropen, setDrawerOpen] = useState(false);

    const {
        token: { colorBgLayout },
    } = theme.useToken();

    const {
        data: users,
        isFetching,
        isError,
        error,
    } = useQuery({
        queryKey: ['users', queryParams],
        queryFn: async () => {
            const queryString = new URLSearchParams(
                queryParams as unknown as Record<string, string>
            ).toString();
            const res = await getUsers(queryString);
            return res.data;
        },
        placeholderData: keepPreviousData
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
                <Flex justify='space-between'>
                    <Breadcrumb
                        separator={<RightOutlined />}
                        items={[
                            { title: <Link to="/">Dashboard</Link> },
                            { title: 'Users' },
                        ]}
                    />
                    {isFetching && (
                        <Spin
                            indicator={
                                <LoadingOutlined
                                    style={{ fontSize: 24 }}
                                    spin
                                />
                            }
                        />
                    )}

                    {isError && <Typography.Text type='danger'>{error.message}</Typography.Text>}
                </Flex>

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

                <Table
                    columns={columns}
                    dataSource={users?.data}
                    rowKey={'id'}
                    pagination={{
                        total: users?.total,
                        pageSize: queryParams?.perPage,
                        current: queryParams?.currentPage,
                        onChange: (page) => {
                            setQueryParams((prev) => {
                                return { ...prev, currentPage: page };
                            });
                        },
                    }}
                />

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
