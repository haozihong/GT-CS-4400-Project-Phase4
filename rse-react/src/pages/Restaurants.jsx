import React, { useEffect, useState } from "react";
import {
  Table,
  Space,
  Button,
  Col,
  Row,
  Input,
  InputNumber,
  Select,
  notification,
  Tooltip,
} from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { FormModal } from "../components/FormModal";

const columns = [
  { title: "Name", dataIndex: "longName" },
  { title: 'Rating', dataIndex: 'rating', render: e => `★${e}`, },
  { title: "Spent", dataIndex: "spent", render: (e) => `$${e}` },
  { title: "Funded By", dataIndex: "fundedBy" },
  { title: "Location", dataIndex: "location" },
];

export const Restaurants = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const fetchData = () => {
    setLoading(true);
    fetch(`/api/restaurants/view`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  };

  const [drones, setDrones] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [locations, setLocations] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [owners, setOwners] = useState([]);
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
    fetchDataBg('/api/restaurants', setRestaurants);
    fetchDataBg('/api/owners', setOwners);
  };
    
  useEffect(() => {
    fetchAllData();
  }, []);

  const [newRestaurDialogOpen, setNewRestaurDialogOpen] = useState(false);
  const [purchaseIngredDialogOpen, setPurchseIngreDialogOpen] = useState(false);
  const [startFundingDialogOpen, setStartFundingDialogOpen] = useState(false);

  const [notificationApi, contextHolder] = notification.useNotification();
  const popMessage = (message, description, type) => {
    notificationApi[type || "open"]({
      message,
      description,
    });
  };


  const addFormFields = [
    { name: "longName", label: "Restaurant name", formItem: <Input />, },
    {
      name: "rating",
      label: "Rating",
      formItem: <InputNumber />,
      rules: [{ required: true }, { type: "number", min: 1, max: 5 }],
    },
    {
      name: "spent",
      label: "Money Spent ($)",
      formItem: <InputNumber />,
      rules: [{ required: true }, { type: "number", min: 0 }],
    },
    {
      name: "location",
      label: "Restaurant Location",
      formItem: 
        <Select
          placeholder='Select a location'
          options={locations.map(e => ({ label: e.label, value: e.label }))}
        />,
    },
  ];

  const purchaseFormFields = [
    {
      name: 'longName',
      label: 'Restaurant name',
      formItem: 
        <Select
          placeholder='Select a restaurant'
          options={restaurants.map(e => ({ label: e.longName, value: e.longName }))}
        />,
    },
    { name: 'id', formItem: <Input /> , hidden: true},
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
    {
      name: 'barcode',
      label: 'Ingredient barcode',
      formItem: 
        <Select
          placeholder='Select an ingredient'
          options={ingredients.map(e => ({ label: `${e.iname} (${e.barcode})`, value: e.barcode }))}
        />,
    },
    {
      name: 'quantity',
      label: 'Quantity',
      formItem: <InputNumber />,
      rules: [{ required: true }, { type: "number", min: 0 }],
    },
  ];

  const fundingFormFields = [
    {
      name: 'fundedBy',
      label: 'Owner Username',
      formItem: 
        <Select
          placeholder='Select a owner'
          options={owners.map(e => ({ label: e.username, value: e.username }))}
        />,
    },
    {
      name: 'longName',
      label: 'Restaurant name',
      formItem: 
        <Select
          placeholder='Select a restaurant'
          options={restaurants.map(e => ({ label: e.longName, value: e.longName }))}
        />,
    },
  ];

  const addFormFinishArgs = {
    fetchConfig: values => ([
      `/api/restaurants`, 
      {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-type": "application/json; charset = UTF-8", },
      }
    ]),
    succDecs: 'Restaurant added seccessfully!',
    failMsg: 'Fail to add restaurant',
  }

  const purchaseFormFinishArgs = {
    fetchConfig: values => ([
      `/api/restaurants/purchase`, 
      {
        method: "PUT",
        body: new URLSearchParams(values),
        headers: { "Content-type": "application/x-www-form-urlencoded; charset = UTF-8", },
      }
    ]),
    succDecs: 'Purchased seccessfully!',
    failMsg: 'Fail to purchase the ingredients',
  }

  const fundingFormFinishArgs = {
    fetchConfig: values => ([
      `/api/restaurants`, 
      {
        method: "PUT",
        body: JSON.stringify(values),
        headers: { "content-type": "application/json; charset = UTF-8", },
      }
    ]),
    succDecs: 'Funding seccessfully!',
    failMsg: 'Fail to Fund the restaurant',
  }

  return (
    <>
      {contextHolder}
      <Row className="page-content" gutter={[16, 8]}>
        <Col span={24} style={{ paddingTop: 16 }}>
          <Space style={{ float: "right" }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setNewRestaurDialogOpen(true)}>
              Add
            </Button>

            <Button icon={<PlusOutlined />} onClick={() => setPurchseIngreDialogOpen(true)}>
              Purchase Ingredient
            </Button>

            <Button icon={<PlusOutlined />} onClick={() => setStartFundingDialogOpen(true)}>
              Start Funding
            </Button>

            <Tooltip title="refresh">
              <Button
                type="text"
                shape="circle"
                icon={<ReloadOutlined />}
                onClick={() => fetchData()}
              />
            </Tooltip>
          </Space>
        </Col>

        <Col span={24}>
          <Table
            columns={columns}
            rowKey={(record) => record.longName}
            dataSource={data}
            loading={loading}
            pagination={{ showSizeChanger: true }}
          />
        </Col>
      </Row>

      <FormModal
        dialogOpenState={[newRestaurDialogOpen, setNewRestaurDialogOpen]}
        formFields={addFormFields}
        formFinishArgs={addFormFinishArgs}
        refreshFn={fetchAllData}
        popMessage={popMessage}
        title='New Restaurant'
        okText='Add Restaurant'
      />

      <FormModal
        dialogOpenState={[purchaseIngredDialogOpen, setPurchseIngreDialogOpen]}
        formFields={purchaseFormFields}
        formFinishArgs={purchaseFormFinishArgs}
        refreshFn={fetchAllData}
        popMessage={popMessage}
        title='Purchase Ingredients'
        okText='Purchase Ingredients'
      />

      <FormModal
        dialogOpenState={[startFundingDialogOpen, setStartFundingDialogOpen]}
        formFields={fundingFormFields}
        formFinishArgs={fundingFormFinishArgs}
        refreshFn={fetchAllData}
        popMessage={popMessage}
        title='Start Funding'
        okText='Start Funding'
      />
    </>
  );
};

export default Restaurants;
