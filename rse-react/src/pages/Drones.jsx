import React, { useEffect, useState } from 'react';
import { Table } from 'antd';

const columns = [
  { title: 'Service ID', dataIndex: 'id' },
  { title: 'Drone Tag', dataIndex: 'tag' },
  { title: 'Fuel', dataIndex: 'fuel' },
  { title: 'Capacity', dataIndex: 'capacity' },
  { title: 'Sales', dataIndex: 'sales', render: e => `$${e}`, },
  { title: 'Flown By', dataIndex: 'flownBy' },
  { title: 'Location', dataIndex: 'hover' },
  { title: 'Leader Drone Id', dataIndex: 'swarmId' },
  { title: 'Leader Drone Tag', dataIndex: 'swarmTag' },
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
  return (
    <Table
      columns={columns}
      rowKey={(record) => record.id + record.tag}
      dataSource={data}
      loading={loading}
    />
  );
}

export default Drones