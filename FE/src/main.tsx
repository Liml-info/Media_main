import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import 'antd/dist/reset.css'  // Antd 5.x 样式重置
import '@/styles/global.less'
import '@ant-design/v5-patch-for-react-19';
import 'simplebar-react/dist/simplebar.min.css';
import { Provider } from 'react-redux'
import { store } from './store/index.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>,
)
