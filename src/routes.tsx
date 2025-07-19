import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="quotes" element={<AdminQuotes />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;