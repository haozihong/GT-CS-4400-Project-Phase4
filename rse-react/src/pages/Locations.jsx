import React, { useEffect, useState } from 'react';
import { Table } from 'antd';

const columns = [
  { title: 'Label', dataIndex: 'label' },
  { title: 'X Coord', dataIndex: 'xcoord' },
  { title: 'Y Coord', dataIndex: 'ycoord' },
  { title: 'Num of Restaurants', dataIndex: 'numRestaurants' },
  { title: 'Num of Delivery Services', dataIndex: 'numDeliveryServices' },
  { title: 'Num of Drones', dataIndex: 'numDrone' },
];

export const Locations = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const fetchData = () => {
    setLoading(true);
    fetch(`/api/locations/view`)
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

export default Locations