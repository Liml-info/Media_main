import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/pages/00_Layout/MainLayout'
import ToolLayout from '@/pages/00_Layout/ToolLayout'
import Video from '@/pages/04_Video'
import TryOn from '@/pages/05_TryOn'
import Picture from '@/pages/03_Picture'
import { VideoProvider } from '@/contexts/VideoContext'
import { PictureProvider } from '@/contexts/PictureContext'
import { TryOnProvider } from '@/contexts/TryOnContext'
import AuthPage from '@/pages/99_Login/AuthPage'
import Assets from '@/pages/02_Assets'
import AllTools from '@/pages/07_AllTools'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthPage/>
  },
  {
    path: '/main',
    element: <MainLayout/>,
    children: [
      {
        path: '',
        element: <AllTools/>
      },
      {
        path: 'assets',
        element: <Assets/>
      }
    ]
  },
  {
    path: '/tools',
    element: <ToolLayout/>,
    children: [
      {
        path: 'picture',
        element:<PictureProvider><Picture/></PictureProvider>
      },
      {
        path: 'video',
        element: <VideoProvider><Video/></VideoProvider>
      },
      {
        path: 'try-on',
        element: <TryOnProvider><TryOn/></TryOnProvider>
      }
    ]
  }
])

export default router