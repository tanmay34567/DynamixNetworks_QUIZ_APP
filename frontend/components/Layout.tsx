import React from 'react';
import { useStore } from '../context/Store';
import { LogOut, BookOpen, LayoutDashboard, User as UserIcon, PlusCircle, GraduationCap } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-600';

  const dashboardPath = user?.role === UserRole.TEACHER
    ? '/manage-courses'
    : user?.role === UserRole.STUDENT
      ? '/dashboard-student'
      : '/dashboard';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-800 text-white flex flex-col shadow-xl">
        <div className="p-6 flex items-center space-x-3 border-b border-indigo-700">
          <div className="bg-white p-2 rounded-lg">
            <GraduationCap className="h-6 w-6 text-indigo-800" />
          </div>
          <div>
            <h1 className="text-lg font-bold">DynamixLMS</h1>
            <p className="text-xs text-indigo-300">Learn. Grow. Succeed.</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link to={dashboardPath} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(dashboardPath)}`}>
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          
          {user?.role === UserRole.STUDENT && (
            <Link to="/catalog" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/catalog')}`}>
              <BookOpen className="h-5 w-5" />
              <span>Browse Courses</span>
            </Link>
          )}

          <Link to="/profile" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/profile')}`}>
            <UserIcon className="h-5 w-5" />
            <span>Profile</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-indigo-700">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <img src={user?.avatarUrl} alt="User" className="h-10 w-10 rounded-full bg-indigo-600" />
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-indigo-300 capitalize">{user?.role.toLowerCase()}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 bg-indigo-900/50 hover:bg-indigo-900 py-2 rounded-lg transition-colors text-sm">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="p-8 max-w-7xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
};