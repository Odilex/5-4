import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Truck, Package, Box, BarChart3, LogOut } from 'lucide-react';

function Layout({ children, isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { path: '/suppliers', label: 'Suppliers', icon: Truck },
    { path: '/shipments', label: 'Shipments', icon: Package },
    { path: '/deliveries', label: 'Deliveries', icon: Box },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-4">
              <h1 className="text-xl font-bold text-gray-800 py-4">SCMS</h1>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-4 text-sm font-medium transition-colors duration-200 ${
                      location.pathname === item.path
                        ? 'text-orange-600 border-b-2 border-orange-600'
                        : 'text-gray-600 hover:text-orange-600'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-4 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;
