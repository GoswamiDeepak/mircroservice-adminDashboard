import { Card, Col, Form, Input, Row } from 'antd';

const OrdersFilter = ({ children }: { children: React.ReactNode }) => {
    return (
        <Card>
            <Row justify="space-between">
                <Col span={8}>
                    <Form.Item name="q">
                        <Input.Search placeholder="Search Restaurent" allowClear={true} />
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

export default OrdersFilter;
