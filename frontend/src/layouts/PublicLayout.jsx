import { Outlet } from 'react-router-dom'
import PublicHeader from '../components/layout/PublicHeader'
import Footer from '../components/layout/Footer'

const PublicLayout = () => {
  return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
  )
}

export default PublicLayout