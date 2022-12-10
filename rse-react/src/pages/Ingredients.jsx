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
  //DatePicker,
  InputNumber,
  notification,
  Tooltip,
} from "antd";
import { PlusOutlined, MinusOutlined, ReloadOutlined } from "@ant-design/icons";

//print table
const columns = [
  { title: "Ingredient Name", dataIndex: "iname" },
  { title: "Location", dataIndex: "location" },
  { title: "Amount Available", dataIndex: "amountAvailable" },
  { title: "Low Price", dataIndex: "lowPrice" },
  { title: "High Price", dataIndex: "highPrice" },
];

// pop_form
const newIngredFormFields = [
  {
    name: "barcode",
    label: "Ingredient Barcode",
    formItem: <Input />,
  },
  {
    name: "iname",
    label: "Ingredient Name",
    formItem: <Input />,
  },
  {
    name: "weight",
    label: "Ingredient Weight",
    formItem: <InputNumber />,
    rules: [{ required: true }, { type: "number", min: 0 }],
  },
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

  useEffect(() => {
    fetchData();
  }, []);

  //add_操作和variables:
  const [newIngredDialogOpen, setNewIngredDialogOpen] = useState(false);
  const [removeIngredDialogOpen, setRemoveIngredDialogOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formAdd] = Form.useForm();
  const [formRemove] = Form.useForm();
  const [notificationApi, contextHolder] = notification.useNotification();
  const popMessage = (message, description, type) => {
    notificationApi[type || "open"]({
      message,
      description,
    });
  };

  const newIngredDialogOk = () => {
    setConfirmLoading(true);
    formAdd.submit();
  };
  //上传文件
  const onFinishAdd = (values) => {
    //通过api 请求后端相应
    fetch("/api/ingredients", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      //获取成功，请求一个json文件并将其打印到控制台，returns a promise that resolves with a Response object.
      .then((response) => {
        if (!response.ok) return response.json().then((r) => Promise.reject(r));
        return response.json();
      })
      // 添加失败，提出警告
      .then(
        (data) => {
          if (data === 0) {
            popMessage(
              "Fail to add ingredients",
              "Please check the form fields. ",
              "warning"
            );
          } else {
            // 成功添加，给出成功信息
            fetchData();
            setNewIngredDialogOpen(false);
            popMessage(
              "Success",
              `Your Ingredients was added seccessfully!`,
              "success"
            );
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

  //remove_items
  const removeIngredDialogOk = () => {
    setConfirmLoading(true);
    formRemove.submit();
  };

  const onFinishRemove = (values) => {
    //通过api 请求后端相应
    fetch(`/api/ingredients/${values.barcode}`, {
      method: "DELETE", //remove 应该对应get吗
    })
      //获取成功，请求一个json文件并将其打印到控制台，returns a promise that resolves with a Response object.
      .then((response) => {
        if (!response.ok) return response.json().then((r) => Promise.reject(r));
        return response.json();
      })
      // 添加失败，提出警告
      .then(
        (data) => {
          if (data === 0) {
            // 大于原有的amount
            popMessage(
              "Fail to remove ingredients",
              "Please check the form fields. ",
              "warning"
            );
          } else {
            // 成功添加，给出成功信息
            fetchData();
            setNewIngredDialogOpen(false);
            popMessage(
              "Success",
              `Your Ingredients was removed seccessfully!`,
              "success"
            );
            formRemove.resetFields();
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

  return (
    <>
      {contextHolder}
      <Row className="page-content" gutter={[16, 8]}>
        <Col span={24} style={{ paddingTop: 16 }}>
          <Space style={{ float: "right" }}>
            {/*Add button*/}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setNewIngredDialogOpen(true)}
            >
              Add
            </Button>

            {/*Remove button*/}
            <Button
              type="default"
              icon={<MinusOutlined />}
              onClick={() => setRemoveIngredDialogOpen(true)}
            >
              Remove
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
            rowKey={(record) => record.iname}
            dataSource={data}
            loading={loading}
          />
        </Col>
      </Row>

      {/* add 需要的form ++ check box*/}
      <Modal
        title="New Ingredients"
        okText="Add Ingredients"
        open={newIngredDialogOpen}
        onOk={newIngredDialogOk}
        confirmLoading={confirmLoading}
        onCancel={() => setNewIngredDialogOpen(false)}
      >
        <Form
          form={formAdd}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          requiredMark="optional"
          name="ingreForm"
          onFinish={onFinishAdd}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          {/* add 需要form */}
          {newIngredFormFields.map((e) => (
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

      {/* remove 需要的form */}

      <Modal
        title="Remove Ingredients"
        okText="Delete Ingredients"
        open={removeIngredDialogOpen}
        onOk={removeIngredDialogOk}
        confirmLoading={confirmLoading}
        onCancel={() => setRemoveIngredDialogOpen(false)}
      >
        <Form
          form={formRemove}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          requiredMark="optional"
          name="ingreForm"
          onFinish={onFinishRemove}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          {/* showing the pop_up_form */}
          <Form.Item
            name="barcode"
            label="Ingredient Barcode"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default App;
