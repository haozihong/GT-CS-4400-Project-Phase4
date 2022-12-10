import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Col, Row, Modal, Form, Input, InputNumber, notification, Tooltip } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns'

// columns of workerViewTable
const columns = [
  { title: 'Username', dataIndex: 'username' },
  { title: 'Service ID', dataIndex: 'id' },
  { title: 'Last Name', dataIndex: 'firstName' },
  { title: 'Last Name', dataIndex: 'lastName' },
  { title: 'Address', dataIndex: 'address' },
  { title: 'Birthdate', dataIndex: 'birthdate', render: e => format(e, 'yyyy-MM-dd'), },
];

// fields in the addWorker pop-up
const newWorkFormFields = [
  { name: "username", label: "Username", formItem: <Input />, },
];

// get data from DB for workerView table
export const Workers = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    fetchData();
  }, []);


  // Add Worker Popup and error handling
  const [newWorkDialogOpen, setNewWorkDialogOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, contextHolder] = notification.useNotification();
  const popMessage = (message, description, type) => {
    notificationApi[type || 'open']({
      message,
      description,
    });
  };
  const newWorkDialogOk = () => {
    setConfirmLoading(true);
    form.submit()
  };
  const onFinish = (values) => {
    fetch('/api/workers', {
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
          popMessage('Failed to add worker', 'Please check the form fields. ', 'warning');
        } else {
          fetchData();
          setNewWorkDialogOpen(false);
          popMessage('Success', `Worker added successfully!`, 'success');
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

  // Render the Workers Page
  return (
    <>
      {contextHolder}
      <Row className='content' gutter={[16, 8]}>
        <Col span={24} style={{paddingTop: 16}}>
          <Space style={{float: 'right'}}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setNewWorkDialogOpen(true)}
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
          />
        </Col>
      </Row>

      <Modal
        title="New Worker"
        okText="Add Worker"
        open={newWorkDialogOpen}
        onOk={newWorkDialogOk}
        confirmLoading={confirmLoading}
        onCancel={() => setNewWorkDialogOpen(false)}
      >
        <Form
          form={form}
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          requiredMark="optional"
          name="workForm"
          onFinish={onFinish}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          {newWorkFormFields.map(e =>
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

export default Workers