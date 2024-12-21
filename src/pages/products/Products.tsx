import { Breadcrumb, Button, Drawer, Flex, Form, Image, Space, Spin, Table, Tag, theme, Typography } from 'antd';
import { LoadingOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ProductsFilter from './ProductsFilter';
import { useEffect, useMemo, useState } from 'react';
import { PER_PAGE } from '../../constant';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProducts, postProduct, putProduct } from '../../http/api';
import { FieldData, Product } from '../../types';
import { format } from 'date-fns';
import { debounce } from 'lodash';
import { userAuthStore } from '../../store';
import ProductForm from './forms/ProductForm';
import { makeFormData } from './helper';

const columns = [
      // {
      //       title: 'ID',
      //       dataIndex: '_id',
      //       key: '_id',
      // },
      {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_text: string, record: Product) => (
                  <Space>
                        <Image width={50} src={record.image} alt={record.name} preview={false} />
                        <Typography.Text>{record.name}</Typography.Text>
                  </Space>
            ),
      },
      {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
      },
      {
            title: 'Status',
            dataIndex: 'isPublish',
            key: 'isPublish',
            render: (_: boolean, record: Product) => {
                  return <>{record?.isPublish ? <Tag color="green">Published</Tag> : <Tag color="red">Draft</Tag>}</>;
            },
      },
      {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => <Typography.Text>{format(new Date(text), 'dd/MM/yyyy HH:mm')}</Typography.Text>,
      },
];

