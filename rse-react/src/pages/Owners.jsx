import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Col, Row, Modal, Form, Input, DatePicker, InputNumber, notification, Tooltip } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

// columns of ownerView table
const columns = [
  { title: 'Username', dataIndex: 'username' },
  { title: 'First Name', dataIndex: 'firstName' },
  { title: 'Last Name', dataIndex: 'lastName' },
  { title: 'Address', dataIndex: 'address' },
  { title: 'Num of Restaurants', dataIndex: 'numRestaurants' },
  { title: 'Num of Places', dataIndex: 'numPlaces' },
  { title: 'Highest Rating', dataIndex: 'highs' },
  { title: 'Lowest Rating', dataIndex: 'lows' },
  { title: 'Debt', dataIndex: 'debt' },
];

// fields in the addOwner pop-up
const newOwnFormFields = [
  { name: "username", label: "Username", formItem: <Input />, },
  { name: "firstName", label: "First Name", formItem: <Input />, },
  { name: "lastName", label: "Last Name", formItem: <Input />, },
  { name: "address", label: "Address", formItem: <Input />, },
  { name: "birthdate", label: "Birthdate", formItem: <DatePicker />, },
];


// get data from DB for ownerView table
export const Owners = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const fetchData = () => {
    setLoading(true);
    fetch(`/api/owners/view`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);


  // Add owner Popup and error handling
    const [newOwnDialogOpen, setNewOwnDialogOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();
    const [notificationApi, contextHolder] = notification.useNotification();
    const popMessage = (message, description, type) => {
      notificationApi[type || 'open']({
        message,
        description,
      });
    };
    const newOwnDialogOk = () => {
      setConfirmLoading(true);
      form.submit()
    };
    const onFinish = (values) => {
      fetch('/api/owners', {
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
            popMessage('Failed to add owner', 'Please check the form fields. ', 'warning');
          } else {
            fetchData();
            setNewOwnDialogOpen(false);
            popMessage('Success', `Owner added successfully!`, 'success');
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

  // Render the Owners Page
    return (
      <>
        {contextHolder}
        <Row className='page-content' gutter={[16, 8]}>
          <Col span={24} style={{paddingTop: 16}}>
            <Space style={{float: 'right'}}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setNewOwnDialogOpen(true)}
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

        <Modal
          title="New Owner"
          okText="Add Owner"
          open={newOwnDialogOpen}
          onOk={newOwnDialogOk}
          confirmLoading={confirmLoading}
          onCancel={() => setNewOwnDialogOpen(false)}
        >
          <Form
            form={form}
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}
            requiredMark="optional"
            name="ownForm"
            onFinish={onFinish}
            onFinishFailed={() => setConfirmLoading(false)}
          >
            {newOwnFormFields.map(e =>
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

export default Owners