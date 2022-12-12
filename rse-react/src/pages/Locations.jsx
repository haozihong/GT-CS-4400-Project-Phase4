import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Col, Row, Modal, Form, Input, InputNumber, notification, Tooltip  } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

// columns of locationView table
const columns = [
  { title: 'Label', dataIndex: 'label' },
  { title: 'X Coord', dataIndex: 'xcoord' },
  { title: 'Y Coord', dataIndex: 'ycoord' },
  { title: 'Num of Restaurants', dataIndex: 'numRestaurants' },
  { title: 'Num of Delivery Services', dataIndex: 'numDeliveryServices' },
  { title: 'Num of Drones', dataIndex: 'numDrone' },
];

// fields in the addLocation pop-up
const newLocFormFields = [
  { name: "label", label: "Label", formItem: <Input />,
   rules: [{ required: true, }], },
  { name: "xcoord", label: "X Coord", formItem: <InputNumber />,
   rules: [{ required: true, }, { type: 'number' }], },
  { name: "ycoord", label: "Y Coord", formItem: <InputNumber />,
   rules: [{ required: true, }, { type: 'number' }], },
  { name: "space", label: "Space", formItem: <InputNumber />,
   rules: [{ required: true, }, { type: 'number', min: 0 }], },
];


// get data from DB for locationView table
export const Locations = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const fetchData = () => {
    setLoading(true);
    fetch(`/api/locations/view`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);


// Add location Popup and error handling
  const [newLocDialogOpen, setNewLocDialogOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, contextHolder] = notification.useNotification();
  const popMessage = (message, description, type) => {
    notificationApi[type || 'open']({
      message,
      description,
    });
  };
  const newLocDialogOk = () => {
    setConfirmLoading(true);
    form.submit()
  };
  const onFinish = (values) => {
    fetch('/api/locations', {
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
          popMessage('Failed to add location', 'Please check the form fields. ', 'warning');
        } else {
          fetchData();
          setNewLocDialogOpen(false);
          popMessage('Success', `Location added successfully!`, 'success');
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

// Render the Locations Page
return (
    <>
      {contextHolder}
      <Row className='content' gutter={[16, 8]}>
        <Col span={24} style={{paddingTop: 16}}>
          <Space style={{float: 'right'}}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setNewLocDialogOpen(true)}
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
            rowKey={(record) => record.label}
            dataSource={data}
            loading={loading}
            pagination={{ showSizeChanger: true }}
          />
        </Col>
      </Row>

      <Modal
        title="New Location"
        okText="Add Location"
        open={newLocDialogOpen}
        onOk={newLocDialogOk}
        confirmLoading={confirmLoading}
        onCancel={() => setNewLocDialogOpen(false)}
      >
        <Form
          form={form}
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          requiredMark="optional"
          name="locForm"
          onFinish={onFinish}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          {newLocFormFields.map(e =>
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

export default Locations