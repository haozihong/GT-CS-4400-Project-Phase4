import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Col, Row } from 'antd';
import {
  UserOutlined,
} from '@ant-design/icons';

const columns = [
  { title: 'Username', dataIndex: 'username' },
  { title: 'Tax ID', dataIndex: 'taxID' },
  { title: 'Salary ($)', dataIndex: 'salary' },
  { title: 'Hired Datw', dataIndex: 'hired' },
  { title: 'Experience (month)', dataIndex: 'employeeExperience' },
  { title: 'License ID', dataIndex: 'licenseID' },
  { title: 'Piloting Experience (trips)', dataIndex: 'pilotingExperience' },
  { title: 'Manager Status', dataIndex: 'managerStatus' },
];

export const Employees = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const fetchData = () => {
    setLoading(true);
    fetch(`/api/employees`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space style={{float: 'right'}}>
            <Button type="primary" icon={<UserOutlined />}>
              Add Employee
            </Button>
            <Button>
              Placeholder
            </Button>
          </Space>
        </Col>

        <Col span={24}>
          <Table
            columns={columns}
            rowKey={(record) => record.username}
            dataSource={data}
            loading={loading}
          />
        </Col>
      </Row>
    </>
  );
}

export default Employees