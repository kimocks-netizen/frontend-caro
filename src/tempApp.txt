import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import NotFound from './pages/404';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
};

export default App;