import { useState } from 'react';
import Sidebar from '../components/Navigation/Sidebar';
import DashboardHeader from '../components/Navigation/DashboardHeader';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 w-full lg:ml-60">
        <DashboardHeader isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <main className="flex-1 w-full">
          <div className="px-6 lg:px-8 xl:px-10 py-6 lg:py-8 xl:py-10 max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
