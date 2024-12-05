import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from 'antd';
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTenants } from '../../http/api';
import TenantFilter from './TenantFilter';
import { useState } from 'react';
import TenantForm from './form/TenantForm';

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
    const [form] = Form.useForm();

    const [isDraweropen, setDrawerOpen] = useState(false);

    const {
        token: { colorBgLayout },
    } = theme.useToken();

    const {
        data: tenants,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['tenant'],
        queryFn: async () => getTenants().then((res) => res.data),
    });

    const onHandlerSubmit = () => {
        console.log(form.getFieldsValue());
    };

    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[
                        { title: <Link to="/">Dashboard</Link> },
                        { title: 'Restaurant' },
                    ]}
                />

                {isLoading && <div>Loading...</div>}

                {isError && <div>{error.message}</div>}

                <TenantFilter
                    onFilterChange={(
                        filterName: string,
                        filterValue: string
                    ) => {
                        console.log(filterName, filterValue);
                    }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setDrawerOpen(true)}>
                        Add Restaurent
                    </Button>
                </TenantFilter>

                <Table columns={columns} dataSource={tenants} rowKey={'id'} />

                <Drawer
                    title="Create Restaurent"
                    width={720}
                    styles={{ body: { background: colorBgLayout } }}
                    open={isDraweropen}
                    destroyOnClose={true}
                    onClose={() => {
                        form.resetFields();
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
                            <Button type="primary" onClick={onHandlerSubmit}>
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
