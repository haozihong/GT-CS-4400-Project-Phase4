import { DeploymentUnitOutlined, } from '@ant-design/icons';

const Home = () => {
  return (
    <div style={{textAlign: 'center'}}>
      <header style={{ fontSize: 'calc(10px + 3vmin)' }}>
        <DeploymentUnitOutlined style={{ fontSize: '30vmin', color: '#1890ff' }} />
        <p>
          Restaurant Supply Express! Drone Delivery
        </p>
      </header>
    </div>
  )
}

export default Home