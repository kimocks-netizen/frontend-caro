import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthProvider';
import AppRoutes from './routes';
//import WhatsAppWidgetLoader from './components/WhatsAppWidgetLoader';

const App: React.FC = () => {
  return (
    <>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppRoutes />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
    {/*<WhatsAppWidgetLoader/>*/}
     </>
  );
};

export default App;