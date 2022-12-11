import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Col, Row, Modal, Form, Input, Select, notification, Tooltip  } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

// columns of serviceView table
const columns = [
  { title: 'Service ID', dataIndex: 'id' },
  { title: 'Name', dataIndex: 'longName' },
  { title: 'Home Base', dataIndex: 'homeBase' },
  { title: 'Manager', dataIndex: 'manager' },
  { title: 'Revenue', dataIndex: 'revenue' },
  { title: 'Ingredients Carried', dataIndex: 'ingredientsCarried' },
  { title: 'Cost Carried', dataIndex: 'costCarried' },
  { title: 'Weight Carried', dataIndex: 'weightCarried' },
];

const newServFetchConfig = values => ([
  `/api/services`,
  {
    method: 'POST',
    body: JSON.stringify(values),
    headers: { 'Content-type': 'application/json; charset=UTF-8', },
  }
]);

const manageServFetchConfig = values => ([
  `/api/services`,
  {
    method: 'PUT',                            // ######################################## Set to PUT method since updating, not creating
    body: JSON.stringify(values),
    headers: { 'Content-type': 'application/json; charset=UTF-8', },
  }
]);

const hireEmpFetchConfig = values => ([
  `/api/employees/hire?username=${values.username}&id=${values.id}`,
  {
    method: 'POST',                            // ######################################## Set to POST method since adding
    body: JSON.stringify(values),
    headers: { 'Content-type': 'application/json; charset=UTF-8', },
  }
]);

const fireEmpFetchConfig = values => ([
  `/api/employees/fire?username=${values.username}&id=${values.id}`,
  { method: 'DELETE', }
]);

export const Services = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  // get data from DB for serviceView table
  const fetchData = () => {
    setLoading(true);
    fetch(`/api/services/view`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  };

  const [employees, setEmployees] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);
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
    fetchDataBg('/api/workers', setWorkers);
    fetchDataBg('/api/services', setServices);
    fetchDataBg('/api/locations', setLocations);
  };
    
  useEffect(() => {
    fetchAllData();
  }, []);

