import { Card, Col, Form, Radio, Row, Switch, Typography } from 'antd';
import { Attribute, Category } from '../../../types';

type PriceSectionProps = {
      selectCategory: string;
};
const AttributeSection = ({ selectCategory }: PriceSectionProps) => {
      const category: Category | null = selectCategory ? JSON.parse(selectCategory) : null;

      if (!category) {
            return null;
      }
      return (
            <Card title={<Typography.Text>Product Price</Typography.Text>} bordered={false}>
                  {category.attributes.map((attribute: Attribute) => {
                        return (
                              <div key={attribute.name}>
                                    {attribute.widgetType === 'switch' ? (
                                          <Row>
                                                <Col>
                                                      <Form.Item
                                                            label={attribute.name}
                                                            name={['attributes', attribute.name]}
                                                            valuePropName="checked"
                                                            initialValue={attribute.defaultValue}
                                                            rules={[{ required: true, message: `${attribute.name} is required` }]}>
                                                            <Switch checkedChildren="yes" unCheckedChildren="no" />
                                                      </Form.Item>
                                                </Col>
                                          </Row>
                                    ) : attribute.widgetType === 'radio' ? (
                                          <Form.Item
                                                label={attribute.name}
                                                name={['attributes', attribute.name]}
                                                initialValue={attribute.defaultValue}
                                                rules={[{ required: true, message: `${attribute.name} is required` }]}>
                                                <Radio.Group>
                                                      {attribute.availableOptions.map((option: string) => {
                                                            return (
                                                                  <Radio.Button value={option} key={option}>
                                                                        {option}
                                                                  </Radio.Button>
                                                            );
                                                      })}
                                                </Radio.Group>
                                          </Form.Item>
                                    ) : null}
                              </div>
                        );
                  })}
            </Card>
      );
};

export default AttributeSection;
