import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Col, Row, Input, InputNumber, notification, Tooltip  } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { FormModal } from "../components/FormModal";

// columns of locationView table
const columns = [
  { title: 'Label', dataIndex: 'label' },
  { title: 'X Coord', dataIndex: 'xcoord' },
  { title: 'Y Coord', dataIndex: 'ycoord' },
  { title: 'Num of Restaurants', dataIndex: 'numRestaurants' },
  { title: 'Num of Delivery Services', dataIndex: 'numDeliveryServices' },
  { title: 'Num of Drones', dataIndex: 'numDrone' },
];

export const Locations = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  // get data from DB for locationView table
  const fetchData = () => {
    setLoading(true);
    fetch(`/api/locations/view`)
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


// Add location Popup and error handling
  const [newLocDialogOpen, setNewLocDialogOpen] = useState(false);
  const [notificationApi, contextHolder] = notification.useNotification();
  const popMessage = (message, description, type) => {
    notificationApi[type || 'open']({
      message,
      description,
    });
  };

  const addLocFormFields = [
    { name: "label", label: "Label", formItem: <Input />, },
    { name: "xcoord", label: "X Coord", formItem: <InputNumber />, },
    { name: "ycoord", label: "Y Coord", formItem: <InputNumber />, },
    { 
      name: "space", 
      label: "Space", 
      formItem: <InputNumber />,
      rules: [{ required: true, }, { type: 'number', min: 0 }], 
    },
  ];

  const addLocFormFinishArgs = {
    fetchConfig: values => ([
      `/api/locations`, 
      {
        method: 'POST',
        body: JSON.stringify(values),
        headers: { 'Content-type': 'application/json; charset=UTF-8', },
      }
    ]),
    succDecs: 'Location added successfully!',
    failMsg: 'Failed to add location',
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

      <FormModal
        dialogOpenState={[newLocDialogOpen, setNewLocDialogOpen]}
        formFields={addLocFormFields}
        formFinishArgs={addLocFormFinishArgs}
        refreshFn={fetchAllData}
        popMessage={popMessage}
        title='New Location'
        okText='Add Location'
      />
    </>
  );
}

export default Locations