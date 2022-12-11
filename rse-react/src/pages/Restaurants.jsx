import React, { useEffect, useState } from "react";
import {
  Table,
  Space,
  Button,
  Col,
  Row,
  Modal,
  Form,
  Input,
  InputNumber,
  notification,
  Tooltip,
} from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";

// print table
const columns = [
  { title: "Name", dataIndex: "longName" },
  { title: "Rating", dataIndex: "rating" }, //这个地方就是直接给数字是吗
  { title: "Spent", dataIndex: "spent", render: (e) => `$${e}` },
  { title: "Funded By", dataIndex: "fundedBy" },
  { title: "Location", dataIndex: "location" },
];

// pop_form
const newRestaurantFormFields = [
  {
    name: "longName",
    label: "Restaurant name",
    formItem: <Input />,
  },
  {
    name: "rating",
    label: "Rating",
    formItem: <InputNumber />,
    rules: [{ required: true }, { type: "number", min: 0 }],
  },
  {
    name: "spent",
    label: "Money Spend ($)",
    formItem: <InputNumber />,
    rules: [{ required: true }, { type: "number", min: 0 }],
  },
  // {
  //   name: "fundedBy",
  //   label: "Funded By",
  //   formItem: <Input />,
  // },
  {
    name: "location",
    label: "Restaurant Location",
    formItem: <Input />,
  },
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

  useEffect(() => {
    fetchData();
  }, []);

  // add restaurant
  const [newRestaurDialogOpen, setNewRestaurDialogOpen] = useState(false);
  const [formAdd] = Form.useForm();
  //purchase ingredients
  const [purchaseIngredDialogOpen, setPurchseIngreDialogOpen] = useState(false);
  const [formPurchase] = Form.useForm();
  //start_funding
  const [startFundingDialogOpen, setStartFundingDialogOpen] = useState(false);
  const [formFunding] = Form.useForm();
  //loading
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [notificationApi, contextHolder] = notification.useNotification();
  const popMessage = (message, description, type) => {
    notificationApi[type || "open"]({
      message,
      description,
    });
  };
  //Add new Restaurant
  const newRestaurDialogOk = () => {
    setConfirmLoading(true);
    formAdd.submit();
  };

  //Purchase
  const purchaseIngredDialogOk = () => {
    setConfirmLoading(true);
    formPurchase.submit();
  };
  //start funding
  const startFundingDialogOk = () => {
    setConfirmLoading(true);
    formFunding.submit();
  };

  //Finish add restaurant
  const onFinishRestaurant = (values) => {
    console.log(JSON.stringify(values));
    console.log("成功1");
    fetch("/api/restaurants", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json; charset = UTF-8",
      },
    })
      .then((res) => {
        if (!res.ok) return res.json().then((r) => Promise.reject(r));
        return res.json();
      })
      .then(
        (data) => {
          if (data === 0) {
            popMessage(
              "Fail to add restaurant",
              "Please check the form fields.",
              "warning"
            );
          } else {
            fetchData();
            setNewRestaurDialogOpen(false);
            popMessage("Success", `Restaurant added seccessfully!`, "success");
            formAdd.resetFields();
          }
        },
        (err) => {
          console.log("err", err);
          popMessage(
            `Server error ${err.status}`,
            `${err.error}${err.message}`,
            "error"
          );
        }
      )
      .catch((err) => {
        popMessage(
          "Fetch Fail",
          "There has been a problem with your fetch operation",
          "error"
        );
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  // Finish purchase
  const onFinishPurchase = (values) => {
    fetch("/api/restaurants/purchase", {
      method: "PUT",
      body: new URLSearchParams(values),
      //JSON.stringify(values),
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset = UTF-8",
      },
    })
      .then((res) => {
        if (!res.ok) return res.json().then((r) => Promise.reject(r));
        return res.json();
      })
      .then(
        (data) => {
          if (data === 0) {
            popMessage(
              "Fail to Purchase your target ingredients",
              "Please check the form fields.",
              "warning"
            );
          } else {
            fetchData();
            setPurchseIngreDialogOpen(false);
            popMessage("Success", `Purchased seccessfully!`, "success");
            formPurchase.resetFields();
          }
        },
        (err) => {
          console.log("err", err);
          popMessage(
            `Server error ${err.status}`,
            `${err.error}${err.message}`,
            "error"
          );
        }
      )
      .catch((err) => {
        popMessage(
          "Fetch Fail",
          "There has been a problem with your fetch operation",
          "error"
        );
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  // Finish Funding
  const onFinishFunding = (values) => {
    console.log("成功进了！");
    fetch("/api/restaurants", {
      method: "PUT",
      body: JSON.stringify(values),
      headers: {
        "content-type": "application/json; charset = UTF-8",
      },
    })
      .then((res) => {
        if (!res.ok) return res.json().then((r) => Promise.reject(r));
        return res.json();
      })
      .then(
        (data) => {
          if (data === 0) {
            popMessage(
              "Fail to Fund your target restaurant",
              "Please check the form fields.",
              "warning"
            );
          } else {
            fetchData();
            setStartFundingDialogOpen(false);
            popMessage("Success", `Funding seccessfully!`, "success");
            formFunding.resetFields();
          }
        },
        (err) => {
          console.log("err", err);
          popMessage(
            `Server error ${err.status}`,
            `${err.error}${err.message}`,
            "error"
          );
        }
      )
      .catch((err) => {
        popMessage(
          "Fetch Fail",
          "There has been a problem with your fetch operation",
          "error"
        );
      });
    console.log("loading").finally(() => {
      setConfirmLoading(false);
    });
  };

  return (
    <>
      {contextHolder}
      <Row className="page-content" gutter={[16, 8]}>
        <Col span={24} style={{ paddingTop: 16 }}>
          <Space style={{ float: "right" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setNewRestaurDialogOpen(true)}
            >
              Add
            </Button>

            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={() => setPurchseIngreDialogOpen(true)}
            >
              Purchase Ingredient
            </Button>

            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={() => setStartFundingDialogOpen(true)}
            >
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
            rowKey={(record) => record.longName} // 我觉得是这里的问题，是需要用PK嘛
            dataSource={data}
            loading={loading}
          />
        </Col>
      </Row>

      {/* ADD Restaurant */}
      <Modal
        title="New Restaurant"
        okText="Add Restaurant"
        open={newRestaurDialogOpen}
        onOk={newRestaurDialogOk}
        confirmLoading={confirmLoading}
        onCancel={() => setNewRestaurDialogOpen(false)}
      >
        <Form
          form={formAdd}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          requiredMark="optional"
          name="empForm"
          onFinish={onFinishRestaurant}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          {newRestaurantFormFields.map((e) => (
            <Form.Item
              name={e.name}
              label={e.label}
              rules={e.rules || [{ required: true }]}
            >
              {e.formItem}
            </Form.Item>
          ))}
        </Form>
      </Modal>

      {/* Purchase Ingredients */}
      <Modal
        title="Purchase Ingredients"
        okText="Purchase Ingredients"
        open={purchaseIngredDialogOpen}
        onOk={purchaseIngredDialogOk}
        confirmLoading={confirmLoading}
        onCancel={() => setPurchseIngreDialogOpen(false)}
      >
        <Form
          form={formPurchase}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          requiredMark="optional"
          name="empForm"
          onFinish={onFinishPurchase}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          <Form.Item
            name="longName"
            label="Restaurant name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="id"
            label="Delivery Services ID"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="tag"
            label="Drone's Tag"
            rules={[{ required: true }, { type: "number", min: 0 }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            name="barcode"
            label="Ingredient barcode"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true }, { type: "number", min: 0 }]}
          >
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>

      {/* Start Funding */}
      <Modal
        title="Start Funding"
        okText="Start Funding"
        open={startFundingDialogOpen}
        onOk={startFundingDialogOk}
        confirmLoading={confirmLoading}
        onCancel={() => setStartFundingDialogOpen(false)}
      >
        <Form
          form={formFunding}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          requiredMark="optional"
          name="empForm"
          onFinish={onFinishFunding}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          <Form.Item
            name="longName"
            label="Restaurant name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="fundedBy" label="Owner" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Restaurants;
