import React, { useEffect } from 'react';
import { Button, Dropdown, Flex, Layout, Menu, Divider, Splitter } from 'antd';
import type { MenuProps } from 'antd';
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { BarsOutlined, HomeOutlined, FolderOutlined, PictureOutlined, PlaySquareOutlined, ProductOutlined, AliwangwangOutlined } from '@ant-design/icons';
import ToolRight from '@/pages/06_ToolRight';
import { fetchHistory } from '@/services/getHistory';
type MenuItem = Required<MenuProps>['items'][number];
const items: MenuItem[] = [
  {
    key: '/tools/picture',
    icon: <PictureOutlined />,
    label: 'AI画像',
  },
  {
    key: '/tools/video',
    icon: <PlaySquareOutlined />,
    label: 'AIビデオ',
  },
  {
    key: '/tools/try-on',
    icon: <AliwangwangOutlined />,
    label: 'バーチャル試着',
  },
];
const topItems: MenuItem[] = [
  {
    key: '/main',
    icon: <HomeOutlined />,
    label: 'トップページ',
  },
  {
    key: '/main/assets',
    icon: <FolderOutlined />,
    label: '資産管理',
  }
];
const { Sider, Content } = Layout;
const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};
const ToolLayout: React.FC = () => {
  
  useEffect(() => {
    fetchHistory();
    console.log("fetchHistory222"); 
  }, []);
  const navigate = useNavigate();
  const location = useLocation();
  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };
  return (
    <Layout>
      <Sider style={siderStyle} defaultCollapsed>
        <Flex vertical style={{ height: "100%" }}>
          <Flex vertical style={{ width: "100%", alignItems: "center" }}>
            <Dropdown menu={{ items: topItems, onClick: onClick }} placement="bottom" >
              <Flex vertical style={{ width: "100%", height: "50px", fontSize: "30px", justifyContent: "center", alignItems: "center", backgroundColor: "#1f1f1f" }}>
                <BarsOutlined />
              </Flex>
            </Dropdown>
          </Flex>
          <Flex vertical style={{ flexGrow: 1, justifyContent: "center", backgroundColor: "#1f1f1f"}}>
            <Menu
              onClick={onClick}
              style={{ width: "100%" }}
              defaultSelectedKeys={[location.pathname]}
              items={items}
            />
          </Flex>
        </Flex>
      </Sider>
      <Content style={{height:"100vh"}}>
        <Splitter style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          <Splitter.Panel defaultSize="30%" min="30%" max="40%">
            <Outlet />
          </Splitter.Panel>
          <Splitter.Panel>
            <ToolRight />
          </Splitter.Panel>
        </Splitter>
      </Content>
    </Layout>
  );
};

export default ToolLayout;