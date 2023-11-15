import { useLocation } from 'react-router-dom'
import { Header } from '../Header/Header.jsx'
import { SideBarMenu } from '../SideBar/SideBarMenu.jsx'

export function DefaultLayout () {
  const location = useLocation()

  return (
    <>
      {// To prevent render this component while /404 route is active
        location.pathname !== '/404' && (
          <>
            <Header />
            <SideBarMenu />
          </>
        )
      }
    </>
  )
}