const Products = () => {
      const { user } = userAuthStore();
      const queryClient = useQueryClient();

      const [filterForm] = Form.useForm();
      const [form] = Form.useForm();

      const {
            token: { colorBgLayout },
      } = theme.useToken();

      const [queryParams, setQueryParams] = useState({
            limit: PER_PAGE,
            // limit: 1,
            page: 1,
            tenantId: user!.role !== 'admin' ? user?.tenant?.id : undefined,
      });

      const [isDraweropen, setDrawerOpen] = useState(false);

      // State for editing user and query parameters
      const [currentEditingProduct, setCurrentEditingProduct] = useState<Product | null>(null);

      useEffect(() => {
            if (currentEditingProduct) {
                  setDrawerOpen(true);
                  const priceConfiguration = Object.entries(currentEditingProduct.priceConfiguration).reduce((acc, [key, value]) => {
                        const strigifiedKey = JSON.stringify({
                              // configurationKey: key,
                              configurationKey: key,
                              priceType: value.priceType,
                        });
                        return {
                              ...acc,
                              [strigifiedKey]: value.availableOptions,
                              [strigifiedKey]: value.availableOptions,
                        };
                  }, {});

                  const attributes = currentEditingProduct.attributes.reduce((acc, item) => {
                        return {
                              ...acc,
                              [item.name]: item.value,
                        };
                  }, {});

                  form.setFieldsValue({
                        ...currentEditingProduct,
                        priceConfiguration: priceConfiguration,
                        attributes,
                        //modify it categoryId--------
                        // categoryId: JSON.stringify(currentEditingProduct.category),
                        // categoryId: currentEditingProduct.category?._id,
                        categoryId: typeof currentEditingProduct.category === 'object' ? currentEditingProduct.category._id : currentEditingProduct.category,
                  });
            }
      }, [currentEditingProduct, form]);

      //fetch product data
      const {
            data: product,
            isFetching,
            isError,
            error,
      } = useQuery({
            queryKey: ['products', queryParams],
            queryFn: async () => {
                  const filteredParams = Object.fromEntries(Object.entries(queryParams).filter((item) => !!item[1]));
                  const queryString = new URLSearchParams(filteredParams as unknown as Record<string, string>).toString();
                  const res = await getProducts(queryString);
                  return res.data;
            },
      });

      // Debounce for updating query parameters
      const debouncedQUpdate = useMemo(() => {
            return debounce((value: string | undefined) => {
                  setQueryParams((prev) => ({
                        ...prev,
                        q: value,
                        page: 1,
                  }));
            }, 500);
      }, []);

      const handleFilteration = (changedFields: FieldData[]) => {
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
                        page: 1,
                  }));
            }
      };

      //create product query
      const { mutate: createProductMutate, isPending } = useMutation({
            mutationKey: ['createProduct'],
            mutationFn: async (formData: FormData) => {
                  // const formData = makeFormData(data);
                  if(currentEditingProduct){
                        return await putProduct(formData, String(currentEditingProduct._id));
                  }else {
                        return await postProduct(formData);
                  }
            },
            onSuccess: () => {
                  queryClient.invalidateQueries({
                        queryKey: ['products'],
                  });
                  form.resetFields();
                  setDrawerOpen(false);
                  return;
            },
      });

      const onHandleSubmit = async () => {
            await form.validateFields();
            const priceConfiguration = form.getFieldValue('priceConfiguration');
            const pricing = Object.entries(priceConfiguration).reduce((acc, [key, value]) => {
                  const parsedKey = JSON.parse(key);
                  return {
                        ...acc,
                        [parsedKey.configurationKey]: {
                              priceType: parsedKey.priceType,
                              availableOptions: value,
                        },
                  };
            }, {});

            // const categoryId = JSON.parse(form.getFieldValue('categoryId'))._id;
            const categoryId = form.getFieldValue('categoryId');

            const attributes = Object.entries(form.getFieldValue('attributes')).map(([key, value]) => {
                  return {
                        name: key,
                        value: value,
                  };
            });

            const postData = {
                  ...form.getFieldsValue(),
                  tenantId: user?.role === 'admin' ? form.getFieldValue('tenantId') : user?.tenant?.id,
                  isPublish: form.getFieldValue('isPublish') ? true : false,
                  image: form.getFieldValue('image'),
                  categoryId,
                  priceConfiguration: pricing,
                  attributes,
            };

            const formData = makeFormData(postData);

            await createProductMutate(formData);
      };

      return (
            <>
                  <Space direction="vertical" size={'large'} style={{ width: '100%' }}>
                        <Flex justify="space-between">
                              <Breadcrumb
                                    separator={<RightOutlined />}
                                    items={[
                                          {
                                                title: <Link to="/">Dashboard</Link>,
                                          },
                                          { title: 'Products' },
                                    ]}
                              />
                              {isFetching && <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />}

                              {isError && <Typography.Text type="danger">{error.message}</Typography.Text>}
                        </Flex>
                        <Form form={filterForm} onFieldsChange={handleFilteration}>
                              <ProductsFilter>
                                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)}>
                                          Add Product
                                    </Button>
                              </ProductsFilter>
                        </Form>

                        <Table
                              columns={[
                                    ...columns,
                                    {
                                          title: 'Actions',
                                          // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
                                          render: (_: string, record: Product) => {
                                                return (
                                                      <Space>
                                                            <Button
                                                                  type="link"
                                                                  onClick={() => {
                                                                        setCurrentEditingProduct(record);
                                                                  }}>
                                                                  Edit
                                                            </Button>
                                                            {/* <Button type="link">Delete</Button> */}
                                                      </Space>
                                                );
                                          },
                                    },
                              ]}
                              dataSource={product?.data}
                              pagination={{
                                    total: product?.total,
                                    pageSize: queryParams?.limit,
                                    current: queryParams?.page,
                                    onChange: (page) => {
                                          setQueryParams((prev) => {
                                                return {
                                                      ...prev,
                                                      page: page,
                                                };
                                          });
                                    },
                                    showTotal: (total: number, range: number[]) => {
                                          return `showing ${range[0]} - ${range[1]} of ${total} items`;
                                    },
                              }}
                        />

                        <Drawer
                              title={currentEditingProduct ? 'Edit Product':'Create Product'}
                              width={720}
                              open={isDraweropen}
                              styles={{ body: { background: colorBgLayout } }}
                              onClose={() => {
                                    setCurrentEditingProduct(null);
                                    setDrawerOpen(false);
                              }}
                              extra={
                                    <Space>
                                          <Button
                                                onClick={() => {
                                                      form.resetFields();
                                                      setDrawerOpen(false);
                                                      setCurrentEditingProduct(null);
                                                }}>
                                                Cancel
                                          </Button>
                                          <Button type="primary" onClick={onHandleSubmit} loading={isPending}>
                                                Submit
                                          </Button>
                                    </Space>
                              }>
                              <Form layout="vertical" form={form}>
                                    <ProductForm form={form} />
                              </Form>
                        </Drawer>
                  </Space>
            </>
      );
};

export default Products;
