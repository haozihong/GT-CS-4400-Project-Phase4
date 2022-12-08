import React, { useEffect, useState } from 'react';
import { Table } from 'antd';

const columns = [
  { title: 'Name', dataIndex: 'longName' },
  { title: 'Rating', dataIndex: 'rating', render: e => `★${e}`,  },
  { title: 'Spent', dataIndex: 'spent', render: e => `$${e}`, },
  { title: 'Funded By', dataIndex: 'fundedBy' },
  { title: 'Location', dataIndex: 'location' },
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
  return (
    <Table
      columns={columns}
      rowKey={(record) => record.longName}
      dataSource={data}
      loading={loading}
    />
  );
}

export default Restaurants