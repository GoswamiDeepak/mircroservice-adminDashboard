import { useQuery } from '@tanstack/react-query';
import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from 'antd';
import { getCategories, getTenants } from '../../http/api';
import { Category, Tenant } from '../../types';
import { userAuthStore } from '../../store';

type ProductsFilterProps = {
      children?: React.ReactNode;
};
const ProductsFilter = ({ children }: ProductsFilterProps) => {
      const { user } = userAuthStore();

      const { data: restaurants } = useQuery({
            queryKey: ['restaurants'],
            queryFn: async () => {
                  const { data } = await getTenants(`perPage=100&currentPage=1`);
                  return data;
            },
      });

      const { data: categories } = useQuery({
            queryKey: ['categories'],
            queryFn: async () => {
                  const { data } = await getCategories();
                  return data;
            },
      });

      return (
            <>
                  <Card>
                        <Row justify="space-between">
                              <Col span={16}>
                                    <Row gutter={20}>
                                          <Col span={6}>
                                                <Form.Item name="q">
                                                      <Input.Search allowClear={true} placeholder="search" />
                                                </Form.Item>
                                          </Col>
                                          <Col span={6}>
                                                <Form.Item name="categoryId">
                                                      <Select
                                                            style={{
                                                                  width: '100%',
                                                            }}
                                                            allowClear={true}
                                                            placeholder="Select Categoires">
                                                            {categories?.map((category: Category) => (
                                                                  <Select.Option value={category._id} key={category._id}>
                                                                        {category.name}
                                                                  </Select.Option>
                                                            ))}
                                                      </Select>
                                                </Form.Item>
                                          </Col>
                                          {user?.role === 'admin' && (
                                                <Col span={6}>
                                                      <Form.Item name="tenantId">
                                                            <Select
                                                                  style={{
                                                                        width: '100%',
                                                                  }}
                                                                  allowClear={true}
                                                                  placeholder="Select Restaurent">
                                                                  {restaurants?.data.map((restaurant: Tenant) => {
                                                                        return (
                                                                              <Select.Option value={restaurant.id} key={restaurant.id}>
                                                                                    {restaurant.name}
                                                                              </Select.Option>
                                                                        );
                                                                  })}
                                                            </Select>
                                                      </Form.Item>
                                                </Col>
                                          )}

                                          <Col span={6}>
                                                <Space
                                                      style={{
                                                            width: '100%',
                                                      }}>
                                                      <Form.Item name="isPublish">
                                                            <Switch defaultChecked={false} onChange={() => {}} />
                                                      </Form.Item>
                                                      <Typography.Text style={{ marginBottom: 20, display: 'block', fontSize: 12 }}>
                                                            Show only publised
                                                      </Typography.Text>
                                                </Space>
                                          </Col>
                                    </Row>
                              </Col>
                              <Col
                                    span={8}
                                    style={{
                                          display: 'flex',
                                          justifyContent: 'end',
                                    }}>
                                    {children}
                              </Col>
                        </Row>
                  </Card>
            </>
      );
};

export default ProductsFilter;
