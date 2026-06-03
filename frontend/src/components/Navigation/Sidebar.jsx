import { useLocation, Link } from 'react-router-dom';
import {
  Home,
  Camera,
  BookOpen,
  Settings,
} from 'lucide-react';
import logo from '../../assets/icons/Nutrivision-logo.png';

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Scan Food', icon: Camera, path: '/scan-food' },
    { name: 'Recipe', icon: BookOpen, path: '/recipes' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const isActive = (itemPath) => location.pathname === itemPath;

  const handleMenuItemClick = (itemPath, itemName) => {
    setIsOpen(false);
  };

  const mobileOverlay = isOpen && (
    <div
      className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30 lg:hidden"
      onClick={() => setIsOpen(false)}
    />
  );

  const mobileDrawer = (
    <aside
      className="fixed left-0 top-0 h-screen w-64 sm:w-72 flex flex-col z-40 lg:hidden"
      style={{
        backgroundColor: '#FFFFFF',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-out',
      }}
    >
      <div className="px-6 py-6">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <img src={logo} alt="NutriVision" className="w-9 h-9 rounded-lg" />
          <h1 className="font-medium text-base" style={{ color: '#1E293B' }}>NutriVision</h1>
        </Link>
      </div>

      <nav className="px-3 pt-2 pb-4 flex flex-col flex-1 space-y-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => handleMenuItemClick(item.path, item.name)}
              className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left no-underline ${
                active ? 'bg-slate-50' : 'hover:bg-slate-50'
              }`}
            >
              <IconComponent
                className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
                  active ? 'text-emerald-700' : 'text-slate-400'
                }`}
              />
              <span className={`text-sm transition-colors duration-200 ${
                active ? 'font-medium text-emerald-700' : 'text-slate-500'
              }`}>
                {item.name}
              </span>
              {active && (
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-1 rounded-l-full"
                  style={{ backgroundColor: '#15803D', height: '24px' }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );

  // Desktop sidebar
  const desktopSidebar = (
    <aside
      className="hidden lg:flex fixed left-0 top-0 h-screen w-60 flex-col z-40"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <div className="px-6 py-6">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <img src={logo} alt="NutriVision" className="w-9 h-9 rounded-lg" />
          <h1 className="font-medium text-base" style={{ color: '#1E293B' }}>NutriVision</h1>
        </Link>
      </div>

      <nav className="px-4 pt-2 pb-4 flex flex-col flex-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => handleMenuItemClick(item.path, item.name)}
              className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left no-underline ${
                active ? 'bg-slate-50' : 'hover:bg-slate-50'
              }`}
            >
              <IconComponent
                className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
                  active ? 'text-emerald-700' : 'text-slate-400'
                }`}
              />
              <span className={`text-sm transition-colors duration-200 ${
                active ? 'font-medium text-emerald-700' : 'text-slate-500'
              }`}>
                {item.name}
              </span>
              {active && (
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-1 rounded-l-full"
                  style={{ backgroundColor: '#15803D', height: '24px' }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );

  return (
    <>
      {mobileOverlay}
      {mobileDrawer}
      {desktopSidebar}
    </>
  );
}