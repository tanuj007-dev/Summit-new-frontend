import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Grid3X3, Layers, Wrench, Shield, Award, FolderTree, Settings, LogOut } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useState } from 'react';
import { LogoutDialog } from './LogoutDialog';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const navigation = [{
  name: 'Dashboard',
  href: '/admin',
  icon: LayoutDashboard
}, {
  name: 'Products',
  href: '/admin/products',
  icon: Package
}, {
  name: 'Product Details',
  href: '/admin/product-details',
  icon: Layers
}, {
  name: 'Categories',
  href: '/admin/categories',
  icon: Grid3X3
}, {
  name: 'Subcategories',
  href: '/admin/subcategories',
  icon: FolderTree
}, {
  name: 'Series',
  href: '/admin/series',
  icon: Layers
}, {
  name: 'Materials',
  href: '/admin/materials',
  icon: Wrench
}, {
  name: 'Warranties',
  href: '/admin/warranties',
  icon: Shield
}, {
  name: 'Certifications',
  href: '/admin/certifications',
  icon: Award
}, {
  name: 'Logout',
  href: '#',
  icon: LogOut,
  isLogout: true
}];
export function Sidebar() {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await adminLogout();
    toast.success('Logout successfully!');
    navigate('/');
    setIsLogoutDialogOpen(false);
  };

  return (
    <>
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gray-900 border-r border-gray-800">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 px-6 border-b border-gray-800 bg-gray-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-white">Summit</h1>
              <p className="text-xs text-gray-400">Product Admin</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto scrollbar-thin bg-gray-900">
            {navigation.map(item => {
              if (item.isLogout) {
                return (
                  <button
                    key={item.name}
                    onClick={() => setIsLogoutDialogOpen(true)}
                    className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </button>
                );
              }
              return (
                <NavLink key={item.name} to={item.href} className={({
                isActive
              }) => cn('flex items-center gap-3 rounded-md px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800',
                  isActive && 'text-orange-500 bg-gray-800')}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          {/* <div className="border-t border-gray-800 bg-gray-900 p-4">
            <div className="flex items-center gap-3 px-2">
              <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
                <Settings className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin</p>
                <p className="text-xs text-gray-400 truncate">v1.0.0</p>
              </div>
            </div>
          </div> */}
        </div>
      </aside>
      
      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
