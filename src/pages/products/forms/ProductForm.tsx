import { Card, Col, Form, FormInstance, Input, Row, Select, Space, Switch, Typography } from 'antd';
import { Category, Tenant } from '../../../types';
import { useQuery } from '@tanstack/react-query';
import { getCategories, getTenants } from '../../../http/api';

import PriceSection from './PriceSection';
import AttributeSection from './AttributeSection';
import ProductImage from './ProductImage';
import { userAuthStore } from '../../../store';

const ProductForm = ({ form }: { form: FormInstance }) => {
      const { user } = userAuthStore();
      const selectedCategory = Form.useWatch('categoryId');

      const { data: categories } = useQuery({
            queryKey: ['categories'],
            queryFn: async () => {
                  const { data } = await getCategories();
                  return data;
            },
      });

      const { data: tenants } = useQuery({
            queryKey: ['restaurants'],
            queryFn: async () => {
                  const { data } = await getTenants(`perPage=100&currentPage=1`);
                  return data;
            },
      });

      return (
            <>
                  <Row>
                        <Col span={24}>
                              <Space direction="vertical" size="large">
                                    <Card title="Basic Info" bordered={false}>
                                          <Row gutter={20}>
                                                <Col span={12}>
                                                      <Form.Item
                                                            label="Product Name"
                                                            name="name"
                                                            rules={[
                                                                  {
                                                                        required: true,
                                                                        message: 'Product Name is Required.',
                                                                  },
                                                            ]}>
                                                            <Input size="large" />
                                                      </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                      <Form.Item
                                                            label="Category"
                                                            name="categoryId"
                                                            rules={[
                                                                  {
                                                                        required: true,
                                                                        message: 'Category is Required.',
                                                                  },
                                                            ]}>
                                                            <Select
                                                                  id="selectBoxInProductForm"
                                                                  size="large"
                                                                  style={{
                                                                        width: '100%',
                                                                  }}
                                                                  allowClear={true}
                                                                  onChange={() => {}}
                                                                  placeholder="Select Category">
                                                                  {categories?.map((categories: Category) => (
                                                                        <Select.Option
                                                                              // value={JSON.stringify(categories)}
                                                                              value={categories._id}
                                                                              key={categories._id}>
                                                                              {categories.name}
                                                                        </Select.Option>
                                                                  ))}
                                                            </Select>
                                                      </Form.Item>
                                                </Col>
                                                <Col span={24}>
                                                      <Form.Item
                                                            label="Description"
                                                            name="description"
                                                            rules={[
                                                                  {
                                                                        required: true,
                                                                        message: 'Description is Required.',
                                                                  },
                                                            ]}>
                                                            <Input.TextArea
                                                                  rows={2}
                                                                  maxLength={100}
                                                                  style={{ resize: 'none' }}
                                                                  size="large"
                                                            />
                                                      </Form.Item>
                                                </Col>
                                          </Row>
                                    </Card>
                                    <Card title="Product Image" bordered={false}>
                                          <ProductImage initialImage={form.getFieldValue('image')} />
                                    </Card>
                                    {user?.role === 'admin' && (
                                          <Card title="Restaurents" bordered={false}>
                                                <Col span={24}>
                                                      <Form.Item
                                                            label="Select Restaurents"
                                                            name="tenantId"
                                                            rules={[
                                                                  {
                                                                        required: true,
                                                                        message: 'Restaurents is Required.',
                                                                  },
                                                            ]}>
                                                            <Select
                                                                  id="selectBoxInProductForm"
                                                                  size="large"
                                                                  style={{
                                                                        width: '100%',
                                                                  }}
                                                                  allowClear={true}
                                                                  onChange={() => {}}
                                                                  placeholder="Select Restaurents">
                                                                  {tenants?.data?.map((tenants: Tenant) => (
                                                                        <Select.Option value={String(tenants.id)} key={tenants.id}>
                                                                              {tenants.name}
                                                                        </Select.Option>
                                                                  ))}
                                                            </Select>
                                                      </Form.Item>
                                                </Col>
                                          </Card>
                                    )}

                                    {selectedCategory && (
                                          <>
                                                <PriceSection selectCategory={selectedCategory} />
                                                <AttributeSection selectCategory={selectedCategory} />
                                          </>
                                    )}
                                    <Card title="Other info" bordered={false}>
                                          <Col span={24}>
                                                <Space
                                                      style={{
                                                            width: '100%',
                                                      }}>
                                                      <Form.Item name="isPublish">
                                                            <Switch
                                                                  defaultChecked={false}
                                                                  onChange={() => {}}
                                                                  checkedChildren="yes"
                                                                  unCheckedChildren="no"
                                                            />
                                                      </Form.Item>
                                                      <Typography.Text style={{ marginBottom: 20, display: 'block', fontSize: 12 }}>
                                                            publised
                                                      </Typography.Text>
                                                </Space>
                                          </Col>
                                    </Card>
                              </Space>
                        </Col>
                  </Row>
            </>
      );
};

export default ProductForm;
