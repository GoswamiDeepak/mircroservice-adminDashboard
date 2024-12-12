import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from 'antd';
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import {
      keepPreviousData,
      useMutation,
      useQuery,
      useQueryClient,
} from '@tanstack/react-query';
import { createTenant, editTenant, getTenants } from '../../http/api';
import TenantFilter from './TenantFilter';
import { useEffect, useMemo, useState } from 'react';
import TenantForm from './form/TenantForm';
import { FieldData, Tenant } from '../../types';
import { PER_PAGE } from '../../constant';
import { debounce } from 'lodash';

const columns = [
      {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
      },
      {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
      },
      {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
      },
];

const Tenants = () => {
      const queryClient = useQueryClient();

      const {
            token: { colorBgLayout },
      } = theme.useToken();

      const [form] = Form.useForm();

      const [filterForm] = Form.useForm();

      const [isDraweropen, setDrawerOpen] = useState(false);

      // State for editing user and query parameters
      const [currentEditingTenant, setCurrentEditingTenant] =
            useState<Tenant | null>(null);

      // Effect to populate form fields when editing a user
      useEffect(() => {
            if (currentEditingTenant) {
                  setDrawerOpen(true);
                  form.setFieldsValue({
                        ...currentEditingTenant,
                  });
            }
      }, [currentEditingTenant, form]);

      const [queryParams, setQueryParams] = useState({
            perPage: PER_PAGE,
            currentPage: 1,
      });

      //Fetching all tenants with query parameters
      const {
            data: tenants,
            isLoading,
            isError,
            error,
      } = useQuery({
            queryKey: ['tenants', queryParams],
            queryFn: async () => {
                  const filteredParams = Object.fromEntries(
                        Object.entries(queryParams).filter((item) => !!item[1])
                  );
                  const queryString = new URLSearchParams(
                        filteredParams as unknown as Record<string, string>
                  ).toString();
                  const { data } = await getTenants(queryString);
                  return data;
            },
            placeholderData: keepPreviousData,
      });

      const { mutate: createTenantMutate } = useMutation({
            mutationKey: ['createTenant'],
            mutationFn: async (data: Tenant) =>
                  createTenant(data).then((res) => res.data),
            onSuccess: () => {
                  queryClient.invalidateQueries({
                        queryKey: ['tenant'],
                  });
                  return;
            },
      });

      const { mutate: updateTenantMutate } = useMutation({
            mutationKey: ['updateTenant'],
            mutationFn: async (data: Tenant) =>
                  await editTenant(data, currentEditingTenant!.id),
            onSuccess: () => {
                  queryClient.invalidateQueries({
                        queryKey: ['tenants'],
                  });
                  return;
            },
      });

      const onHandlerSubmit = async () => {
            await form.validateFields();
            const isEditMode = !!currentEditingTenant;
            if (isEditMode) {
                  await updateTenantMutate(form.getFieldsValue());
            } else {
                  createTenantMutate(form.getFieldsValue());
            }
            form.resetFields();
            setDrawerOpen(false);
            setCurrentEditingTenant(null);
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

      return (
            <>
                  <Space
                        direction="vertical"
                        style={{ width: '100%' }}
                        size="large">
                        <Breadcrumb
                              separator={<RightOutlined />}
                              items={[
                                    { title: <Link to="/">Dashboard</Link> },
                                    { title: 'Restaurant' },
                              ]}
                        />

                        {isLoading && <div>Loading...</div>}

                        {isError && <div>{error.message}</div>}

                        <Form form={filterForm} onFieldsChange={onFilterChange}>
                              <TenantFilter
                              //   onFilterChange={(
                              //         filterName: string,
                              //         filterValue: string
                              //   ) => {
                              //         console.log(filterName, filterValue);
                              //   }}
                              >
                                    <Button
                                          type="primary"
                                          icon={<PlusOutlined />}
                                          onClick={() => setDrawerOpen(true)}>
                                          Add Restaurent
                                    </Button>
                              </TenantFilter>
                        </Form>
                        <Table
                              columns={[
                                    ...columns,
                                    {
                                          title: 'Actions',
                                          render: (
                                                _: string,
                                                record: Tenant
                                          ) => {
                                                return (
                                                      <Space>
                                                            <Button
                                                                  type="link"
                                                                  onClick={() => {
                                                                        setCurrentEditingTenant(
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
                              dataSource={tenants?.data}
                              rowKey={'id'}
                              pagination={{
                                    total: tenants?.totalCount,
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
                                          return `Showing ${range[0]} - ${range[1]} of ${total} items`;
                                    },
                              }}
                        />

                        <Drawer
                              title={
                                    currentEditingTenant
                                          ? 'Edit Restaurent'
                                          : 'Create Restaurent'
                              }
                              width={720}
                              styles={{ body: { background: colorBgLayout } }}
                              open={isDraweropen}
                              destroyOnClose={true}
                              onClose={() => {
                                    form.resetFields();
                                    setCurrentEditingTenant(null);
                                    setDrawerOpen(false);
                              }}
                              extra={
                                    <Space>
                                          <Button
                                                onClick={() => {
                                                      form.resetFields();
                                                      setDrawerOpen(false);
                                                }}>
                                                Close
                                          </Button>
                                          <Button
                                                type="primary"
                                                onClick={onHandlerSubmit}>
                                                Submit
                                          </Button>
                                    </Space>
                              }>
                              <Form layout="vertical" form={form}>
                                    <TenantForm />
                              </Form>
                        </Drawer>
                  </Space>
            </>
      );
};

export default Tenants;
