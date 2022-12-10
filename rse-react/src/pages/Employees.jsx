import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Col, Row, Modal, Form, Input, DatePicker, InputNumber, notification, Tooltip } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns'

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

// fields in the addEmployee pop-up
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
    rules: [{ required: true, }, { type: 'number', min: 0 }], },
];

// get data from DB for pilotView table
export const Employees = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
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
  useEffect(() => {
    fetchData();
  }, []);

// Add employee Popups and error handling
  const [newEmpDialogOpen, setNewEmpDialogOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, contextHolder] = notification.useNotification();
  const popMessage = (message, description, type) => {
    notificationApi[type || 'open']({
      message,
      description,
    });
  };
  const newEmpDialogOk = () => {
    setConfirmLoading(true);
    form.submit()
  };
  const onFinish = (values) => {
    fetch('/api/employees', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(res => {
        if (!res.ok) return res.json().then(r => Promise.reject(r));
        return res.json();
      })
      .then(data => {
        if (data === 0) {
          popMessage('Fail to add employee', 'Please check the form fields. ', 'warning');
        } else {
          fetchData();
          setNewEmpDialogOpen(false);
          popMessage('Success', `Employee added seccessfully!`, 'success');
          form.resetFields();
        }
      }, err => {
        console.log('err', err);
        popMessage(`Server error ${err.status}`, `${err.error}${err.message}`, 'error');
      })
      .catch((err) => {
        popMessage('Fetch Fail', 'There has been a problem with your fetch operation', 'error');
      })
      .finally(() => {
        setConfirmLoading(false);
      });
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
              Add Employee
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
          />
        </Col>
      </Row>

      <Modal
        title="New Employee"
        okText="Add Employee"
        open={newEmpDialogOpen}
        onOk={newEmpDialogOk}
        confirmLoading={confirmLoading}
        onCancel={() => setNewEmpDialogOpen(false)}
      >
        <Form
          form={form} 
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          requiredMark="optional"
          name="empForm"
          onFinish={onFinish}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          {newEmpFormFields.map(e => 
            <Form.Item
              name={e.name}
              label={e.label}
              rules={e.rules || [{ required: true, },]}
            >
              {e.formItem}
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
}

export default Employees