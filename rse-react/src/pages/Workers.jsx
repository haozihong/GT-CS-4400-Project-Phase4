import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { format } from 'date-fns'

const columns = [
  { title: 'Username', dataIndex: 'username' },
  { title: 'Service ID', dataIndex: 'id' },
  { title: 'Last Name', dataIndex: 'firstName' },
  { title: 'Last Name', dataIndex: 'lastName' },
  { title: 'Address', dataIndex: 'address' },
  { title: 'Birthdate', dataIndex: 'birthdate', render: e => format(e, 'yyyy-MM-dd'), },
];

export const Workers = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const fetchData = () => {
    setLoading(true);
    fetch(`/api/workers/view`)
      .then((res) => res.json())
      .then((res) => {
        res.forEach(e => { e.birthdate = new Date(e.birthdate); });
        setData(res);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Table
      columns={columns}
      rowKey={(record) => record.username + record.id}
      dataSource={data}
      loading={loading}
    />
  );
}

export default Workers