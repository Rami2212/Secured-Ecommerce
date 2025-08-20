import { Outlet } from 'react-router-dom'
import AdminHeader from '../components/layout/AdminHeader'
import AdminSidebar from '../components/layout/AdminSidebar'
import Footer from '../components/layout/Footer'

const AdminLayout = () => {
  return (
      <div className="min-h-screen flex flex-col">
        <AdminHeader />
        <div className="flex-1 flex">
          <AdminSidebar />
          <main className="flex-1 p-6 bg-gray-50">
            <Outlet />
          </main>
        </div>
        <Footer />
      </div>
  )
}

export default AdminLayout