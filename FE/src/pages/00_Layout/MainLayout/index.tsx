import React from 'react';
import { Button, Flex, Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { HomeOutlined, FolderOutlined, PictureOutlined, PlaySquareOutlined, ProductOutlined, AliwangwangOutlined, LogoutOutlined } from '@ant-design/icons';
type MenuItem = Required<MenuProps>['items'][number];
import logoUrl from '@/assets/images/logo.png';
import { store } from '@/store';
import { clearVirtualTryOn } from '@/store/slices/VirtualTryOnSlice';
import { clearImageGeneration } from '@/store/slices/ImageGenerationSlice';
import { clearImageToVideo } from '@/store/slices/ImageToVideoSlice';
import { clearMultiImageToVideo } from '@/store/slices/MultiImageToVideoSlice';
import { clearTextToVideo } from '@/store/slices/TextToVideoSlice';
const items: MenuItem[] = [
  {
    key: '/main',
    icon: <HomeOutlined />,
    label: 'トップページ',
  },
  {
    key: '/main/assets',
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
        <Link to="/main">
            <img
              src={logoUrl}
              alt="Company Logo"
              style={{  height: "50px", padding: "10px" }}
            />
          </Link>
        </Flex>
          <Menu
            onClick={onClick}
            style={{ width: "100%", flexGrow: 1 }}
            defaultSelectedKeys={[location.pathname]}
            items={items}
          />
        <Flex vertical style={{ alignItems:"center" , marginBottom:20 }}>
        <Button block icon={<LogoutOutlined />}
        onClick={() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          store.dispatch(clearVirtualTryOn());
          store.dispatch(clearImageGeneration());
          store.dispatch(clearImageToVideo());
          store.dispatch(clearMultiImageToVideo());
          store.dispatch(clearTextToVideo());
          navigate("/");
        }} 
        >ログアウト</Button>
        </Flex>
        </Flex>
      </Sider>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default MainLayout;