import { Breadcrumb, Button, Form, Space, Table, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import OrdersFilter from './OrdersFilter';
import { FieldData, Order } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '../../http/api';
import { format } from 'date-fns';
import { colorMapping } from '../../constant';
import { capitalizeFirst } from '../../utils';

const columns = [
    {
        title: 'Order Id',
        dataIndex: '_id',
        key: '_id',
        render: (_text: string, record: Order) => {
            return <Typography.Text>{record._id}</Typography.Text>;
        },
    },
    {
        title: 'Customer',
        dataIndex: 'customerId',
        key: 'customerId._id',
        render: (_text: string, record: Order) => {
            return <Typography.Text>{record.customerId.firstname + ' ' + record.customerId.lastname}</Typography.Text>;
        },
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        render: (_text: string, record: Order) => {
            return <Typography.Text>{record.address}</Typography.Text>;
        },
    },
    {
        title: 'Comment',
        dataIndex: 'comment',
        key: 'comment',
        render: (_text: string, record: Order) => {
            return <Typography.Text>{record.comment}</Typography.Text>;
        },
    },
    {
        title: 'Payment Mode',
        dataIndex: 'paymentMode',
        key: 'paymentMode',
        render: (_text: string, record: Order) => {
            return <Typography.Text>{record.paymentMode}</Typography.Text>;
        },
    },
    {
        title: 'Status',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        render: (_text: string, record: Order) => {
            return (
                <Tag color={colorMapping[record.orderStatus]} bordered={false}>
                    {capitalizeFirst(record.orderStatus)}
                </Tag>
            );
        },
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        render: (text: string) => {
            return <Typography.Text>&#8377;{text}</Typography.Text>;
        },
    },
    {
        title: 'CreatedAt',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => {
            return <Typography.Text>{format(new Date(text), 'dd/MM/yyyy HH:mm')}</Typography.Text>;
        },
    },
    {
        title: 'Actions',
        render: (_text: string, record: Order) => {
            return <Link to={`/orders/${record._id}`}>Details</Link>;
        },
    },
];

const TENANT_ID = 9;

const OrdersPage = () => {
    const [orderForm] = Form.useForm();

    const { data: orderData } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            //TODO: if admin user then make sure to send tenantId, or tenantId form selected filter
            const queryString = new URLSearchParams({ tenantId: String(TENANT_ID) }).toString();
            return await getOrders(queryString).then((res) => res.data);
        },
    });

    const filterChangeHandler = (changedFields: FieldData[]) => {
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const changedFilterFields = changedFields.map((item) => ({ [item.name[0]]: item.value }));
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Breadcrumb separator={<RightOutlined />} items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Orders' }]} />
            <Form form={orderForm} onFieldsChange={filterChangeHandler}>
                <OrdersFilter>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => {}}>
                        Search order
                    </Button>
                </OrdersFilter>
            </Form>
            <Table columns={columns} dataSource={orderData} rowKey={'_id'} />
        </Space>
    );
};

export default OrdersPage;
