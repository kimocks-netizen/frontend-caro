import React, { type JSX } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import QuoteRequest from './pages/Quote/Request';
import QuoteTrack from './pages/Quote/Track';
import QuoteSuccess from './pages/Quote/Success';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminProducts from './pages/Admin/Products';
import AdminQuotes from './pages/Admin/Quotes';
import NotFound from './pages/404';
import { useAuth } from './context/useAuth';

// Add this ProtectedRoute component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to /admin (login page) but save the current location
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>  
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="quote">
          <Route index element={<Navigate to="request" replace />} />
          <Route path="request" element={<QuoteRequest />} />
          <Route path="track" element={<QuoteTrack />} />
          <Route path="success" element={<QuoteSuccess />} />
        </Route>
        <Route path="admin">
          <Route index element={<AdminLogin />} />
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="products" 
            element={
              <ProtectedRoute>
                <AdminProducts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="quotes" 
            element={
              <ProtectedRoute>
                <AdminQuotes />
              </ProtectedRoute>
            } 
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;