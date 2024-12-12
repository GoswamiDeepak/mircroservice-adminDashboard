/**
 * Users Component
 *
 * This component is responsible for managing and displaying a list of users.
 * It includes functionalities such as filtering, pagination, creating, editing,
 * and deleting users. The component also utilizes react-query for data fetching and state management.
 *
 * Dependencies:
 * - `antd` for UI components.
 * - `@tanstack/react-query` for data fetching and caching.
 * - `lodash` for utility functions (e.g., debounce).
 * - `react-router-dom` for navigation.
 * - Custom utilities and components such as `UserFilter`, `UserForm`, `api`, and `userAuthStore`.
 */

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
import {
      keepPreviousData,
      useMutation,
      useQuery,
      useQueryClient,
} from '@tanstack/react-query';
import { createUser, editUser, getUsers } from '../../http/api';
import { CreateUserData, FieldData, User } from '../../types';
import { userAuthStore } from '../../store';
import UserFilter from './UserFilter';
import { useEffect, useMemo, useState } from 'react';
import UserForm from './forms/UserForm';
import { PER_PAGE } from '../../constant';
import { debounce } from 'lodash';

// Define table columns
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
      {
            title: 'Tenant',
            dataIndex: 'tenant',
            key: 'tenant',
            render: (_text: string, record: User) => {
                  return <div>{record.tenant?.name}</div>;
            },
      },
];

const Users = () => {
      const queryClient = useQueryClient();

      // State for editing user and query parameters
      const [currentEditingUser, setCurrentEditingUser] = useState<User | null>(
            null
      );
      const [queryParams, setQueryParams] = useState({
            perPage: PER_PAGE,
            currentPage: 1,
      });

      const [form] = Form.useForm();
      const [filterForm] = Form.useForm();
      const [isDraweropen, setDrawerOpen] = useState(false);

      // Effect to populate form fields when editing a user
      useEffect(() => {
            if (currentEditingUser) {
                  setDrawerOpen(true);
                  form.setFieldsValue({
                        ...currentEditingUser,
                        tenantId: currentEditingUser.tenant?.id,
                  });
            }
      }, [currentEditingUser, form]);

      const {
            token: { colorBgLayout },
      } = theme.useToken();

      // Fetch users with query parameters
      const {
            data: users,
            isFetching,
            isError,
            error,
      } = useQuery({
            queryKey: ['users', queryParams],
            queryFn: async () => {
                  const filteredParams = Object.fromEntries(
                        Object.entries(queryParams).filter((item) => !!item[1])
                  );
                  const queryString = new URLSearchParams(
                        filteredParams as unknown as Record<string, string>
                  ).toString();

                  const res = await getUsers(queryString);

                  return res.data;
            },
            placeholderData: keepPreviousData,
      });

      const { user } = userAuthStore();

      // Mutations for creating and updating users
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

      const { mutate: updateUserMutate } = useMutation({
            mutationKey: ['updateUser'],
            mutationFn: async (data: CreateUserData) =>
                  editUser(data, currentEditingUser!.id).then(
                        (res) => res.data
                  ),
            onSuccess: () => {
                  queryClient.invalidateQueries({
                        queryKey: ['users'],
                  });
                  return;
            },
      });

      const onHandleSubmit = async () => {
            await form.validateFields();
            const isEditMode = !!currentEditingUser;
            if (isEditMode) {
                  await updateUserMutate(form.getFieldsValue());
            } else {
                  await userMutate(form.getFieldsValue());
            }

            form.resetFields();
            setDrawerOpen(false);
            setCurrentEditingUser(null);
      };

      // Debounce for updating query parameters
      const debouncedQUpdate = useMemo(() => {
            return debounce((value: string | undefined) => {
                  setQueryParams((prev) => ({
                        ...prev,
                        q: value,
                        currentPage: 1,
                  }));
            }, 500);
      }, []);

      const onFilterChange = (changedFields: FieldData[]) => {
            const changedFilterFields = changedFields
                  .map((item) => ({
                        [item.name[0]]: item.value,
                  }))
                  .reduce((acc, item) => ({ ...acc, ...item }), {});

            if ('q' in changedFilterFields) {
                  debouncedQUpdate(changedFilterFields.q);
            } else {
                  setQueryParams((prev) => ({
                        ...prev,
                        ...changedFilterFields,
                        currentPage: 1,
                  }));
            }
      };

      // Redirect non-admin users
      if (user?.role !== 'admin') {
            return <Navigate to="/" replace={true} />;
      }

      return (
            <>
                  <Space
                        direction="vertical"
                        size={'large'}
                        style={{ width: '100%' }}>
                        {/* Header Section */}
                        <Flex justify="space-between">
                              <Breadcrumb
                                    separator={<RightOutlined />}
                                    items={[
                                          {
                                                title: (
                                                      <Link to="/">
                                                            Dashboard
                                                      </Link>
                                                ),
                                          },
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

                              {isError && (
                                    <Typography.Text type="danger">
                                          {error.message}
                                    </Typography.Text>
                              )}
                        </Flex>

                        {/* Filter Section */}
                        <Form form={filterForm} onFieldsChange={onFilterChange}>
                              <UserFilter>
                                    <Button
                                          type="primary"
                                          icon={<PlusOutlined />}
                                          onClick={() => setDrawerOpen(true)}>
                                          Add User
                                    </Button>
                              </UserFilter>
                        </Form>

                        {/* User Table */}
                        <Table
                              columns={[
                                    ...columns,
                                    {
                                          title: 'Actions',
                                          render: (_: string, record: User) => {
                                                return (
                                                      <Space>
                                                            <Button
                                                                  type="link"
                                                                  onClick={() => {
                                                                        setCurrentEditingUser(
                                                                              record
                                                                        );
                                                                  }}>
                                                                  Edit
                                                            </Button>
                                                            <Button type="link">
                                                                  Delete
                                                            </Button>
                                                      </Space>
                                                );
                                          },
                                    },
                              ]}
                              dataSource={users?.data}
                              rowKey={'id'}
                              pagination={{
                                    total: users?.total,
                                    pageSize: queryParams?.perPage,
                                    current: queryParams?.currentPage,
                                    onChange: (page) => {
                                          setQueryParams((prev) => {
                                                return {
                                                      ...prev,
                                                      currentPage: page,
                                                };
                                          });
                                    },
                                    showTotal: (
                                          total: number,
                                          range: number[]
                                    ) => {
                                          return `Showing ${range[0]} - ${range[1]} of ${total} items.`;
                                    },
                              }}
                        />

                        {/* Drawer for User Form */}
                        <Drawer
                              title={
                                    currentEditingUser
                                          ? 'Edit User'
                                          : 'Create User'
                              }
                              width={720}
                              styles={{ body: { background: colorBgLayout } }}
                              open={isDraweropen}
                              destroyOnClose={true}
                              onClose={() => {
                                    form.resetFields();
                                    setCurrentEditingUser(null);
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
                                          <Button
                                                type="primary"
                                                onClick={onHandleSubmit}>
                                                Submit
                                          </Button>
                                    </Space>
                              }>
                              <Form layout="vertical" form={form}>
                                    <UserForm
                                          queryParams={queryParams}
                                          isEditMode={!!currentEditingUser}
                                    />
                              </Form>
                        </Drawer>
                  </Space>
            </>
      );
};

export default Users;
