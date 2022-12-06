import React, { useEffect, useState } from 'react';
import { Table } from 'antd';

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
  return (
    <Table
      columns={columns}
      rowKey={(record) => record.username}
      dataSource={data}
      loading={loading}
    />
  );
}

export default Services