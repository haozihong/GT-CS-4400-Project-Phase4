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
import { PlusOutlined, MinusOutlined, ReloadOutlined } from "@ant-design/icons";
//import { set } from 'date-fns';

const columns = [
  { title: "Service ID", dataIndex: "id" },
  { title: "Drone Tag", dataIndex: "tag" },
  { title: "Fuel", dataIndex: "fuel" },
  { title: "Capacity", dataIndex: "capacity" },
  { title: "Sales", dataIndex: "sales", render: (e) => `$${e}` },
  { title: "Flown By", dataIndex: "flownBy" },
  { title: "Location", dataIndex: "hover" },
  { title: "Leader Drone Id", dataIndex: "swarmId" },
  { title: "Leader Drone Tag", dataIndex: "swarmTag" },
];
const loadDroneFormFields = [
  { name: "droneId", label: "Drone Id", formItem: <Input /> },
  {
    name: "tag",
    label: "Drone Tag",
    formItem: <InputNumber />,
    rules: [{ required: true }, { type: "number", min: 0 }],
  },
  { name: "barcode", label: "Ingredient Barcode", formItem: <Input /> },
  {
    name: "more package",
    label: "new Package Amount",
    formItem: <InputNumber />,
    rules: [{ required: true }, { type: "number", min: 0 }],
  },
  {
    name: "Price",
    label: "Price ($)",
    formItem: <InputNumber />,
    rules: [{ required: true }, { type: "number", min: 0 }],
  },
];

const refuelDroneFormFields = [
  { name: "droneId", label: "Drone Id", formItem: <Input /> },
  {
    name: "tag",
    label: "Drone Tag",
    formItem: <InputNumber />,
    rules: [{ required: true }, { type: "number", min: 0 }],
  },
  {
    name: "Refuel",
    label: "Refuel Amount",
    formItem: <InputNumber />,
    rules: [{ required: true }, { type: "number", min: 0 }],
  },
];

const droneFormFields = [
  { name: "droneId", label: "Drone Id", formItem: <Input /> },
  {
    name: "tag",
    label: "Drone Tag",
    formItem: <InputNumber />,
    rules: [{ required: true }, { type: "number", min: 0 }],
  },
  {
    name: "Fuel",
    label: "Fuel Amount",
    formItem: <InputNumber />,
    rules: [{ required: true }, { type: "number", min: 0 }],
  },
  {
    name: "capacity",
    label: "Capacity",
    formItem: <InputNumber />,
    rules: [{ required: true }, { type: "number", min: 0 }],
  },
  {
    name: "sales",
    label: "sales",
    formItem: <InputNumber />,
    rules: [{ required: true }, { type: "number", min: 0 }],
  },
  { name: "flownBy", label: "Flown By", formItem: <Input /> },
  { name: "HeaderDroneId", label: "Header Drone Id", formItem: <Input /> },
  {
    name: "HeaderDroneTag",
    label: "Header Drone Tag",
    formItem: <InputNumber />,
    rules: [{ required: true }, { type: "number", min: 0 }],
  },
  { name: "hover", label: "Hover", formItem: <Input /> },
  { name: "destination", label: "Destination", formItem: <Input /> },
];

