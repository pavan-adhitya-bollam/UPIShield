import { useState } from 'react'
import Sidebar from '../components/Dashboard/Sidebar'
import TopNavbar from '../components/Dashboard/TopNavbar'
import ReportSection from '../components/Reports/ReportSection'

const ReportsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-dark-900">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="min-w-0 transition-all duration-300">
        <TopNavbar toggleSidebar={() => setIsSidebarOpen((open) => !open)} isSidebarOpen={isSidebarOpen} />
        <main className="p-4 lg:p-6">
          <h1 className="text-2xl lg:text-3xl font-bold gradient-text mb-6">Reports</h1>
          <ReportSection />
        </main>
      </div>
    </div>
  )
}

export default ReportsPage
