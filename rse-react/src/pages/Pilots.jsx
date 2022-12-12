import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Col, Row, Input, InputNumber, Select, notification, Tooltip } from 'antd';
import {
  PlusOutlined,
  MinusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { FormModal } from "../components/FormModal";


// columns of pilotView table
const columns = [
  { title: 'Username', dataIndex: 'username' },
  { title: 'License ID', dataIndex: 'licenseID' },
  { title: 'Piloting Experience (trips)', dataIndex: 'experience' },
  { title: 'Num of Drones', dataIndex: 'numDrones' },
  { title: 'Num of Locations', dataIndex: 'numLocations' },
];

export const Pilots = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  // get data from DB for pilotView table
  const fetchData = () => {
    setLoading(true);
    fetch(`/api/pilots/view`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  };

  const [employees, setEmployees] = useState([]);
  const [pilots, setPilots] = useState([]);
  const [drones, setDrones] = useState([]);
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
    fetchDataBg('/api/pilots', setPilots);
    fetchDataBg('/api/drones', setDrones);
  };
    
  useEffect(() => {
    fetchAllData();
  }, []);

  // Add pilot Popups and error handling
  const [addPilDialogOpen, setAddPilDialogOpen] = useState(false);
  const [remPilDialogOpen, setRemPilDialogOpen] = useState(false);
  const [takeDroneDialogOpen, setTakeDroneDialogOpen] = useState(false);
  
  const [notificationApi, contextHolder] = notification.useNotification();
  const popMessage = (message, description, type) => {
    notificationApi[type || 'open']({
      message,
      description,
    });
  };

  const addPilotFormFields = [
    {
      name: 'username',
      label: 'Employee Username',
      formItem: 
        <Select
          placeholder='Select an employee'
          options={employees.map(e => ({ label: e.username, value: e.username }))}
        />,
    },
    { name: 'licenseID', label: 'License ID', formItem: <Input />, },
    { name: 'experience', label: 'Experience', formItem: <InputNumber />, },
  ];

  const removePilotFormFields = [
    {
      name: 'username',
      label: 'Pilot Username',
      formItem: 
        <Select
          placeholder='Select a pilot'
          options={pilots.map(e => ({ label: e.username, value: e.username }))}
        />,
    },
  ];

  const takeDroneFormFields = [
    {
      name: 'flownBy',
      label: 'Pilot Username',
      formItem: 
        <Select
          placeholder='Select a pilot'
          options={pilots.map(e => ({ label: e.username, value: e.username }))}
        />,
    },
    { name: 'id', formItem: <Input />, hidden: true},
    { name: 'tag', formItem: <InputNumber />, hidden: true },
    {
      name: 'droneFullId',
      label: 'Drone',
      formItem: 
        <Select
          placeholder='Select a drone'
          options={drones.map(e => ({ label: `${e.id} ${e.tag}`, value: `${e.id}$${e.tag}` }))}
        />,
      rules: [{ required: true }],
    },
  ];

  // onFinish arguments for forms
  const addPilotFormFinishArgs = {
    fetchConfig: values => ([
      `/api/pilots`,
      {
        method: 'POST',
        body: JSON.stringify(values),
        headers: { 'Content-type': 'application/json; charset=UTF-8', },
      }
    ]),
    succDecs: 'Pilot added successfully!',
    failMsg: 'Failed to add pilot',
  }

  const removePilotFormFinishArgs = {
    fetchConfig: values => ([
      `/api/pilots/role/${values.username}`,
      { method: 'DELETE' }
    ]),
    succDecs: 'Pilot removed successfully!',
    failMsg: 'Failed to remove pilot',
  }

  const takeDroneFormFinishArgs = {
    fetchConfig: values => ([
      `/api/drones`,
      {
        method: 'PUT',
        body: JSON.stringify(values),
        headers: { 'Content-type': 'application/json; charset=UTF-8', },
      }
    ]),
    succDecs: 'Drone taken over successfully!',
    failMsg: 'Failed to taken over pilot',
  }

  // Render the Pilots Page
  return (
    <>
      {contextHolder}
      <Row className='page-content' gutter={[16, 8]}>
        <Col span={24} style={{paddingTop: 16}}>
          <Space style={{float: 'right'}}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddPilDialogOpen(true)}>
              Add
            </Button>
            <Button icon={<MinusOutlined />} onClick={() => setRemPilDialogOpen(true)}>
              Remove
            </Button>
            <Button onClick={() => setTakeDroneDialogOpen(true)}>
              Takeover Drone
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
        dialogOpenState={[addPilDialogOpen, setAddPilDialogOpen]}
        formFields={addPilotFormFields}
        formFinishArgs={addPilotFormFinishArgs}
        refreshFn={fetchAllData}
        popMessage={popMessage}
        title='New Pilot'
        okText='Add Pilot'
      />

      <FormModal
        dialogOpenState={[remPilDialogOpen, setRemPilDialogOpen]}
        formFields={removePilotFormFields}
        formFinishArgs={removePilotFormFinishArgs}
        refreshFn={fetchAllData}
        popMessage={popMessage}
        title='Remove Pilot'
        okText='Remove Pilot'
      />
      
      <FormModal
        dialogOpenState={[takeDroneDialogOpen, setTakeDroneDialogOpen]}
        formFields={takeDroneFormFields}
        formFinishArgs={takeDroneFormFinishArgs}
        refreshFn={fetchAllData}
        popMessage={popMessage}
        title='Takeover Drone'
        okText='Takeover Drone'
      />
    </>
  );
}

export default Pilots