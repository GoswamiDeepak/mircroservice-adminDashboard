import { Card, Col, Form, InputNumber, Row, Space, Typography } from 'antd';
import { Category } from '../../../types';
import { getCategory } from '../../../http/api';
import { useQuery } from '@tanstack/react-query';

type PriceSectionProps = {
      selectCategory: string;
};
const PriceSection = ({ selectCategory }: PriceSectionProps) => {
      // const category: Category | null = selectCategory ? JSON.parse(selectCategory) : null;

      const { data: category } = useQuery<Category>({
            queryKey: ['category', selectCategory],
            queryFn: async () => {
                  const { data } = await getCategory(selectCategory);
                  return data;
            },
            staleTime: 1000 * 60 * 5, // 5 minutes
      });

      if (!category) {
            return null;
      }

      return (
            <Card title={<Typography.Text>Product Price</Typography.Text>} bordered={false}>
                  {Object.entries(category?.priceConfiguration).map(([configurationKey, configurationValue]) => {
                        return (
                              <Space direction="vertical" size="large" style={{ width: '100%' }} key={configurationKey}>
                                    <Typography.Text>{`${configurationKey}  (${configurationValue?.priceType})`}</Typography.Text>

                                    <Row gutter={20}>
                                          {configurationValue?.availableOptions.map((option) => (
                                                <Col span={8} key={option}>
                                                      <Form.Item
                                                            label={option}
                                                            name={[
                                                                  'priceConfiguration',
                                                                  JSON.stringify({
                                                                        configurationKey: configurationKey,
                                                                        priceType: configurationValue.priceType,
                                                                        // configurationValue: configurationValue,
                                                                  }),
                                                                  option,
                                                            ]}>
                                                            <InputNumber addonAfter="₹" />
                                                      </Form.Item>
                                                </Col>
                                          ))}
                                    </Row>
                              </Space>
                        );
                  })}
            </Card>
      );
};

export default PriceSection;
