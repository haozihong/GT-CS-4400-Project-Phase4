import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Col, Row, Tooltip } from 'antd';
import { ReloadOutlined, } from '@ant-design/icons';

// columns of workForViewTable
const columns = [
  { 
    title: 'Employee', 
    dataIndex: 'username', 
    sorter: (a, b) => a.username < b.username, 
    sortDirections: ['descend'], 
    defaultSortOrder: 'descend',
  },
  { title: 'Roles', dataIndex: 'roles' },
  { 
    title: 'Service', 
    dataIndex: 'serviceFullName',
    sorter: (a, b) => a.id < b.id, 
    sortDirections: ['descend'], 
  },
  { title: 'First Name', dataIndex: 'first_name' },
  { title: 'Last Name', dataIndex: 'last_name' },
];

export const WorkFor = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const fetchData = () => {
    setLoading(true);
    fetch(`/api/work_for/view`)
      .then((res) => res.json())
      .then((res) => {
        res.forEach(e => { 
          e.roles = `${e.is_worker ? 'Worker ':''}${e.is_pilot ? 'Pilot':''}`
          e.serviceFullName = `${e.long_name} (${e.id})`;
          e.birthdate = new Date(e.birthdate); 
        });
        setData(res);
        setLoading(false);
      });
  };

  const fetchAllData = () => {
    fetchData();
  };
    
  useEffect(() => {
    fetchAllData();
  }, []);
  
  return (
    <>
      <Row className='content' gutter={[16, 8]}>
        <Col span={24} style={{paddingTop: 16}}>
          <Space style={{float: 'right'}}>
            <Tooltip title="refresh">
              <Button type='text' shape='circle' icon={<ReloadOutlined />} onClick={() => fetchAllData()} />
            </Tooltip>
          </Space>
        </Col>

        <Col span={24}>
          <Table
            columns={columns}
            rowKey={(record) => `${record.username}$${record.id}`}
            dataSource={data}
            loading={loading}
            pagination={{ showSizeChanger: true }}
          />
        </Col>
      </Row>
    </>
  );
}

export default WorkFor