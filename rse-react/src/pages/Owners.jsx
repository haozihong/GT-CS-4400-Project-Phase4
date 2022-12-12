import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Col, Row, Input, DatePicker, notification, Tooltip } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { FormModal } from "../components/FormModal";

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

export const Owners = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  // get data from DB for ownerView table
  const fetchData = () => {
    setLoading(true);
    fetch(`/api/owners/view`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  };

  const fetchAllData = () => {
    fetchData();
  };
    
  useEffect(() => {
    fetchAllData();
  }, []);


  // Add owner Popup and error handling
    const [newOwnDialogOpen, setNewOwnDialogOpen] = useState(false);
    const [notificationApi, contextHolder] = notification.useNotification();
    const popMessage = (message, description, type) => {
      notificationApi[type || 'open']({
        message,
        description,
      });
    };

    const newOwnFormFields = [
      { name: "username", label: "Username", formItem: <Input />, },
      { name: "firstName", label: "First Name", formItem: <Input />, },
      { name: "lastName", label: "Last Name", formItem: <Input />, },
      { name: "address", label: "Address", formItem: <Input />, },
      { name: "birthdate", label: "Birthdate", formItem: <DatePicker />, },
    ];

    const newOwnFormFinishArgs = {
      fetchConfig: values => ([
        `/api/owners`,
        {
          method: 'POST',
          body: JSON.stringify(values),
          headers: { 'Content-type': 'application/json; charset=UTF-8', },
        }
      ]),
      succDecs: 'Owner added successfully!',
      failMsg: 'Failed to add owner',
    };

  // Render the Owners Page
    return (
      <>
        {contextHolder}
        <Row className='page-content' gutter={[16, 8]}>
          <Col span={24} style={{paddingTop: 16}}>
            <Space style={{float: 'right'}}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setNewOwnDialogOpen(true)}>
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

        <FormModal
          dialogOpenState={[newOwnDialogOpen, setNewOwnDialogOpen]}
          formFields={newOwnFormFields}
          formFinishArgs={newOwnFormFinishArgs}
          refreshFn={fetchAllData}
          popMessage={popMessage}
          title='New Owner'
          okText='Add Owner'
        />
      </>
    );
  }

export default Owners