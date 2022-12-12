import React, { useEffect, useState } from "react";
import { Table, Space, Button, Col, Row, Input, InputNumber, Select, notification, Tooltip, } from "antd";
import { PlusOutlined, MinusOutlined, ReloadOutlined } from "@ant-design/icons";
import { FormModal } from "../components/FormModal";

//print table
const columns = [
  { title: "Ingredient Name", dataIndex: "iname" },
  { title: "Barcode", dataIndex: "barcode" },
  { title: "Location", dataIndex: "location" },
  { title: "Amount Available", dataIndex: "amountAvailable" },
  { title: "Low Price", dataIndex: "lowPrice" },
  { title: "High Price", dataIndex: "highPrice" },
];

const App = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const fetchData = () => {
    setLoading(true);
    fetch(`/api/ingredients/view`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  };

  const [ingredients, setIngredients] = useState([]);
  const fetchDataBg = (url, setFn) => {
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setFn(res);
      });
  };

  const fetchAllData = () => {
    fetchData();
    fetchDataBg('/api/ingredients', setIngredients);
  };
    
  useEffect(() => {
    fetchAllData();
  }, []);

  const [addIngredDialogOpen, setAddIngredDialogOpen] = useState(false);
  const [removeIngredDialogOpen, setRemoveIngredDialogOpen] = useState(false);
  const [notificationApi, contextHolder] = notification.useNotification();
  const popMessage = (message, description, type) => {
    notificationApi[type || "open"]({
      message,
      description,
    });
  };

  const addIngredFormFields = [
    { name: 'barcode', label: 'Ingredient Barcode', formItem: <Input />, },
    { name: "iname", label: "Ingredient Name", formItem: <Input />, },
    {
      name: "weight",
      label: "Ingredient Weight",
      formItem: <InputNumber />,
      rules: [{ required: true }, { type: "number", min: 0 }],
    },
  ];

  const removeIngredFormFields = [
    {
      name: 'barcode',
      label: 'Ingredient Barcode',
      formItem: 
        <Select 
          placeholder='Select a ingredient'
          options={ingredients.map(e => ({ label: e.barcode, value: e.barcode }))}
        />,
    },
  ];

  const addIngredFormFinishArgs = {
    fetchConfig: values => ([
      `/api/ingredients`, 
      {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-type": "application/json; charset=UTF-8", },
      }
    ]),
    succDecs: 'Your Ingredients was added seccessfully!',
    failMsg: 'Fail to add ingredients',
  }

  const removeIngredFormFinishArgs = {
    fetchConfig: values => ([
      `/api/ingredients/${values.barcode}`, 
      { method: "DELETE", }
    ]),
    succDecs: 'Your Ingredients was removed seccessfully!',
    failMsg: 'Fail to remove ingredients',
  }

  return (
    <>
      {contextHolder}
      <Row className="page-content" gutter={[16, 8]}>
        <Col span={24} style={{ paddingTop: 16 }}>
          <Space style={{ float: "right" }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddIngredDialogOpen(true)}>
              Add
            </Button>

            <Button icon={<MinusOutlined />} onClick={() => setRemoveIngredDialogOpen(true)}>
              Remove
            </Button>

            <Tooltip title="refresh">
              <Button
                type="text"
                shape="circle"
                icon={<ReloadOutlined />}
                onClick={() => fetchAllData()}
              />
            </Tooltip>
          </Space>
        </Col>

        <Col span={24}>
          <Table
            columns={columns}
            rowKey={(record) => record.iname}
            dataSource={data}
            loading={loading}
            pagination={{ showSizeChanger: true }}
          />
        </Col>
      </Row>

      <FormModal
        dialogOpenState={[addIngredDialogOpen, setAddIngredDialogOpen]}
        formFields={addIngredFormFields}
        formFinishArgs={addIngredFormFinishArgs}
        refreshFn={fetchAllData}
        popMessage={popMessage}
        title='New Ingredients'
        okText='Add Ingredients'
      />

      <FormModal
        dialogOpenState={[removeIngredDialogOpen, setRemoveIngredDialogOpen]}
        formFields={removeIngredFormFields}
        formFinishArgs={removeIngredFormFinishArgs}
        refreshFn={fetchAllData}
        popMessage={popMessage}
        title='Remove Ingredients'
        okText='Remove Ingredients'
      />
    </>
  );
};

export default App;
