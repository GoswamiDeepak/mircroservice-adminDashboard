import { useQuery } from '@tanstack/react-query';
import { Card, Col, Form, Input, Row, Select, Switch, Typography } from 'antd';
import { getCategories, getTenants } from '../../http/api';
import { Category, Tenant } from '../../types';

type ProductsFilterProps = {
      children?: React.ReactNode;
};
const ProductsFilter = ({ children }: ProductsFilterProps) => {

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
                                                <Form.Item name="category">
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
                                          <Col span={6}>
                                                <Form.Item name="restaurant">
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
                                                            {/* <Select.Option value="ban">
                                                            Ban
                                                      </Select.Option> */}
                                                      </Select>
                                                </Form.Item>
                                          </Col>
                                          <Col span={6}>
                                                <Switch defaultChecked onChange={() => {}} />
                                                <Typography.Text style={{marginLeft: 2}}>Show only publised</Typography.Text>
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
