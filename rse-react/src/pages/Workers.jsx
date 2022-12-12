import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Col, Row, Select, notification, Tooltip } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns'
import { FormModal } from "../components/FormModal";

// columns of workerViewTable
const columns = [
  { title: 'Username', dataIndex: 'username' },
  { title: 'First Name', dataIndex: 'firstName' },
  { title: 'Last Name', dataIndex: 'lastName' },
  { title: 'Address', dataIndex: 'address' },
  { title: 'Birthdate', dataIndex: 'birthdate', render: e => format(e, 'yyyy-MM-dd'), },
];

export const Workers = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  // get data from DB for workerView table
  const fetchData = () => {
    setLoading(true);
    fetch(`/api/workers/view`)
      .then((res) => res.json())
      .then((res) => {
        res.forEach(e => { e.birthdate = new Date(e.birthdate); });
        setData(res);
        setLoading(false);
      });
  };

  const [employees, setEmployees] = useState([]);
  const fetchDataBg = (url, setFn) => {
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setFn(res);
      });
  };

  const fetchAllData = () => {
    fetchData();
    fetchDataBg('/api/employees', setEmployees);
  };
    
  useEffect(() => {
    fetchAllData();
  }, []);
  
  // Add Worker Popup and error handling
  const [addWorkerDialogOpen, setAddWorkerDialogOpen] = useState(false);
  const [notificationApi, contextHolder] = notification.useNotification();
  const popMessage = (message, description, type) => {
    notificationApi[type || 'open']({
      message,
      description,
    });
  };

  const addWorkerFormFields = [
    {
      name: 'username',
      label: 'Username',
      formItem: 
        <Select
          placeholder='Select an employee'
          options={employees.map(e => ({ label: e.username, value: e.username }))}
        />,
    },
  ];

  const addWorkerFormFinishArgs = {
    fetchConfig: values => ([
      `/api/workers`, 
      {
        method: 'POST',
        body: JSON.stringify(values),
        headers: { 'Content-type': 'application/json; charset=UTF-8', },
      }
    ]),
    succDecs: 'Worker role added successfully!',
    failMsg: 'Failed to add worker role',
  };

  // Render the Workers Page
  return (
    <>
      {contextHolder}
      <Row className='content' gutter={[16, 8]}>
        <Col span={24} style={{paddingTop: 16}}>
          <Space style={{float: 'right'}}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddWorkerDialogOpen(true)}>
              Add
            </Button>
            <Tooltip title="refresh">
              <Button type='text' shape='circle' icon={<ReloadOutlined />} onClick={() => fetchAllData()} />
            </Tooltip>
          </Space>
        </Col>

        <Col span={24}>
          <Table
            columns={columns}
            rowKey={(record) => record.username}
            dataSource={data}
            loading={loading}
            pagination={{ showSizeChanger: true }}
          />
        </Col>
      </Row>
      
      <FormModal
        dialogOpenState={[addWorkerDialogOpen, setAddWorkerDialogOpen]}
        formFields={addWorkerFormFields}
        formFinishArgs={addWorkerFormFinishArgs}
        refreshFn={fetchAllData}
        popMessage={popMessage}
        title='New Worker'
        okText='Add Worker'
      />
    </>
  );
}

export default Workers