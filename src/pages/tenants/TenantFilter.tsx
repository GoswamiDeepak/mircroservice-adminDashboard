import { Card, Col, Input, Row } from 'antd';

interface TenantFilterProps {
    children: React.ReactNode;
    onFilterChange: (filterName: string, filterValue: string) => void;
}

const TenantFilter = ({ children, onFilterChange }: TenantFilterProps) => {
    return (
        <Card>
            <Row justify="space-between">
                <Col span={8}>
                    <Input.Search
                        placeholder="Search Restaurent"
                        allowClear={true}
                        onChange={(e) =>
                            onFilterChange('searhFilter', e.target.value)
                        }
                    />
                </Col>
                <Col
                    span={16}
                    style={{ display: 'flex', justifyContent: 'end' }}>
                    {children}
                </Col>
            </Row>
        </Card>
    );
};

export default TenantFilter;
