import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Col, Row, Modal, Form, Input, InputNumber, notification, Tooltip } from 'antd';
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

// fields in the addPilot pop-up
const newPilFormFields = [
  { name: "username", label: "Username", formItem: <Input />, },
  { name: "licenseID", label: "License ID", formItem: <Input />, },
  { name: "experience", label: "Experience", formItem: <InputNumber />, },
];

// fields in the removePilot pop-up
const remPilFormFields = [
  { name: "username", label: "Username", formItem: <Input />, },
];

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

  useEffect(() => {
    fetchData();
  }, []);


      // Add pilot Popups and error handling
      const [newPilDialogOpen, setNewPilDialogOpen] = useState(false);
      const [remPilDialogOpen, setRemPilDialogOpen] = useState(false);
      const [confirmLoading, setConfirmLoading] = useState(false);
      const [form] = Form.useForm();
      const [notificationApi, contextHolder] = notification.useNotification();
      const popMessage = (message, description, type) => {
        notificationApi[type || 'open']({
          message,
          description,
        });
      };
      const newPilDialogOk = () => {
        setConfirmLoading(true);
        form.submit()
      };
      const remPilDialogOk = () => {
        setConfirmLoading(true);
        form.submit()
      };

      const onFinish = (values) => {
        fetch('/api/pilots', {
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
              popMessage('Failed to add pilot', 'Please check the form fields. ', 'warning');
            } else {
              fetchData();
              setNewPilDialogOpen(false);
              popMessage('Success', `Pilot added successfully!`, 'success');
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

      const onFinishRemove = (values) => {
        fetch('/api/pilots/role/' + values.username, {
          method: 'DELETE'
        })
          .then(res => {
            if (!res.ok) return res.json().then(r => Promise.reject(r));
            return res.json();
          })
          .then(data => {
            if (data === 0) {
              popMessage('Failed to remove pilot', 'Please check the form fields. ', 'warning');
            } else {
              fetchData();
              setRemPilDialogOpen(false);
              popMessage('Success', `Pilot removed successfully!`, 'success');
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
                  Add Pilot
                </Button>
                <Button
                  type="default"
                  icon={<MinusOutlined />}
                  onClick={() => setRemPilDialogOpen(true)}
                >
                  Remove Pilot
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
            title="New Pilot"
            okText="Add Pilot"
            open={newPilDialogOpen}
            onOk={newPilDialogOk}
            confirmLoading={confirmLoading}
            onCancel={() => setNewPilDialogOpen(false)}
          >
            <Form
              form={form}
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              requiredMark="optional"
              name="pilForm"
              onFinish={onFinish}
              onFinishFailed={() => setConfirmLoading(false)}
            >
              {newPilFormFields.map(e =>
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
          <Modal
            title="Remove Pilot"
            okText="Remove Pilot"
            open={remPilDialogOpen}
            onOk={remPilDialogOk}
            confirmLoading={confirmLoading}
            onCancel={() => setRemPilDialogOpen(false)}
          >
            <Form
              form={form}
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              requiredMark="optional"
              name="pilForm"
              onFinish={onFinishRemove}
              onFinishFailed={() => setConfirmLoading(false)}
            >
              {remPilFormFields.map(e =>
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

export default Pilots