// Add service Popups and error handling
  const [newServDialogOpen, setNewServDialogOpen] = useState(false);
  const [manageServDialogOpen, setManageServDialogOpen] = useState(false);  // #################################
  const [hireEmpDialogOpen, setHireEmpDialogOpen] = useState(false);  // #################################
  const [fireEmpDialogOpen, setFireEmpDialogOpen] = useState(false);  // #################################
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formNewServ] = Form.useForm();
  const [formManageServ] = Form.useForm();
  const [formHireEmp] = Form.useForm();
  const [formFireEmp] = Form.useForm();
  const [notificationApi, contextHolder] = notification.useNotification();
  const popMessage = (message, description, type) => {
    notificationApi[type || 'open']({
      message,
      description,
    });
  };
  const formDialogOk = (form) => {
    setConfirmLoading(true);
    form.submit()
  };

  const onFinish = (values, fetchConfig, setDialogOpen, form, succMsg, failMsg) => {
    fetch(...fetchConfig(values))
      .then(res => {
        if (!res.ok) return res.json().then(r => Promise.reject(r));
        return res.json();
      })
      .then(data => {
        if (data === 0) {
          popMessage('Failed', failMsg || 'Please check the form fields. ', 'warning');
        } else {
          fetchAllData();
          setDialogOpen(false);
          popMessage('Success', succMsg || 'Operation success!', 'success');
          form.resetFields();
        }
      }, err => {
        console.log('err', err);
        popMessage(`Server error ${err.status}`, `${err.error}${err.message}`, 'error');
      })
      .catch((err) => {
        console.log(err);
        popMessage('Fetch Fail', 'There has been a problem with your fetch operation', 'error');
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  // Render the Services Page
  return (
    <>
      {contextHolder}
      <Row className='content' gutter={[16, 8]}>
        <Col span={24} style={{paddingTop: 16}}>
          <Space style={{float: 'right'}}>
            <Button                                       // ############################## Added new hireEmployee button
              type="default"                            // ###################### changed button to default type, only 1 primary allowed
              onClick={() => setHireEmpDialogOpen(true)}     // ################ set onclick popup open
            >
              Hire Employee
            </Button>
            <Button                                       // ############################## Added new fireEmployee button
              type="default"                            // ###################### changed button to default type, only 1 primary allowed
              onClick={() => setFireEmpDialogOpen(true)}     // ################ set onclick popup open
            >
              Fire Employee
            </Button>
            <Button                                       // ############################## Added new manageService button
              type="default"                            // ###################### changed button to default type, only 1 primary allowed
              onClick={() => setManageServDialogOpen(true)}     // ################ set onclick popup open
            >
              Manage Service
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setNewServDialogOpen(true)}
            >
              Add Service
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
          />
        </Col>
      </Row>

      <Modal
        title="New Service"
        okText="Add Service"
        open={newServDialogOpen}
        onOk={() => {formDialogOk(formNewServ)}}
        confirmLoading={confirmLoading}
        onCancel={() => setNewServDialogOpen(false)}
      >
        <Form
          form={formNewServ}
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          requiredMark="optional"
          name="servForm"
          onFinish={v => onFinish(v, newServFetchConfig, setNewServDialogOpen, formNewServ, 'Service added successfully!')}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          <Form.Item
            name="id"
            label="Service ID"
            required
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="longName"
            label="Long Name"
            required
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="homeBase"
            label="Home Base"
            required
          >
            <Select
              placeholder='Select a location'
              options={locations.map(e => ({ label: e.label, value: e.label }))}
            />
          </Form.Item>
          <Form.Item
            name="manager"
            label="Manager"
            required
          >
            <Select
              placeholder='Select a worker'
              options={workers.map(e => ({ label: e.username, value: e.username }))}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal                            // ################################ Added entire new Modal for manage service
        title="Manage Service"
        okText="Manage Service"
        open={manageServDialogOpen}
        onOk={() => {formDialogOk(formManageServ)}}
        confirmLoading={confirmLoading}
        onCancel={() => setManageServDialogOpen(false)}
      >
        <Form
          form={formManageServ}
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          requiredMark="optional"
          name="manageServForm"
          onFinish={v => onFinish(v, manageServFetchConfig, setManageServDialogOpen, formManageServ, 'Set service manager successfully!')}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          <Form.Item
            name="manager"
            label="Manager Username"
            required
          >
            <Select
              placeholder='Select a worker'
              options={workers.map(e => ({ label: e.username, value: e.username }))}
            />
          </Form.Item>
          <Form.Item
            name="id"
            label="Service ID"
            required
          >
            <Select
              placeholder='Select a delivery service'
              options={services.map(e => ({ label: `${e.longName} (${e.id})`, value: e.id }))}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal                            // ################################ Added entire new Modal for hire employee
        title="Hire Employee"
        okText="Hire Employee"
        open={hireEmpDialogOpen}
        onOk={() => {formDialogOk(formHireEmp)}}
        confirmLoading={confirmLoading}
        onCancel={() => setHireEmpDialogOpen(false)}
      >
        <Form
          form={formHireEmp}
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          requiredMark="optional"
          name="hireEmpForm"
          onFinish={v => onFinish(v, hireEmpFetchConfig, setHireEmpDialogOpen, formHireEmp, 'Employee hired successfully!')}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          <Form.Item
            name="username"
            label="Employee Username"
            required
          >
            <Select
              placeholder='Select an employee'
              options={employees.map(e => ({ label: e.username, value: e.username }))}
            />
          </Form.Item>
          <Form.Item
            name="id"
            label="Service ID"
            required
          >
            <Select
              placeholder='Select a delivery service'
              options={services.map(e => ({ label: `${e.longName} (${e.id})`, value: e.id }))}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal                            // ################################ Added entire new Modal for fire employee
        title="Fire Employee"
        okText="Fire Employee"
        open={fireEmpDialogOpen}
        onOk={() => {formDialogOk(formFireEmp)}}
        confirmLoading={confirmLoading}
        onCancel={() => setFireEmpDialogOpen(false)}
      >
        <Form
          form={formFireEmp}
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          requiredMark="optional"
          name="fireEmpForm"
          onFinish={v => onFinish(v, fireEmpFetchConfig, setFireEmpDialogOpen, formFireEmp, 'Employee fired successfully!')}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          <Form.Item
            name="username"
            label="Employee Username"
            required
          >
            <Select
              placeholder='Select an employee'
              options={employees.map(e => ({ label: e.username, value: e.username }))}
            />
          </Form.Item>
          <Form.Item
            name="id"
            label="Service ID"
            required
          >
            <Select
              placeholder='Select a delivery service'
              options={services.map(e => ({ label: `${e.longName} (${e.id})`, value: e.id }))}
            />
          </Form.Item>
        </Form>
      </Modal>

    </>
  );
}

export default Services