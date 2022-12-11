import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Col, Row, Modal, Form, Input, InputNumber, Select, notification, Tooltip } from 'antd';
import {
  PlusOutlined,
  MinusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';


// columns of pilotView table
const columns = [
  { title: 'Username', dataIndex: 'username' },
  { title: 'License ID', dataIndex: 'licenseID' },
  { title: 'Piloting Experience (trips)', dataIndex: 'experience' },
  { title: 'Num of Drones', dataIndex: 'numDrones' },
  { title: 'Num of Locations', dataIndex: 'numLocations' },
];

const addPilotFetchConfig = values => ([
  `/api/pilots`,
  {
    method: 'POST',
    body: JSON.stringify(values),
    headers: { 'Content-type': 'application/json; charset=UTF-8', },
  }
]);

const removeFetchConfig = values => ([
  `/api/pilots/role/${values.username}`,
  { method: 'DELETE' }
]);

const takeDroneFetchConfig = values => ([
  `/api/drones`,
  {
    method: 'PUT',
    body: JSON.stringify(values),
    headers: { 'Content-type': 'application/json; charset=UTF-8', },
  }
]);

// get data from DB for pilotView table
export const Pilots = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
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
  const [newPilDialogOpen, setNewPilDialogOpen] = useState(false);
  const [remPilDialogOpen, setRemPilDialogOpen] = useState(false);
  const [takeDroneDialogOpen, setTakeDroneDialogOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formAddPilot] = Form.useForm();
  const [formRemovePilot] = Form.useForm();
  const [formTakeDrone] = Form.useForm();
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

  // Render the Pilots Page
  return (
    <>
      {contextHolder}
      <Row className='page-content' gutter={[16, 8]}>
        <Col span={24} style={{paddingTop: 16}}>
          <Space style={{float: 'right'}}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setNewPilDialogOpen(true)}
            >
              Add
            </Button>
            <Button
              type="default"
              icon={<MinusOutlined />}
              onClick={() => setRemPilDialogOpen(true)}
            >
              Remove
            </Button>
            <Button
              type="default"
              onClick={() => setTakeDroneDialogOpen(true)}
            >
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
          />
        </Col>
      </Row>

      <Modal
        title="New Pilot"
        okText="Add Pilot"
        open={newPilDialogOpen}
        onOk={() => {formDialogOk(formAddPilot)}}
        confirmLoading={confirmLoading}
        onCancel={() => setNewPilDialogOpen(false)}
      >
        <Form
          form={formAddPilot}
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          requiredMark="optional"
          name="pilForm"
          onFinish={values => {
            onFinish(
              values,
              addPilotFetchConfig,
              setNewPilDialogOpen, 
              formAddPilot,
              'Pilot added successfully!',
              'Failed to add pilot')
          }}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          <Form.Item
            name="username"
            label="Employee Username"
            rules={[{ required: true, },]}
          >
            <Select
              placeholder='Select an employee'
              options={employees.map(e => ({ label: e.username, value: e.username }))}
            />
          </Form.Item>
          <Form.Item
            name="licenseID"
            label="License ID"
            rules={[{ required: true, },]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="experience"
            label="Experience"
            rules={[{ required: true, },]}
          >
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Remove Pilot"
        okText="Remove Pilot"
        open={remPilDialogOpen}
        onOk={() => {formDialogOk(formRemovePilot)}}
        confirmLoading={confirmLoading}
        onCancel={() => setRemPilDialogOpen(false)}
      >
        <Form
          form={formRemovePilot}
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          requiredMark="optional"
          name="removePilotForm"
          onFinish={v => onFinish(v, removeFetchConfig, setRemPilDialogOpen, formRemovePilot, 'Pilot removed successfully!')}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          <Form.Item
            name="username"
            label="Pilot Username"
            rules={[{ required: true, },]}
          >
            <Select
              placeholder='Select a pilot'
              options={pilots.map(e => ({ label: e.username, value: e.username }))}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Takeover Drone"
        okText="Takeover Drone"
        open={takeDroneDialogOpen}
        onOk={() => {formDialogOk(formTakeDrone)}}
        confirmLoading={confirmLoading}
        onCancel={() => setTakeDroneDialogOpen(false)}
      >
        <Form
          form={formTakeDrone}
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          requiredMark="optional"
          name="takeDroneForm"
          onFinish={v => onFinish(v, takeDroneFetchConfig, setTakeDroneDialogOpen, formTakeDrone, 'Drone taken over successfully!')}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          <Form.Item
            name="flownBy"
            label="Pilot Username"
            rules={[{ required: true, },]}
          >
            <Select
              placeholder='Select a pilot'
              options={pilots.map(e => ({ label: e.username, value: e.username }))}
            />
          </Form.Item>
          <Form.Item
            name="id"
            label="Service ID"
            required
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="tag"
            label="Drone Tag"
            required
            hidden
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="_"
            label="Drone"
            required
          >
            <Select
              placeholder='Select a drone'
              options={drones.map(e => ({ label: `${e.id} ${e.tag}`, value: `${e.id}$${e.tag}` }))}
              onChange={(value) => {
                const [id, tag] = value.split('$');
                formTakeDrone.setFieldValue('id', id);
                formTakeDrone.setFieldValue('tag', tag);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Pilots