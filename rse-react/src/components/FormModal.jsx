import React, { useState } from 'react';
import {
  Modal,
  Form,
} from 'antd';

export const FormModal = ({ dialogOpenState, formFields, formFinishArgs, refreshFn, popMessage, ...props }) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const formDialogOk = (form) => {
    setConfirmLoading(true);
    form.submit()
  };
  const onFinish = (values, args) => {
    fetch(...args.fetchConfig(values))
      .then(res => {
        if (!res.ok) return res.json().then(r => Promise.reject(r));
        return res.json();
      })
      .then(data => {
        if (data === 0) {
          popMessage(args.failMsg || 'Failed', args.failDecs || 'Please check the form fields.', 'warning');
        } else {
          refreshFn();
          dialogOpenState[1](false);
          popMessage(args.succMsg || 'Success', args.succDecs || 'Operation success!', 'success');
          form.resetFields();
        }
      }, err => {
        console.log('err', err);
        popMessage(`Server error ${err.status}`, `${err.error}${err.message}`, 'error');
      })
      .catch((err) => {
        console.log(err);
        popMessage('Fetch Fail', 'There has been a problem with your fetch operation', 'error');
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  const onValuesChangeFillDrone = (values, allValues) => {
    if ('droneFullId' in values) {
      const [id, tag] = values.droneFullId.split('$');
      form.setFieldValue('id', id);
      form.setFieldValue('tag', tag);
    }
  };

  return (
    <Modal
      open={dialogOpenState[0]}
      onOk={() => { formDialogOk(form) }}
      confirmLoading={confirmLoading}
      onCancel={() => dialogOpenState[1](false)}
      {...props}
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        requiredMark='optional'
        name='form'
        onFinish={v => onFinish(v, formFinishArgs)}
        onFinishFailed={() => setConfirmLoading(false)}
        onValuesChange={onValuesChangeFillDrone}
      >
        {formFields.map((e) => (
          <Form.Item
            name={e.name}
            label={e.label}
            rules={e.rules || [{ required: true }]}
            hidden={e.hidden || false}
          >
            {e.formItem}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
}
