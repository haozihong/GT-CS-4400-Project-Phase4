import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Col, Row, Modal, Form, Input, InputNumber, notification, Tooltip  } from 'antd';
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

// fields in the addService pop-up
const newServFormFields = [
  { name: "id", label: "ID", formItem: <Input />,
   rules: [{ required: true, }], },
  { name: "longName", label: "Long Name", formItem: <Input />,
   rules: [{ required: true, }], },
  { name: "homeBase", label: "Home Base", formItem: <Input />,
   rules: [{ required: true, }], },
  { name: "manager", label: "Manager", formItem: <Input />,
   rules: [{ required: true, }], },
];

// get data from DB for serviceView table
export const Services = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const fetchData = () => {
    setLoading(true);
    fetch(`/api/services/view`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);


// Add service Popups and error handling
  const [newServDialogOpen, setNewServDialogOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, contextHolder] = notification.useNotification();
  const popMessage = (message, description, type) => {
    notificationApi[type || 'open']({
      message,
      description,
    });
  };
  const newServDialogOk = () => {
    setConfirmLoading(true);
    form.submit()
  };
  const onFinish = (values) => {
    fetch('/api/services', {
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
          popMessage('Failed to add service', 'Please check the form fields. ', 'warning');
        } else {
          fetchData();
          setNewServDialogOpen(false);
          popMessage('Success', `${data} Service added successfully!`, 'success');
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

// Render the Services Page
return (
    <>
      {contextHolder}
      <Row className='content' gutter={[16, 8]}>
        <Col span={24} style={{paddingTop: 16}}>
          <Space style={{float: 'right'}}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setNewServDialogOpen(true)}
            >
              Add Service
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
        title="New Service"
        okText="Add Service"
        open={newServDialogOpen}
        onOk={newServDialogOk}
        confirmLoading={confirmLoading}
        onCancel={() => setNewServDialogOpen(false)}
      >
        <Form
          form={form}
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          requiredMark="optional"
          name="servForm"
          onFinish={onFinish}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          {newServFormFields.map(e =>
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

export default Services