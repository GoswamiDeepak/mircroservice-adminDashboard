import {
    Card,
    Col,
    Row,
    Space,
    Statistic,
    Typography,
    List,
    Tag,
    Skeleton,
    Button,
} from 'antd';
import { userAuthStore } from '../store';
import { ComponentType } from 'react';
import Icon from '@ant-design/icons';
import BarChartIcon from '../components/icons/BarChartIcon';
import Order from '../components/icons/Order';
import { Link } from 'react-router-dom';
const { Title, Text } = Typography;

const list = [
    {
        orderSummary: 'Peperoni,Margarita...',
        addresss: 'Bandra, Mumbai',
        amount: 1200,
        status: 'Preparing',
        loading: false,
    },
    {
        orderSummary: 'Peperoni,Margarita...',
        addresss: 'Bandra, Mumbai',
        amount: 1200,
        status: 'Preparing',
        loading: false,
    },
    {
        orderSummary: 'Peperoni,Margarita...',
        addresss: 'Bandra, Mumbai',
        amount: 1200,
        status: 'Preparing',
        loading: false,
    },
];
interface CardTitleProps {
    title: string;
    PrefixIcon: ComponentType<unknown>;
}

const CartTitle = ({ title, PrefixIcon }: CardTitleProps) => {
    return (
        <Space>
            <Icon component={PrefixIcon} />
            {title}
        </Space>
    );
};

function Home() {
    const { user } = userAuthStore();
    return (
        <>
            <Title level={4}>Welcome {user?.firstname}😊</Title>
            <Row className="mt-4" gutter={16}>
                <Col span={12}>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Card bordered={false}>
                                <Statistic
                                    title={
                                        <CartTitle
                                            title="Total Orders"
                                            PrefixIcon={Order}
                                        />
                                    }
                                    value={52}
                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card bordered={false}>
                                <Statistic
                                    title={
                                        <CartTitle
                                            title="Total Sales"
                                            PrefixIcon={BarChartIcon}
                                        />
                                    }
                                    value={1000}
                                    precision={2}
                                    prefix="$"
                                />
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Card
                                bordered={false}
                                title={
                                    <CartTitle
                                        title="Sales"
                                        PrefixIcon={BarChartIcon}
                                    />
                                }></Card>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <Card
                        bordered={false}
                        title={
                            <CartTitle
                                title="Recent Orders"
                                PrefixIcon={Order}
                            />
                        }>
                        <List
                            className="demo-loadmore-list"
                            loading={false}
                            itemLayout="horizontal"
                            loadMore={true}
                            dataSource={list}
                            renderItem={(item) => {
                                return (
                                    <List.Item>
                                        <Skeleton
                                            avatar
                                            title={false}
                                            active
                                            loading={item.loading}>
                                            <List.Item.Meta
                                                title={
                                                    <a>{item.orderSummary}</a>
                                                }
                                                description={item.addresss}
                                            />
                                            <Row
                                                style={{ flex: 1 }}
                                                justify="space-between">
                                                <Col>
                                                    <Text strong>
                                                        ${item.amount}
                                                    </Text>
                                                </Col>
                                                <Col>
                                                    <Tag color="volcano">
                                                        {item.status}
                                                    </Tag>
                                                </Col>
                                            </Row>
                                        </Skeleton>
                                    </List.Item>
                                );
                            }}
                        />
                        <div style={{ marginTop: 20 }}>
                            <Button type="link">
                                <Link to="/orders">See all orders</Link>
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default Home;
