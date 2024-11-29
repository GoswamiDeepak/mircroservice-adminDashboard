import {
    Alert,
    Button,
    Card,
    Checkbox,
    Flex,
    Form,
    Input,
    Layout,
    Space,
} from 'antd';
import { LockFilled, LockOutlined, UserOutlined } from '@ant-design/icons';
import Logo from '../../components/icons/Logo';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Credentials } from '../../types';
import { login, self, logout } from '../../http/api';
import { userAuthStore } from '../../store';
import { userPermission } from '../../hooks/userPermission';

const loginUser = async (credentials: Credentials) => {
    // server call logic
    const { data } = await login(credentials);
    return data;
};
const getSelf = async () => {
    const { data } = await self();
    return data;
};



const LoginPage = () => {
    const { setUser, logout:logoutFromStore } = userAuthStore();

    const { isAllowed } = userPermission();

    const { refetch } = useQuery({
        queryKey: ['self'],
        queryFn: getSelf,
        enabled: false,
    });

    const {mutate:logoutMutate} = useMutation({
        mutationKey: ['logout'],
        mutationFn: logout,
        onSuccess: () => {
            logoutFromStore()
            //can redirect to customer in client UI
            return
        }
    })

    const { mutate, isPending, isError, error } = useMutation({
        mutationKey: ['login'], //not require for post
        mutationFn: loginUser,
        onSuccess: async () => {
            //getself endpoint hit
            const { data } = await refetch();
            if (!isAllowed(data)) {
                logoutMutate()
                return;
            }
            //store data in state
            setUser(data);
        },
    });

    return (
        <>
            <Layout
                style={{
                    height: '100vh',
                    display: 'grid',
                    placeItems: 'center',
                }}>
                <Space direction="vertical" align="center" size="large">
                    <Layout.Content
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Logo />
                    </Layout.Content>
                    <Card
                        bordered={false}
                        style={{ width: 300 }}
                        title={
                            <Space
                                style={{
                                    width: '100%',
                                    fontSize: 16,
                                    justifyContent: 'center',
                                }}>
                                <LockFilled />
                                Sign In
                            </Space>
                        }>
                        <Form
                            initialValues={{
                                remember: true,
                                username: 'deepakgoswami1@gmail.com',
                                password: 'secret',
                            }}
                            onFinish={(value) => {
                                mutate({
                                    email: value.username,
                                    password: value.password,
                                });
                                console.log(value);
                            }}>
                            {isError && (
                                <Alert
                                    style={{ marginBottom: 24 }}
                                    type="error"
                                    message={error.message}
                                />
                            )}

                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                    {
                                        type: 'email',
                                        message: 'Email is not valid!',
                                    },
                                ]}>
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Username"
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}>
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Password"
                                />
                            </Form.Item>
                            <Flex justify="space-between">
                                <Form.Item
                                    name="remember"
                                    valuePropName="checked">
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>
                                <a href="" id="login-form-forgot">
                                    Forget password
                                </a>
                            </Flex>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{ width: '100%' }}
                                    loading={isPending}>
                                    {' '}
                                    Log In
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Space>
            </Layout>
        </>
    );
};

export default LoginPage;
