import { Card, Col, Form, Input, Row } from 'antd';

interface TenantFilterProps {
      children: React.ReactNode;
      //   onFilterChange: (filterName: string, filterValue: string) => void;
}

const TenantFilter = ({ children }: TenantFilterProps) => {
      return (
            <Card>
                  <Row justify="space-between">
                        <Col span={8}>
                              <Form.Item name="q">
                                    <Input.Search
                                          placeholder="Search Restaurent"
                                          allowClear={true}
                                          // onChange={(e) =>
                                          //     onFilterChange('searhFilter', e.target.value)
                                          // }
                                    />
                              </Form.Item>
                        </Col>
                        <Col
                              span={16}
                              style={{
                                    display: 'flex',
                                    justifyContent: 'end',
                              }}>
                              {children}
                        </Col>
                  </Row>
            </Card>
      );
};

export default TenantFilter;
