import { Outlet } from 'react-router-dom'
import UserHeader from '../components/layout/UserHeader'
import UserSidebar from '../components/layout/UserSidebar'
import Footer from '../components/layout/Footer'

const UserLayout = () => {
  return (
      <div className="min-h-screen flex flex-col">
        <UserHeader />
        <div className="flex-1 flex">
          <UserSidebar />
          <main className="flex-1 p-6 bg-gray-50">
            <Outlet />
          </main>
        </div>
        <Footer />
      </div>
  )
}

export default UserLayout