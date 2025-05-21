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
import PrivateRoute from '@/components/Route/PrivateRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthPage/>
  },
  {
    path: '/main',
    element: <PrivateRoute><MainLayout/></PrivateRoute>,
    children: [
      {
        path: '',
        element: <PrivateRoute><AllTools/></PrivateRoute>
      },
      {
        path: 'assets',
        element: <PrivateRoute><Assets/></PrivateRoute>
      }
    ]
  },
  {
    path: '/tools',
    element: <ToolLayout/>,
    children: [
      {
        path: 'picture',
        element:<PrivateRoute><PictureProvider><Picture/></PictureProvider></PrivateRoute>
      },
      {
        path: 'video',
        element: <PrivateRoute><VideoProvider><Video/></VideoProvider></PrivateRoute>
      },
      {
        path: 'try-on',
        element: <PrivateRoute><TryOnProvider><TryOn/></TryOnProvider></PrivateRoute>
      }
    ]
  }
])

export default router