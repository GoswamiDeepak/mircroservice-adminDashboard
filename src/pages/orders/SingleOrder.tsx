import { Avatar, Breadcrumb, Card, Col, Flex, List, Row, Select, Space, Tag, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { colorMapping } from '../../constant';
import { capitalizeFirst } from '../../utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { changeOrderStatus, getSingleOrder } from '../../http/api';
import { Order, OrderStatus } from '../../types';
import { format } from 'date-fns';

const orderStatusOptions = [
    { value: 'received', label: 'Received' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'prepared', label: 'Prepared' },
    { value: 'out_for_delivery', label: 'Out for delivery' },
    { value: 'delivered', label: 'Delivered' },
];

const SingleOrder = () => {
    const { orderId } = useParams();
    const queryClient = useQueryClient();
    const { data: order } = useQuery<Order>({
        queryKey: ['order', orderId],
        queryFn: async () => {
            const queryString = new URLSearchParams({
                //TODO: trim whitespaces
                fields: 'cart,address,paymentMode,tenantId,total,comment,orderStatus,paymentStatus,createdAt',
            }).toString();

            return await getSingleOrder(orderId as string, queryString).then((res) => res.data);
        },
    });

    const { mutate: updateOrderStatus } = useMutation({
        mutationKey: ['orderStatus', orderId],
        mutationFn: async (orderStatus: OrderStatus) => {
            //TODO: orderstatus must not go to backend status
            await changeOrderStatus(orderId as string, orderStatus as string);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['order', orderId] });
        },
    });

    const statusChangeHandler = (value: OrderStatus) => {
        updateOrderStatus(value);
    };

    if (!order) {
        return null;
    }

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Flex justify="space-between" align="center">
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[
                        { title: <Link to="/">Dashboard</Link> },
                        { title: <Link to="/orders">Orders</Link> },
                        { title: `Order #${orderId}` },
                    ]}
                />
                <Space>
                    <Typography.Text>Chage Order Status:</Typography.Text>
                    <Select
                        defaultValue={order?.orderStatus}
                        style={{ width: 150 }}
                        onChange={statusChangeHandler}
                        options={orderStatusOptions}
                    />
                </Space>
            </Flex>

            <Row gutter={24}>
                <Col span={14}>
                    <Card
                        title="Order Details"
                        extra={
                            <Tag bordered={false} color={colorMapping[order?.orderStatus] ?? 'processing'}>
                                {capitalizeFirst(order?.orderStatus)}
                            </Tag>
                        }>
                        <List
                            itemLayout="horizontal"
                            dataSource={order.cart}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={`${item?.image}`} />}
                                        title={item?.name}
                                        description={item.chosenConfiguration.selectedToppings[0]
                                            // @ts-expect-error: chosenConfiguration must not have array of array
                                            .map((topping) => topping.name)
                                            .join(', ')}
                                    />
                                    <Space size={'large'}>
                                        <Typography.Text>
                                            {Object.values(item.chosenConfiguration.priceConfiguration).join(', ')}
                                        </Typography.Text>
                                        <Typography.Text strong>
                                            {item.qty} Item{item.qty > 1 ? 's' : ''}
                                        </Typography.Text>
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={10}>
                    <Card title="Customer Details">
                        <Space direction="vertical">
                            <Flex style={{ flexDirection: 'column' }}>
                                <Typography.Text type="secondary">Name</Typography.Text>
                                <Typography.Text strong>{order.customerId.firstname + ' ' + order.customerId.lastname}</Typography.Text>
                            </Flex>
                            <Flex style={{ flexDirection: 'column' }}>
                                <Typography.Text type="secondary">Address</Typography.Text>
                                <Typography.Text strong>{order.address}</Typography.Text>
                            </Flex>
                            <Flex style={{ flexDirection: 'column' }}>
                                <Typography.Text type="secondary">Payment Method</Typography.Text>
                                <Typography.Text strong>{order.paymentMode.toUpperCase()}</Typography.Text>
                            </Flex>
                            <Flex style={{ flexDirection: 'column' }}>
                                <Typography.Text type="secondary">Payment Status</Typography.Text>
                                <Typography.Text strong>{capitalizeFirst(order.paymentStatus)}</Typography.Text>
                            </Flex>
                            <Flex style={{ flexDirection: 'column' }}>
                                <Typography.Text type="secondary">Order Amount</Typography.Text>
                                <Typography.Text strong>&#8377;{order.total}</Typography.Text>
                            </Flex>
                            {!!order.comment && (
                                <Flex style={{ flexDirection: 'column' }}>
                                    <Typography.Text type="secondary">Comment</Typography.Text>
                                    <Typography.Text strong>{order.comment}</Typography.Text>
                                </Flex>
                            )}
                            <Flex style={{ flexDirection: 'column' }}>
                                <Typography.Text type="secondary">Order Time</Typography.Text>
                                <Typography.Text strong>{format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}</Typography.Text>
                            </Flex>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </Space>
    );
};

export default SingleOrder;
