import React, { useEffect, useState } from 'react';
import { Table } from 'antd';

const columns = [
  { title: 'Username', dataIndex: 'username' },
  { title: 'Tax ID', dataIndex: 'taxID' },
  { title: 'Salary ($)', dataIndex: 'salary' },
  { title: 'Hired Datw', dataIndex: 'hired' },
  { title: 'Experience (month)', dataIndex: 'employeeExperience' },
  { title: 'License ID', dataIndex: 'licenseID' },
  { title: 'Piloting Experience (trips)', dataIndex: 'pilotingExperience' },
  { title: 'Manager Status', dataIndex: 'managerStatus' },
];

export const Employees = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const fetchData = () => {
    setLoading(true);
    fetch(`/api/employees`)
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

export default Employees