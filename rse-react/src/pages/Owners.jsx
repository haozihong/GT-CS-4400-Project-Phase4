import React, { useEffect, useState } from 'react';
import { Table } from 'antd';

const columns = [
  { title: 'Username', dataIndex: 'username' },
  { title: 'First Name', dataIndex: 'firstName' },
  { title: 'Last Name', dataIndex: 'lastName' },
  { title: 'Address', dataIndex: 'address' },
  { title: 'Num of Restaurants', dataIndex: 'numRestaurants' },
  { title: 'Num of Places', dataIndex: 'numPlaces' },
  { title: 'Highest Rating', dataIndex: 'highs' },
  { title: 'Lowest Rating', dataIndex: 'lows' },
  { title: 'Debt', dataIndex: 'debt' },
];

export const Owners = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const fetchData = () => {
    setLoading(true);
    fetch(`/api/owners`)
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

export default Owners