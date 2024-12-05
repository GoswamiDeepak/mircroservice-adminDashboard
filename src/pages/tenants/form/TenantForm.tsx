import { Card, Form, Input } from 'antd';

const TenantForm = () => {
    return (
        <Card>
            <Form.Item
                label="Name"
                name="name"
                rules={[
                    {
                        required: true,
                        message: 'Name is required.',
                    },
                ]}>
                <Input size="large" />
            </Form.Item>
            <Form.Item
                label="Address"
                name="address"
                rules={[
                    {
                        required: true,
                        message: 'Address is required.',
                    },
                ]}>
                <Input size="large" />
            </Form.Item>
        </Card>
    );
};

export default TenantForm;
