import React, { useEffect, useState } from 'react';
import {
  Table,
  Space,
  Button,
  Col,
  Row,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  notification,
  Tooltip,
} from 'antd';
import { PlusOutlined, MinusOutlined, ReloadOutlined } from '@ant-design/icons';

const columns = [
  { title: 'Service ID', dataIndex: 'id' },
  { title: 'Drone Tag', dataIndex: 'tag' },
  { title: 'Fuel', dataIndex: 'fuel' },
  { title: 'Capacity', dataIndex: 'capacity' },
  { title: 'Sales', dataIndex: 'sales', render: (e) => `$${e}` },
  { title: 'Flown By', dataIndex: 'flownBy' },
  { title: 'Location', dataIndex: 'hover' },
  { title: 'Leader Drone Id', dataIndex: 'swarmId' },
  { title: 'Leader Drone Tag', dataIndex: 'swarmTag' },
];

function FormModal({ dialogOpenState, formFields, formFinishArgs, refreshFn, popMessage, ...props }) {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const formDialogOk = (form) => {
    setConfirmLoading(true);
    form.submit()
  };
  const onFinish = (values, args) => {
    fetch(...args.fetchConfig(values))
      .then(res => {
        if (!res.ok) return res.json().then(r => Promise.reject(r));
        return res.json();
      })
      .then(data => {
        if (data === 0) {
          popMessage(args.failMsg || 'Failed', args.failDecs || 'Please check the form fields.', 'warning');
        } else {
          refreshFn();
          args.setDialogOpen(false);
          popMessage(args.succMsg || 'Success', args.succDecs || 'Operation success!', 'success');
          args.form.resetFields();
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

  const onValuesChangeFillDrone = (values, allValues) => {
    if ('droneFullId' in values) {
      const [id, tag] = values.droneFullId.split('$');
      form.setFieldValue('id', id);
      form.setFieldValue('tag', tag);
    }
  };

  return (
    <Modal
      open={dialogOpenState[0]}
      onOk={() => { formDialogOk(form) }}
      confirmLoading={confirmLoading}
      onCancel={() => dialogOpenState[1](false)}
      {...props}
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        requiredMark='optional'
        name='form'
        onFinish={v => onFinish(v, formFinishArgs)}
        onFinishFailed={() => setConfirmLoading(false)}
        onValuesChange={onValuesChangeFillDrone}
      >
        {formFields.map((e) => (
          <Form.Item
            name={e.name}
            label={e.label}
            rules={e.rules || [{ required: true }]}
            hidden={e.hidden || false}
          >
            {e.formItem}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
}

export const Drones = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    fetch(`/api/drones/view`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  };

  const [drones, setDrones] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [locations, setLocations] = useState([]);
  const [pilots, setPilots] = useState([]);
  const [services, setServices] = useState([]);
  const fetchDataBg = (url, setFn) => {
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setFn(res);
      });
  };

  const fetchAllData = () => {
    fetchData();
    fetchDataBg('/api/drones', setDrones);
    fetchDataBg('/api/ingredients', setIngredients);
    fetchDataBg('/api/locations', setLocations);
    fetchDataBg('/api/pilots', setPilots);
    fetchDataBg('/api/services', setServices);
  };
    
  useEffect(() => {
    fetchAllData();
  }, []);

  const [loadDroneDialogOpen, setLoadDroneDialogOpen] = useState(false);
  const [refuelDroneDialogOpen, setRefuelDroneDialogOpen] = useState(false);
  const [leaveSwarmDialogOpen, setLeaveSwarmDialogOpen] = useState(false);
  const [joinSwarmDialogOpen, setJoinSwarmDialogOpen] = useState(false);
  const [flyDroneDialogOpen, setFlyDroneDialogOpen] = useState(false);
  const [addDroneDialogOpen, setAddDroneDialogOpen] = useState(false);
  const [removeDroneDialogOpen, setRemoveDroneDialogOpen] = useState(false);
  
  const [formLoad] = Form.useForm();
  const [formRefuel] = Form.useForm();
  const [formLeave] = Form.useForm();
  const [formJoin] = Form.useForm();
  const [formFly] = Form.useForm();
  const [formAdd] = Form.useForm();
  const [formRemove] = Form.useForm();

  const [notificationApi, contextHolder] = notification.useNotification();
  const popMessage = (message, description, type) => {
    notificationApi[type || 'open']({
      message,
      description,
    });
  };

  const singleDroneFormFields = [
    { name: 'id', label: 'Delivery Service ID', formItem: <Input /> , hidden: true},
    {
      name: 'tag',
      label: 'Drone Tag',
      formItem: <InputNumber />,
      hidden: true
    },
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
  
  const loadDroneFormFields = [
    ...singleDroneFormFields,
    { 
      name: 'barcode', 
      label: 'Ingredient Barcode', 
      formItem: 
        <Select 
          placeholder='Select a ingredient'
          options={ingredients.map(e => ({ label: e.barcode, value: e.barcode }))}
        />
    },
    {
      name: 'morePackages',
      label: 'new Package Amount',
      formItem: <InputNumber />,
      rules: [{ required: true }, { type: 'number', min: 0 }],
    },
    {
      name: 'price',
      label: 'Price ($)',
      formItem: <InputNumber />,
      rules: [{ required: true }, { type: 'number', min: 0 }],
    },
  ];
  
  const refuelDroneFormFields = [
    ...singleDroneFormFields,
    {
      name: 'moreFuel',
      label: 'Refuel Amount',
      formItem: <InputNumber />,
      rules: [{ required: true }, { type: 'number', min: 0 }],
    },
  ];
  
  const flyDroneFormFields = [
    ...singleDroneFormFields,
    { 
      name: 'destination', 
      label: 'Destination', 
      formItem: 
        <Select
          placeholder='Select a location'
          options={locations.map(e => ({ label: e.label, value: e.label }))}
        />, 
    },
  ];
  

  const joinSwarmFormFields = [
    ...singleDroneFormFields,
    { 
      name: 'swarmTag', 
      label: 'Leader Drone Tag', 
      formItem: 
        <Select
          placeholder='Select a drone tage'
          options={
            Array.from(new Set(drones.map(e => e.tag))).sort((a, b) => a-b).map(e => ({ label: e, value: e }))
          }
        />,
      rules: [{ required: true }, { type: 'number', min: 0 }],
    },
  ];
  
  const droneFormFields = [
    { name: 'id', label: 'Delivery Service ID', formItem: <Input /> },
    {
      name: 'tag',
      label: 'Drone Tag',
      formItem: <InputNumber />,
      rules: [{ required: true }, { type: 'number', min: 0 }],
    },
    {
      name: 'fuel',
      label: 'Fuel Amount',
      formItem: <InputNumber />,
      rules: [{ required: true }, { type: 'number', min: 0 }],
    },
    {
      name: 'capacity',
      label: 'Capacity',
      formItem: <InputNumber />,
      rules: [{ required: true }, { type: 'number', min: 0 }],
    },
    {
      name: 'sales',
      label: 'sales',
      formItem: <InputNumber />,
      rules: [{ required: true }, { type: 'number', min: 0 }],
    },
    { 
      name: 'flownBy', 
      label: 'Flown By', 
      formItem: 
        <Select
          placeholder='Select a pilot'
          options={pilots.map(e => ({ label: e.username, value: e.username }))}
        />
    },
  ];
  

  const loadFormFinishArgs = {
    fetchConfig: values => ([
      `/api/drones/loading/${values.id}/${values.tag}`,
      {
        method: 'PUT',
        body: new URLSearchParams(values),
        headers: { 'Content-type': 'application/x-www-form-urlencoded; charset = UTF-8', },
      }
    ]),
    setDialogOpen: setLoadDroneDialogOpen,
    form: formLoad, 
    succMsg: 'Success',
    succDecs: 'This Drone was loaded seccessfully!',
    failMsg: 'Fail to load drone',
    failDecs: 'Please check the form fields.', 
  }

  const refuelFormFinishArgs = {
    fetchConfig: values => ([
      `/api/drones/fuel/${values.id}/${values.tag}`, 
      {
        method: 'PUT',
        body: new URLSearchParams(values),
        headers: { 'Content-type': 'application/x-www-form-urlencoded; charset = UTF-8', },
      }
    ]),
    setDialogOpen: setRefuelDroneDialogOpen,
    form: formRefuel, 
    succDecs: 'This Drone was refuel seccessfully!',
    failMsg: 'Fail to refuel drone',
  }

  const flyFormFinishArgs = {
    fetchConfig: values => ([
      `/api/drones/fly`, 
      {
        method: 'PUT',
        body: JSON.stringify(values),
        headers: { 'Content-type': 'application/json; charset=UTF-8', },
      }
    ]),
    setDialogOpen: setFlyDroneDialogOpen,
    form: formFly, 
    succDecs: 'This Drone has Flied away already!',
    failMsg: 'Cannot make this drone flying',
  }

  const leaveFormFinishArgs = {
    fetchConfig: values => ([
      `/api/drones/swarms`, 
      {
        method: 'DELETE',
        body: JSON.stringify(values),
        headers: { 'Content-type': 'application/json; charset=UTF-8', },
      }
    ]),
    setDialogOpen: setLeaveSwarmDialogOpen,
    form: formLeave, 
    succDecs: 'This Drone has left swarm already!',
    failMsg: 'Cannot leave the swarm',
  }

  const joinFormFinishArgs = {
    fetchConfig: values => ([
      `/api/drones/swarms`, 
      {
        method: 'PUT',
        body: JSON.stringify(values),
        headers: { 'Content-type': 'application/json; charset=UTF-8', },
      }
    ]),
    setDialogOpen: setJoinSwarmDialogOpen,
    form: formJoin, 
    succDecs: 'This Drone was joined swarm seccessfully!',
    failMsg: 'Cannot join the swarm',
  }

  const addFormFinishArgs = {
    fetchConfig: values => ([
      `/api/drones`, 
      {
        method: 'POST',
        body: JSON.stringify(values),
        headers: { 'Content-type': 'application/json; charset=UTF-8', },
      }
    ]),
    setDialogOpen: setAddDroneDialogOpen,
    form: formAdd, 
    succDecs: 'New Drone was added seccessfully!',
    failMsg: 'Fail to add drone',
  }

  const removeFormFinishArgs = {
    fetchConfig: values => ([
      `/api/drones/${values.id}/${values.tag}`, 
      {
        method: 'DELETE',
        body: JSON.stringify(values),
        headers: { 'Content-type': 'application/json; charset=UTF-8', },
      }
    ]),
    setDialogOpen: setRemoveDroneDialogOpen,
    form: formRemove, 
    succDecs: 'New Drone was removed seccessfully!',
    failMsg: 'Fail to remove drone',
  }

  return (
    <>
      {contextHolder}
      <Row className='page-content' gutter={[16, 8]}>
        <Col span={24} style={{ paddingTop: 16 }}>
          <Space style={{ float: 'right' }}>
            {/* Load button */}
            <Button icon={<PlusOutlined />} onClick={() => setLoadDroneDialogOpen(true)}>
              Load Drone
            </Button>

            <Button icon={<PlusOutlined />} onClick={() => setRefuelDroneDialogOpen(true)}>
              Refuel Drone
            </Button>

            <Button icon={<PlusOutlined />} onClick={() => setFlyDroneDialogOpen(true)}>
              Fly Drone
            </Button>

            <Button type='primary' icon={<PlusOutlined />} onClick={() => setAddDroneDialogOpen(true)}>
              Add Drone
            </Button>

            <Button icon={<MinusOutlined />} onClick={() => setRemoveDroneDialogOpen(true)}>
              Remove Drone
            </Button>

            <Button icon={<PlusOutlined />} onClick={() => setLeaveSwarmDialogOpen(true)}>
              Leave Swarm
            </Button>

            <Button icon={<PlusOutlined />} onClick={() => setJoinSwarmDialogOpen(true)}>
              Join Swarm
            </Button>

            <Tooltip title='refresh'>
              <Button
                type='text'
                shape='circle'
                icon={<ReloadOutlined />}
                onClick={() => fetchData()}
              />
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
        dialogOpenState={[loadDroneDialogOpen, setLoadDroneDialogOpen]}
        formFields={loadDroneFormFields}
        formFinishArgs={loadFormFinishArgs}
        refreshFn={fetchAllData}
        popMessage={popMessage}
        title='Load Drone'
        okText='Load Drone'
      />

      <FormModal
        dialogOpenState={[refuelDroneDialogOpen, setRefuelDroneDialogOpen]}
        formFields={refuelDroneFormFields}
        formFinishArgs={refuelFormFinishArgs}
        refreshFn={fetchAllData}
        popMessage={popMessage}
        title='Refuel Drone'
        okText='Refuel Drone'
      />

      <FormModal
        dialogOpenState={[flyDroneDialogOpen, setFlyDroneDialogOpen]}
        formFields={flyDroneFormFields}
        formFinishArgs={flyFormFinishArgs}
        refreshFn={fetchAllData}
        popMessage={popMessage}
        title='Fly Drone'
        okText='Fly Drone'
      />

      <FormModal
        dialogOpenState={[leaveSwarmDialogOpen, setLeaveSwarmDialogOpen]}
        formFields={singleDroneFormFields}
        formFinishArgs={leaveFormFinishArgs}
        refreshFn={fetchAllData}
        popMessage={popMessage}
        title='Leave Swarm'
        okText='Leave Swarm'
      />

      <FormModal
        dialogOpenState={[joinSwarmDialogOpen, setJoinSwarmDialogOpen]}
        formFields={joinSwarmFormFields}
        formFinishArgs={joinFormFinishArgs}
        refreshFn={fetchAllData}
        popMessage={popMessage}
        title='Join Swarm'
        okText='Join Swarm'
      />

      <FormModal
        dialogOpenState={[addDroneDialogOpen, setAddDroneDialogOpen]}
        formFields={droneFormFields}
        formFinishArgs={addFormFinishArgs}
        refreshFn={fetchAllData}
        popMessage={popMessage}
        title='New Drone'
        okText='Add Drone'
      />

      <FormModal
        dialogOpenState={[removeDroneDialogOpen, setRemoveDroneDialogOpen]}
        formFields={singleDroneFormFields}
        formFinishArgs={removeFormFinishArgs}
        refreshFn={fetchAllData}
        popMessage={popMessage}
        title='Remove Drone'
        okText='Remove Drone'
      />
    </>
  );
};

export default Drones;
