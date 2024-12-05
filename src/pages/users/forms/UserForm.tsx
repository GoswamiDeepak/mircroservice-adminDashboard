import { Card, Col, Form, Input, Row, Select, Space } from 'antd';
import { getTenants } from '../../../http/api';
import { useQuery } from '@tanstack/react-query';
import { Tenant } from '../../../types';

const UserForm = () => {
    const { data: tenants } = useQuery({
        queryKey: ['tenants'],
        queryFn: async () => {
            const res = await getTenants();
            return res.data;
        },
    });

    return (
        <Row>
            <Col span={24}>
                <Space direction="vertical" size="large">
                    <Card title="Basic Info" bordered={false}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item
                                    label="First Name"
                                    name="firstname"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'First Name is Required.',
                                        },
                                    ]}>
                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Last Name"
                                    name="lastname"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Last Name is Required.',
                                        },
                                    ]}>
                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Email is Required.',
                                        },
                                        {
                                            type: 'email',
                                            message: 'Email is not valid!',
                                        },
                                    ]}>
                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Card title="Security Info" bordered={false}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Password is Required.',
                                        },
                                    ]}>
                                    <Input size="large" type="password" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Card title="Role Info" bordered={false}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item
                                    label="Role"
                                    name="role"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Role is Required.',
                                        },
                                    ]}>
                                    <Select
                                        size="large"
                                        style={{ width: '100%' }}
                                        allowClear={true}
                                        onChange={() => {}}
                                        placeholder="Select Role">
                                        <Select.Option value="admin">
                                            Admin
                                        </Select.Option>
                                        <Select.Option value="manager">
                                            Manager
                                        </Select.Option>
                                        <Select.Option value="customer">
                                            Customer
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Tenant"
                                    name="tenantId"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Restaurent is Required.',
                                        },
                                    ]}>
                                    <Select
                                        size="large"
                                        style={{ width: '100%' }}
                                        allowClear={true}
                                        onChange={() => {}}
                                        placeholder="Select Restaurent">
                                        {tenants?.map((tenants: Tenant) => (
                                            <Select.Option value={tenants.id}>
                                                {tenants.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                </Space>
            </Col>
        </Row>
    );
};

export default UserForm;
