import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Col, Row, Input, DatePicker, InputNumber, notification, Tooltip } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns'
import { FormModal } from "../components/FormModal";

// columns of employeeView table
const columns = [
  { title: 'Username', dataIndex: 'username' },
  { title: 'Tax ID', dataIndex: 'taxID' },
  { title: 'Salary', dataIndex: 'salary', render: e => `$${e}`, },
  { title: 'Hired Date', dataIndex: 'hired', render: e => format(e, 'yyyy-MM-dd'), },
  { title: 'Experience (month)', dataIndex: 'employeeExperience', render: e => `${e} mo.`, },
  { title: 'License ID', dataIndex: 'licenseID' },
  { title: 'Piloting Experience (trips)', dataIndex: 'pilotingExperience' },
  { title: 'Manager Status', dataIndex: 'managerStatus' },
];

export const Employees = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  // get data from DB for pilotView table
  const fetchData = () => {
    setLoading(true);
    fetch(`/api/employees/view`)
      .then(res => res.json())
      .then(res => {
        res.forEach(e => { e.hired = new Date(e.hired); });
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

// Add employee Popups and error handling
  const [newEmpDialogOpen, setNewEmpDialogOpen] = useState(false);
  const [notificationApi, contextHolder] = notification.useNotification();
  const popMessage = (message, description, type) => {
    notificationApi[type || 'open']({
      message,
      description,
    });
  };

  const newEmpFormFields = [
    { name: "username", label: "Username", formItem: <Input />, },
    { name: "firstName", label: "First Name", formItem: <Input />, },
    { name: "lastName", label: "Last Name", formItem: <Input />, },
    { name: "address", label: "Address", formItem: <Input />, },
    { name: "birthdate", label: "Birthdate", formItem: <DatePicker />, },
    { 
      name: "taxID", 
      label: "Tax ID", 
      formItem: <Input />,
      rules: [
        { required: true, }, 
        { 
          pattern: /^\d{3}-\d{2}-\d{4}$/, 
          message: 'Tax ID should be in "xxx-xx-xxxx" format'
        }, 
      ],
    },
    { name: "hired", label: "Hired Date", formItem: <DatePicker />, },
    { 
      name: "employeeExperience", 
      label: "Experience (Month)", 
      formItem: <InputNumber />, 
      rules: [{ required: true, }, { type: 'number', min: 0 }],
    },
    { 
      name: "salary", 
      label: "Salary ($)", 
      formItem: <InputNumber />, 
      rules: [{ required: true, }, { type: 'number', min: 0 }],
    },
  ]; 
  
  const newEmpFormFinishArgs = {
    fetchConfig: values => ([
      `/api/employees`,
      {
        method: 'POST',
        body: JSON.stringify(values),
        headers: { 'Content-type': 'application/json; charset=UTF-8', },
      }
    ]),
    succDecs: 'Employee added seccessfully!',
    failMsg: 'Fail to add service',
  };
  
  // Render the Employees Page
  return (
    <>
      {contextHolder}
      <Row className='page-content' gutter={[16, 8]}>
        <Col span={24} style={{paddingTop: 16}}>
          <Space style={{float: 'right'}}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setNewEmpDialogOpen(true)}
            >
              Add
            </Button>
            <Tooltip title="refresh">
              <Button type='text' shape='circle' icon={<ReloadOutlined />} onClick={() => fetchData()} />
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
        dialogOpenState={[newEmpDialogOpen, setNewEmpDialogOpen]}
        formFields={newEmpFormFields}
        formFinishArgs={newEmpFormFinishArgs}
        refreshFn={fetchAllData}
        popMessage={popMessage}
        title='New Employee'
        okText='Add Employee'
      />
    </>
  );
}

export default Employees