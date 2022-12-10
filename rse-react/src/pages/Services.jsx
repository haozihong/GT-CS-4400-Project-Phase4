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

// fields in the manageService pop-up
const manageServFormFields = [                            // #################################
  { name: "manager", label: "Manager Username", formItem: <Input />,
     rules: [{ required: true, }], },
  { name: "id", label: "Service ID", formItem: <Input />,
     rules: [{ required: true, }], },
];

// fields in the hireEmp pop-up
const hireEmpFormFields = [                               // #################################
  { name: "username", label: "Employee Username", formItem: <Input />,
     rules: [{ required: true, }], },
  { name: "id", label: "Service ID", formItem: <Input />,
     rules: [{ required: true, }], },
];

// fields in the fireEmp pop-up
const fireEmpFormFields = [                               // #################################
  { name: "username", label: "Employee Username", formItem: <Input />,
     rules: [{ required: true, }], },
  { name: "id", label: "Service ID", formItem: <Input />,
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
  const [manageServDialogOpen, setManageServDialogOpen] = useState(false);  // #################################
  const [hireEmpDialogOpen, setHireEmpDialogOpen] = useState(false);  // #################################
  const [fireEmpDialogOpen, setFireEmpDialogOpen] = useState(false);  // #################################
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formNewServ] = Form.useForm();
  const [formManageServ] = Form.useForm();
  const [formHireEmp] = Form.useForm();
  const [formFireEmp] = Form.useForm();
  const [notificationApi, contextHolder] = notification.useNotification();
  const popMessage = (message, description, type) => {
    notificationApi[type || 'open']({
      message,
      description,
    });
  };
  const newServDialogOk = () => {
    setConfirmLoading(true);
    formNewServ.submit()
  };
  const manageServDialogOk = () => {       // ############################################################################
    setConfirmLoading(true);
    formManageServ.submit()
  };
  const hireEmpDialogOk = () => {         // ############################################################################
    setConfirmLoading(true);
    formHireEmp.submit()
  };
  const fireEmpDialogOk = () => {         // ############################################################################
    setConfirmLoading(true);
    formFireEmp.submit()
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
          popMessage('Success', `Service added successfully!`, 'success');
          formNewServ.resetFields();
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

  const onFinishManage = (values) => {            // ######################################## Added new onFinish
    fetch('/api/services', {
      method: 'PUT',                            // ######################################## Set to PUT method since updating, not creating
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
          popMessage('Failed to manage service', 'Please check the form fields. ', 'warning');  //##########################
        } else {
          fetchData();
          setManageServDialogOpen(false);
          popMessage('Success', `Service managed successfully!`, 'success');            // ############################
          formManageServ.resetFields();
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

  const onFinishHireEmp = (values) => {            // ######################################## Added new onFinish
    fetch('/api/employees/hire?username=' + values.username + "&id=" + values.id, {
      method: 'POST',                            // ######################################## Set to POST method since adding
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
          popMessage('Failed to hire employee', 'Please check the form fields. ', 'warning');  //##########################
        } else {
          fetchData();
          setHireEmpDialogOpen(false);
          popMessage('Success', `Employee hired successfully!`, 'success');            // ############################
          formHireEmp.resetFields();
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

  const onFinishFireEmp = (values) => {            // ######################################## Added new onFinish
    fetch('/api/employees/fire?username=' + values.username + "&id=" + values.id, {
      method: 'DELETE',                            // ######################################## Set to DELETE method since deleting
    })
      .then(res => {
        if (!res.ok) return res.json().then(r => Promise.reject(r));
        return res.json();
      })
      .then(data => {
        if (data === 0) {
          popMessage('Failed to fire employee', 'Please check the form fields. ', 'warning');  //##########################
        } else {
          fetchData();
          setFireEmpDialogOpen(false);
          popMessage('Success', `Employee fired successfully!`, 'success');            // ############################
          formFireEmp.resetFields();
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
            <Button                                       // ############################## Added new hireEmployee button
              type="default"                            // ###################### changed button to default type, only 1 primary allowed
              onClick={() => setHireEmpDialogOpen(true)}     // ################ set onclick popup open
            >
              Hire Employee
            </Button>
            <Button                                       // ############################## Added new fireEmployee button
              type="default"                            // ###################### changed button to default type, only 1 primary allowed
              onClick={() => setFireEmpDialogOpen(true)}     // ################ set onclick popup open
            >
              Fire Employee
            </Button>
            <Button                                       // ############################## Added new manageService button
              type="default"                            // ###################### changed button to default type, only 1 primary allowed
              onClick={() => setManageServDialogOpen(true)}     // ################ set onclick popup open
            >
              Manage Service
            </Button>
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
          form={formNewServ}
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

      <Modal                            // ################################ Added entire new Modal for manage service
        title="Manage Service"
        okText="Manage Service"
        open={manageServDialogOpen}
        onOk={manageServDialogOk}
        confirmLoading={confirmLoading}
        onCancel={() => setManageServDialogOpen(false)}
      >
        <Form
          form={formManageServ}
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          requiredMark="optional"
          name="manageServForm"
          onFinish={onFinishManage}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          {manageServFormFields.map(e =>
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
      <Modal                            // ################################ Added entire new Modal for hire employee
        title="Hire Employee"
        okText="Hire Employee"
        open={hireEmpDialogOpen}
        onOk={hireEmpDialogOk}
        confirmLoading={confirmLoading}
        onCancel={() => setHireEmpDialogOpen(false)}
      >
        <Form
          form={formHireEmp}
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          requiredMark="optional"
          name="hireEmpForm"
          onFinish={onFinishHireEmp}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          {hireEmpFormFields.map(e =>
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
      <Modal                            // ################################ Added entire new Modal for fire employee
        title="Fire Employee"
        okText="Fire Employee"
        open={fireEmpDialogOpen}
        onOk={fireEmpDialogOk}
        confirmLoading={confirmLoading}
        onCancel={() => setFireEmpDialogOpen(false)}
      >
        <Form
          form={formFireEmp}
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          requiredMark="optional"
          name="fireEmpForm"
          onFinish={onFinishFireEmp}
          onFinishFailed={() => setConfirmLoading(false)}
        >
          {fireEmpFormFields.map(e =>
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