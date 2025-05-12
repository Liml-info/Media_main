
import router from '@/router/Index'
// 移除与局部声明冲突的 'App' 导入
import { ConfigProvider, App, theme } from 'antd';
import { RouterProvider } from "react-router-dom";
function BaseApp() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          colorBgContainer: '#1f1f1f',
          colorBgLayout: '#141414',
          colorText: 'rgba(255, 255, 255, 0.85)',
          colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
          colorTextTertiary: 'rgba(255, 255, 255, 0.45)',
          colorTextQuaternary: 'rgba(255, 255, 255, 0.25)',
          colorBorder: '#434343',
          colorBorderSecondary: '#303030',
          colorFill: 'rgba(255, 255, 255, 0.18)',
          colorFillSecondary: 'rgba(255, 255, 255, 0.12)',
          colorFillTertiary: 'rgba(255, 255, 255, 0.08)',
          colorFillQuaternary: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 6,
        },
        
        components: {
          Layout:{
            siderBg:"black",
            bodyBg:"black"
          },
        }
      }}
    >
      <App>
        <RouterProvider router={router} />
      </App>
    </ConfigProvider>
  )
}

export default BaseApp
