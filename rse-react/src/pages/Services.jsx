import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Col, Row, Input, Select, notification, Tooltip  } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { FormModal } from "../components/FormModal";

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
  const [manageServDialogOpen, setManageServDialogOpen] = useState(false);
  const [hireEmpDialogOpen, setHireEmpDialogOpen] = useState(false);
  const [fireEmpDialogOpen, setFireEmpDialogOpen] = useState(false);
  const [notificationApi, contextHolder] = notification.useNotification();
  const popMessage = (message, description, type) => {
    notificationApi[type || 'open']({
      message,
      description,
    });
  };

  const newServFormFields = [
    { name: 'id', label: 'Service ID', formItem: <Input />, },
    { name: 'longName', label: 'longName', formItem: <Input />, },
    {
      name: 'homeBase',
      label: 'Home Base',
      formItem: 
        <Select
          placeholder='Select a location'
          options={locations.map(e => ({ label: e.label, value: e.label }))}
        />,
    },
    {
      name: 'manager',
      label: 'Manager',
      formItem: 
        <Select
          placeholder='Select a worker'
          options={workers.map(e => ({ label: e.username, value: e.username }))}
        />,
    },
  ];

  const manageServFormFields = [
    {
      name: 'manager',
      label: 'Manager Username',
      formItem: 
        <Select
          placeholder='Select a worker'
          options={workers.map(e => ({ label: e.username, value: e.username }))}
        />,
    },
    {
      name: 'id',
      label: 'Service ID',
      formItem: 
        <Select
          placeholder='Select a delivery service'
          options={services.map(e => ({ label: `${e.longName} (${e.id})`, value: e.id }))}
        />,
    },
  ];

  const hireEmpFormFields = [
    {
      name: 'username',
      label: 'Employee Username',
      formItem: 
        <Select
          placeholder='Select an employee'
          options={employees.map(e => ({ label: e.username, value: e.username }))}
        />,
    },
    {
      name: 'id',
      label: 'Service ID',
      formItem: 
        <Select
          placeholder='Select a delivery service'
          options={services.map(e => ({ label: `${e.longName} (${e.id})`, value: e.id }))}
        />,
    },
  ];

  const fireEmpFormFields = [
    {
      name: 'username',
      label: 'Employee Username',
      formItem: 
        <Select
          placeholder='Select an employee'
          options={employees.map(e => ({ label: e.username, value: e.username }))}
        />,
    },
    {
      name: 'id',
      label: 'Service ID',
      formItem: 
        <Select
          placeholder='Select a delivery service'
          options={services.map(e => ({ label: `${e.longName} (${e.id})`, value: e.id }))}
        />,
    },
  ];

  const newServFormFinishArgs = {
    fetchConfig: values => ([
      `/api/services`,
      {
        method: 'POST',
        body: JSON.stringify(values),
        headers: { 'Content-type': 'application/json; charset=UTF-8', },
      }
    ]),
    succDecs: 'Service added successfully!',
    failMsg: 'Fail to add service',
  }

  const manageServFormFinishArgs = {
    fetchConfig: values => ([
      `/api/services`,
      {
        method: 'PUT',  // Set to PUT method since updating, not creating
        body: JSON.stringify(values),
        headers: { 'Content-type': 'application/json; charset=UTF-8', },
      }
    ]),
    succDecs: 'Set service manager successfully!',
    failMsg: 'Fail to set service manager',
  }

  const hireEmpFormFinishArgs = {
    fetchConfig: values => ([
      `/api/employees/hire?username=${values.username}&id=${values.id}`,
      {
        method: 'POST',  // Set to POST method since adding
        body: JSON.stringify(values),
        headers: { 'Content-type': 'application/json; charset=UTF-8', },
      }
    ]),
    succDecs: 'Employee hired successfully!',
    failMsg: 'Fail to hire the employee',
  }

  const fireEmpFormFinishArgs = {
    fetchConfig: values => ([
      `/api/employees/fire?username=${values.username}&id=${values.id}`,
      { method: 'DELETE', }
    ]),
    succDecs: 'Employee fired successfully!',
    failMsg: 'Fail to fire the employee',
  }

  // Render the Services Page
  return (
    <>
      {contextHolder}
      <Row className='content' gutter={[16, 8]}>
        <Col span={24} style={{paddingTop: 16}}>
          <Space style={{float: 'right'}}>
            <Button onClick={() => setHireEmpDialogOpen(true)}>
              Hire Employee
            </Button>
            <Button onClick={() => setFireEmpDialogOpen(true)}>
              Fire Employee
            </Button>
            <Button onClick={() => setManageServDialogOpen(true)}>
              Manage Service
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setNewServDialogOpen(true)}>
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

      <FormModal
        dialogOpenState={[newServDialogOpen, setNewServDialogOpen]}
        formFields={newServFormFields}
        formFinishArgs={newServFormFinishArgs}
        refreshFn={fetchAllData}
        popMessage={popMessage}
        title='New Service'
        okText='Add Service'
      />

      <FormModal
        dialogOpenState={[manageServDialogOpen, setManageServDialogOpen]}
        formFields={manageServFormFields}
        formFinishArgs={manageServFormFinishArgs}
        refreshFn={fetchAllData}
        popMessage={popMessage}
        title='Manage Service'
        okText='Manage Service'
      />

      <FormModal
        dialogOpenState={[hireEmpDialogOpen, setHireEmpDialogOpen]}
        formFields={hireEmpFormFields}
        formFinishArgs={hireEmpFormFinishArgs}
        refreshFn={fetchAllData}
        popMessage={popMessage}
        title='Hire Employee'
        okText='Hire Employee'
      />

      <FormModal
        dialogOpenState={[fireEmpDialogOpen, setFireEmpDialogOpen]}
        formFields={fireEmpFormFields}
        formFinishArgs={fireEmpFormFinishArgs}
        refreshFn={fetchAllData}
        popMessage={popMessage}
        title='Fire Employee'
        okText='Fire Employee'
      />
    </>
  );
}

export default Services