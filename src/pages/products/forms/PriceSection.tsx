import { Card, Col, Form, InputNumber, Row, Space, Typography } from 'antd';
import { Category } from '../../../types';

type PriceSectionProps = {
      selectCategory: string;
};
const PriceSection = ({ selectCategory }: PriceSectionProps) => {
      const category: Category | null = selectCategory ? JSON.parse(selectCategory) : null;

      if (!category) {
            return null;
      }

      return (
            <Card title={<Typography.Text>Product Price</Typography.Text>} bordered={false}>
                  {Object.entries(category?.priceConfiguration).map(([configrationKey, configrationValue]) => {
                        return (
                              <Space direction="vertical" size="large" style={{ width: '100%' }} key={configrationKey}>
                                    <Typography.Text>{`${configrationKey}  (${configrationValue?.priceType})`}</Typography.Text>

                                    <Row gutter={20}>
                                          {configrationValue?.availableOptions.map((option) => (
                                                <Col span={8} key={option}>
                                                      <Form.Item
                                                            label={option}
                                                            name={[
                                                                  'priceConfiguration',
                                                                  JSON.stringify({
                                                                        configrationKey: configrationKey,
                                                                        configrationValue: configrationValue,
                                                                  }),
                                                                  option,
                                                            ]}>
                                                            <InputNumber addonAfter="₹" min={0} />
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
