import React, { useEffect, useState } from 'react';
import { Table } from 'antd';

const columns = [
  { title: 'Ingredient Name', dataIndex: 'iname' },
  { title: 'Location', dataIndex: 'location' },
  { title: 'Amount Available', dataIndex: 'amount_available' },
  { title: 'Low Price', dataIndex: 'low_price' },
  { title: 'High Price', dataIndex: 'high_price' },
];

const App = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const fetchData = () => {
    setLoading(true);
    fetch(`/api/ingredients`)
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
      rowKey={(record) => record.barcode}
      dataSource={data}
      loading={loading}
    />
  );
};

export default App;