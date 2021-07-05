import React, { useState, createContext, useContext} from 'react';
import {Dropdown, Layout, Button, Menu, Typography} from 'antd';
import { UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory, useLocation} from "react-router-dom";
import SiderBar from '../components/menu'

const MainLayout = ({ children, authContext, ...props }) => {

  
  const [collapsed, setCollapsed] = useState(false)

  const { Header, Content, Sider } = Layout;

  const { Text } = Typography

  const username = "Bobby"

  const handleLogout = () => {
    console.log("LOGOUT")
  }

  function useAuth() {
    return useContext(authContext);
  }
  
  function AuthButton() {
    let history = useHistory();
    let auth = useAuth();
  
    return auth.user ? (
        <button
          onClick={() => {
            auth.signout(() => history.push("/login"));
          }}
        >
          Sign out
        </button>
    ) : (
      <>
        <p>You are not logged in. Number 1</p>
        <Redirect push to='/login'/>
      </>
    );
  }

  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={() => handleLogout()} style={{textAlign:"center"}} icon={<LogoutOutlined />}>
        {/* <button
          onClick={()=>(console.log("HELLO"))}
        >
          <Link to='/login'>
            Sign out
          </Link>
        </button> */}
        <AuthButton/>
      </Menu.Item>
    </Menu>
  );  

  return (
    <Layout className="main-layout">
      <Header 
        className='layout-header'
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Button onClick={()=> setCollapsed(!collapsed)}>
        { collapsed?
          <MenuUnfoldOutlined/> : <MenuFoldOutlined/>
        }
        </Button>
        <Dropdown overlay={menu}>
          <Text style={{color: 'white'}}>
            <UserOutlined style={{ marginRight: '5px', fontSize: '16px', color: 'white' }}/>
            {username}
          </Text>
        </Dropdown>
      </Header>
      <Layout>
        <Sider className="sider-bar"
          width={256}
          collapsible
          collapsed={collapsed}
          trigger={null}
          collapsedWidth={0}
        >
          <SiderBar/>
        </Sider>
        <Content className='layout-content'>
            {children}
        </Content>
      </Layout>
    </Layout>
  )
};

export default MainLayout