export const Drones = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const fetchData = () => {
    setLoading(true);
    fetch(`/api/drones/view`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 所有对drones的操作 and error handling
  // constant 集合
  // load_drone()
  const [LoadDroneDialogOpen, setLoadDroneDialogOpen] = useState(false);

  // refuel_drone()
  const [refuelDroneDialogOpen, setRefuelDroneDialogOpen] = useState(false);

  // leave_swarm()
  const [leaveSwarmDialogOpen, setLeaveSwarmDialogOpen] = useState(false);

  // join_swarm()
  const [joinSwarmDialogOpen, setJoinSwarmDialogOpen] = useState(false);

  // fly_drone()
  const [flyDroneDialogOpen, setFlyDroneDialogOpen] = useState(false);

  // add_drone()
  const [addDroneDialogOpen, setAddDroneDialogOpen] = useState(false);
  // remove_drone()
  const [removeDroneDialogOpen, setRemoveDroneDialogOpen] = useState(false);

  //loading
  const [confirmLoading, setConfirmLoading] = useState(false);

  // form 集合
  //load_drone()_form
  const [formLoad] = Form.useForm();
  // refuel_drone()_form
  const [formRefuel] = Form.useForm();
  // leave_swarm()_form
  const [formLeave] = Form.useForm();
  // join_swarm()_form
  const [formJoin] = Form.useForm();
  // fly_drone()_form
  const [formFly] = Form.useForm();
  //+- drone_form
  const [formAdd] = Form.useForm();
  const [formRemove] = Form.useForm();

  const [notificationApi, contextHolder] = notification.useNotification();
  const popMessage = (message, description, type) => {
    notificationApi[type || "open"]({
      message,
      description,
    });
  };
  //DialogOK collection:
  // Drone 直接的操作
  //load_drone()_form
  const loadDroneDialogOk = () => {
    setConfirmLoading(true);
    formLoad.submit();
  };
  // refuel_drone()_form
  const refuelDroneDialogOk = () => {
    setConfirmLoading(true);
    formRefuel.submit();
  };
  // fly_drone()_form
  const flyDroneDialogOk = () => {
    setConfirmLoading(true);
    formFly.submit();
  };

  // 和SWARM相关的操作
  // leave_swarm()_form
  const leaveSwarmDialogOk = () => {
    setConfirmLoading(true);
    formLeave.submit();
  };
  // join_swarm()_form
  const joinSwarmDialogOk = () => {
    setConfirmLoading(true);
    formJoin.submit();
  };

  // 每个页面的基础操作
  // add drone
  const addDroneDialogOk = () => {
    setConfirmLoading(true);
    formAdd.submit();
  };
  // remove drone
  const removeDroneDialogOk = () => {
    setConfirmLoading(true);
    formRemove.submit();
  };

  // Finish Load Drone
  const onFinishLoad = (values) => {
    fetch("/api/drones/loading/{id}/{tag}", {
      method: "PUT",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
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
              "Fail to Load Drone",
              "Please check the form fields. ",
              "warning"
            );
          } else {
            fetchData();
            setLoadDroneDialogOpen(false);
            popMessage(
              "Success",
              `This Drone was loaded seccessfully!`,
              "success"
            );
            formLoad.resetFields();
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

  // Finish Refuel Drone
  const onFinishRefuel = (values) => {
    fetch("/api/drones/loading/{id}/{tag}", {
      method: "PUT",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
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
              "Fail to Load Drone",
              "Please check the form fields. ",
              "warning"
            );
          } else {
            fetchData();
            setRefuelDroneDialogOpen(false);
            popMessage(
              "Success",
              `This Drone was loaded seccessfully!`,
              "success"
            );
            formRefuel.resetFields();
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

  // Finish Fly Drone
  const onFinishFly = (values) => {
    fetch("/api/drones/fly", {
      method: "PUT",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => {
        if (!res.ok) return res.json().then((r) => Promise.reject(r));
        return res.json();
      })
      .then(
        (data) => {
          if (data === 0) {
            //我觉得这个地方是不是要变一下
            popMessage(
              "Cannot make this drone flying",
              "Please check the form fields. ",
              "warning"
            );
          } else {
            fetchData();
            setFlyDroneDialogOpen(false);
            popMessage(
              "Success",
              `This Drone has Flied away already !`,
              "success"
            );
            formFly.resetFields();
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

  // Finish Leave swarm
  const onFinishLeave = (values) => {
    fetch("/api/drones/swarms", {
      method: "DELETE",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
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
              "Cannot leave the swarm",
              "Please check the form fields. ",
              "warning"
            );
          } else {
            fetchData();
            setLeaveSwarmDialogOpen(false);
            popMessage(
              "Success",
              `This Drone has left swarm already!`,
              "success"
            );
            formLeave.resetFields();
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

  // Finish Join swarm
  const onFinishJoin = (values) => {
    fetch("/api/drones/swarms", {
      method: "PUT",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
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
              "Cannot join the swarm",
              "Please check the form fields. ",
              "warning"
            );
          } else {
            fetchData();
            setJoinSwarmDialogOpen(false);
            popMessage(
              "Success",
              `This Drone was joined swarm seccessfully!`,
              "success"
            );
            formJoin.resetFields();
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

  // Finish Add Drone
  const onFinishAdd = (values) => {
    fetch("/api/drones", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
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
              "Fail to add Drone",
              "Please check the form fields. ",
              "warning"
            );
          } else {
            fetchData();
            setAddDroneDialogOpen(false);
            popMessage(
              "Success",
              `New Drone was added seccessfully!`,
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
  // Finish remove Drone:
  const onFinishRemove = (values) => {
    fetch("/api/drones/{id}/{tag}", {
      method: "DELETE",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
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
              "Fail to remove Drone",
              "Please check the form fields. ",
              "warning"
            );
          } else {
            fetchData();
            setRemoveDroneDialogOpen(false);
            popMessage(
              "Success",
              `New Drone was removed seccessfully!`,
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

  // 呈现在HTML上
  return (
    <>
      {contextHolder}
      <Row className="page-content" gutter={[16, 8]}>
        <Col span={24} style={{ paddingTop: 16 }}>
          <Space style={{ float: "right" }}>
            {/* Load button */}
            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={() => setLoadDroneDialogOpen(true)}
            >
              Load Drone
            </Button>

            {/* refuel button */}
            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={() => setRefuelDroneDialogOpen(true)}
            >
              Refuel Drone
            </Button>

            {/* FLY button */}
            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={() => setFlyDroneDialogOpen(true)}
            >
              Fly Drone
            </Button>

            {/* ADD button */}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddDroneDialogOpen(true)}
            >
              Add Drone
            </Button>

            {/* Remove button */}
            <Button
              type="default"
              icon={<MinusOutlined />}
              onClick={() => setRemoveDroneDialogOpen(true)}
            >
              Remove Drone
            </Button>

            {/* leave button */}
            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={() => setLeaveSwarmDialogOpen(true)}
            >
              Leave Swarm
            </Button>

            {/* Join button */}
            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={() => setJoinSwarmDialogOpen(true)}
            >
              Join Swarm
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
            rowKey={(record) => record.username}
            dataSource={data}
            loading={loading}
          />
        </Col>
      </Row>

      {/* Load modal + form */}
      <Modal
        title="Load Drone"
        okText="Load Drone"
        open={LoadDroneDialogOpen}
        onOk={loadDroneDialogOk}
        confirmLoading={confirmLoading}
        onCancel={() => setLoadDroneDialogOpen(false)}
      >
        <Form
          form={formLoad}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          requiredMark="optional"
          name="empForm"
          onFinish={onFinishLoad}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          {loadDroneFormFields.map((e) => (
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

      {/* refuel_drone modal + form */}
      <Modal
        title="refuel Drone"
        okText="Load Drone"
        open={refuelDroneDialogOpen}
        onOk={refuelDroneDialogOk}
        confirmLoading={confirmLoading}
        onCancel={() => setRefuelDroneDialogOpen(false)}
      >
        <Form
          form={formLoad}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          requiredMark="optional"
          name="empForm"
          onFinish={onFinishRefuel}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          {refuelDroneFormFields.map((e) => (
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

      {/* fly_drone modal + form */}
      <Modal
        title="Fly Drone"
        okText="Fly Drone"
        open={flyDroneDialogOpen}
        onOk={flyDroneDialogOk}
        confirmLoading={confirmLoading}
        onCancel={() => setFlyDroneDialogOpen(false)}
      >
        <Form
          form={formLoad}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          requiredMark="optional"
          name="empForm"
          onFinish={onFinishFly}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          {droneFormFields.map((e) => (
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

      {/* leave swarm modal + form */}
      <Modal
        title="Leave Swarm"
        okText="Leave Swarm"
        open={leaveSwarmDialogOpen}
        onOk={leaveSwarmDialogOk}
        confirmLoading={confirmLoading}
        onCancel={() => setLeaveSwarmDialogOpen(false)}
      >
        <Form
          form={formLoad}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          requiredMark="optional"
          name="empForm"
          onFinish={onFinishLeave}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          {droneFormFields.map((e) => (
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

      {/* join swarm modal + form */}
      <Modal
        title="Join Swarm"
        okText="Join Swarm"
        open={joinSwarmDialogOpen}
        onOk={joinSwarmDialogOk}
        confirmLoading={confirmLoading}
        onCancel={() => setJoinSwarmDialogOpen(false)}
      >
        <Form
          form={formLoad}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          requiredMark="optional"
          name="empForm"
          onFinish={onFinishJoin}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          {droneFormFields.map((e) => (
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

      {/* add modal + form */}
      <Modal
        title="New Drone"
        okText="Add Drone"
        open={addDroneDialogOpen}
        onOk={addDroneDialogOk}
        confirmLoading={confirmLoading}
        onCancel={() => setAddDroneDialogOpen(false)}
      >
        <Form
          form={formAdd}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          requiredMark="optional"
          name="empForm"
          onFinish={onFinishAdd}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          {droneFormFields.map((e) => (
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

      {/* remove modal + form */}
      <Modal
        title="Remove Drone"
        okText="Remove Drone"
        open={removeDroneDialogOpen}
        onOk={removeDroneDialogOk}
        confirmLoading={confirmLoading}
        onCancel={() => setRemoveDroneDialogOpen(false)}
      >
        <Form
          form={formAdd}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          requiredMark="optional"
          name="empForm"
          onFinish={onFinishRemove}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          <Form.Item
            name="drone_Id"
            label="Drone Id"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="tag"
            label="Drone Tag"
            rules={[{ required: true }, { type: "number", min: 0 }]}
          >
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Drones;
