import { Card, Col, Form, Input, Row } from 'antd';

const UserForm = () => {
    return (
        <Row>
            <Col span={24}>
                <Card title="Basic Info" bordered={false}>
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item label="First Name">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Last Name">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    );
};

export default UserForm;
