import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/Store';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { StudentDashboard } from './pages/StudentDashboard';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { Catalog } from './pages/Catalog';
import { CourseView } from './pages/CourseView';
import { Profile } from './pages/Profile';
import { UserRole } from './types';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useStore();
  return user ? <Layout>{children}</Layout> : <Navigate to="/" />;
};

const RoleRoute: React.FC<{ children: React.ReactNode, role: UserRole }> = ({ children, role }) => {
  const { user } = useStore();
  if (!user) return <Navigate to="/" />;
  return user.role === role ? <Layout>{children}</Layout> : <Navigate to="/dashboard" />;
};

const DashboardRedirect: React.FC = () => {
    const { user } = useStore();
    if (!user) return <Login />;
    if (user.role === UserRole.TEACHER) return <Navigate to="/manage-courses" />;
    return <Navigate to="/dashboard-student" />;
}

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<DashboardRedirect />} />
      
      {/* Student Routes */}
      <Route path="/dashboard-student" element={
        <RoleRoute role={UserRole.STUDENT}>
          <StudentDashboard />
        </RoleRoute>
      } />
      <Route path="/catalog" element={
        <RoleRoute role={UserRole.STUDENT}>
          <Catalog />
        </RoleRoute>
      } />
      <Route path="/course/:courseId" element={
        <RoleRoute role={UserRole.STUDENT}>
          <CourseView />
        </RoleRoute>
      } />

      {/* Teacher Routes */}
      <Route path="/manage-courses" element={
        <RoleRoute role={UserRole.TEACHER}>
          <TeacherDashboard />
        </RoleRoute>
      } />

      {/* Shared Routes */}
      <Route path="/profile" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </StoreProvider>
  );
};

export default App;