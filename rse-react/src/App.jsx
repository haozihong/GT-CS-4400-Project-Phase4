import React, { useState } from 'react';
import {
  DeploymentUnitOutlined,
  PieChartOutlined,
  TeamOutlined,
  RocketOutlined,
  PushpinOutlined,
  GoldOutlined,
  SendOutlined,
  SmileOutlined,
  UserOutlined,
  ShopOutlined,
  SolutionOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu } from 'antd';
import 'antd/dist/reset.css';
import './App.css';
import { Outlet, Link, useLocation } from 'react-router-dom';
import routes from './router/routes'

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return { key,icon,children,label };
}
const items = [
  getItem('Users', 'sub1', <SolutionOutlined />, [
    getItem(<Link to='/u/employees'>Employees</Link>, '1', <TeamOutlined />),
    getItem(<Link to='/u/workers'>Workers</Link>, '2', <UserOutlined />),
    getItem(<Link to='/u/pilots'>Pilots</Link>, '3', <SendOutlined />),
    getItem(<Link to='/u/owners'>Owners</Link>, '4', <SmileOutlined />)
  ]),
  getItem(<Link to='/services'>Services</Link>, '10', <PieChartOutlined />),
  getItem(<Link to='/drones'>Drones</Link>, '11', <RocketOutlined />),
  getItem(<Link to='/locations'>Locations</Link>, '12', <PushpinOutlined />),
  getItem(<Link to='/restaurants'>Restaurants</Link>, '13', <ShopOutlined />),
  getItem(<Link to='/ingredients'>Ingredients</Link>, '14', <GoldOutlined />),
];

let breadcrumbNameMap = Object.fromEntries(routes.map(({ label, url, page }) => [url, label]));

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url]}</Link>
      </Breadcrumb.Item>
    );
  });
  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">Home</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);

  return (
    <Layout
      style={{ minHeight: '100vh', }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <Menu
          theme="dark"
          defaultOpenKeys={['sub1']}
          defaultSelectedKeys={['1']}
          mode="inline" 
          items={items}
        />
      </Sider>
      <Layout className="site-layout">
        <Header>
          <h1
            style={{color: 'aliceblue'}}
          >
            <DeploymentUnitOutlined /> Restaurant Supply Express! Drone Delivery
          </h1>
        </Header>
        <Content
          style={{ margin: '0 16px', }}
        >
          <Breadcrumb
            style={{ margin: '16px 0', }}
          >
            {breadcrumbItems}
          </Breadcrumb>
          <div
            style={{ padding: 8, minHeight: 360, }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{ textAlign: 'center', }}
        >
          Restaurant Supply Express ©2022 Created by Group 19
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;