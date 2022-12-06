import React, { useEffect, useState } from 'react';
import { Table } from 'antd';

const columns = [
  { title: 'Ingredient Name', dataIndex: 'iname' },
  { title: 'Location', dataIndex: 'location' },
  { title: 'Amount Available', dataIndex: 'amountAvailable' },
  { title: 'Low Price', dataIndex: 'lowPrice' },
  { title: 'High Price', dataIndex: 'highPrice' },
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