import React from 'react';
import { Flex, Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { HomeOutlined, FolderOutlined, PictureOutlined, PlaySquareOutlined, ProductOutlined, AliwangwangOutlined } from '@ant-design/icons';
type MenuItem = Required<MenuProps>['items'][number];
const items: MenuItem[] = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: 'トップページ',
  },
  {
    key: '/assets',
    icon: <FolderOutlined />,
    label: '資産管理',
  },
  {
    key: 'ai',
    label: 'AIオーサリング',
    type: 'group',
    children: [
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
      {
        key: '/toolbox',
        icon: <ProductOutlined />,
        label: '全てツール',
      },
    ]
  },
];
const { Sider, Content } = Layout;
const siderStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable'
};
const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };
  return (
    <Layout>
      <Sider style={siderStyle}>
        <Flex vertical style={{ height: "100%", backgroundColor: "#1f1f1f" }}>
        <Flex vertical style={{ alignItems:"center" }}>
        <Link to="/">
            <img
              src="/src/assets/react.svg"
              alt="Company Logo"
              className="sider-logo"
            />
          </Link>
        </Flex>
          <Menu
            onClick={onClick}
            style={{ width: "100%", flexGrow: 1 }}
            defaultSelectedKeys={[location.pathname]}
            items={items}
          />
        </Flex>
      </Sider>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default MainLayout;