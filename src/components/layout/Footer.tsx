import { FaFacebookF, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { isDarkMode } = useTheme();

  return (
    <footer className={`py-8 ${
      isDarkMode 
        ? 'bg-gray-900 text-gray-300 border-t border-gray-700' 
        : 'bg-gray-100 text-gray-700 border-t border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-primary-dark to-accent-dark bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'
            }`}>
              Caro Group Investments
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Premium equipment and services in Centurion. Give your Business the best with Caro Group Investments.
            </p>
          </div>

          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-primary-dark to-accent-dark bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'
            }`}>
              Quick Links
            </h3>

            <ul className="space-y-2">
              <li><a href="/" className={`hover:text-primary transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Home</a></li>
              <li><a href="/products" className={`hover:text-primary transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Products</a></li>
              <li><a href="/quote/request" className={`hover:text-primary transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Request Quote</a></li>
              <li><a href="/quote/track" className={`hover:text-primary transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Track Quote</a></li>
            </ul>
          </div>

          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-primary-dark to-accent-dark bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'
            }`}>
              Legal
            </h3>
            <ul className="space-y-2">
              <li><a href="/terms" className={`hover:text-primary transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Terms & Conditions</a></li>
              <li><a href="/privacy" className={`hover:text-primary transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-primary-dark to-accent-dark bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'
            }`}>
              Connect
            </h3>
            <div className="flex space-x-4 mb-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                className={`hover:text-primary transition-colors text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <FaFacebookF />
              </a>
              <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer" 
                className={`hover:text-primary transition-colors text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <FaWhatsapp />
              </a>
              <a href="tel:+27123456789" 
                className={`hover:text-primary transition-colors text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <FaPhoneAlt />
              </a>
              <a href="mailto:info@carogroup.co.za" 
                className={`hover:text-primary transition-colors text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <FaEnvelope />
              </a>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 hover:text-primary transition-colors">
                <FaMapMarkerAlt className={`${isDarkMode ? 'text-primary-dark' : 'text-primary'}`} />
                <span className="text-sm">Centurion, Pretoria</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-primary transition-colors">
                <FaPhoneAlt className={`${isDarkMode ? 'text-primary-dark' : 'text-primary'}`} />
                <span className="text-sm">+27 12 345 6789</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-primary transition-colors">
                <FaEnvelope className={`${isDarkMode ? 'text-primary-dark' : 'text-primary'}`} />
                <span className="text-sm">info@carogroup.co.za</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-300 dark:border-gray-600">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2024 Caro Group Investments. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <a href="/" className={`hover:text-primary transition-colors ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <span className={`font-semibold ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-primary-dark to-accent-dark bg-clip-text text-transparent' 
                    : 'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'
                }`}>
                  CaroParts
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;