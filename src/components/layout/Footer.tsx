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
                ? 'bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent'
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
                ? 'bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent'
            }`}>
              Quick Links
            </h3>

            <ul className="space-y-2">
              <li><a href="/" className={`hover:text-purple-500 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Home</a></li>
              <li><a href="/products" className={`hover:text-purple-500 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Products</a></li>
              <li><a href="/quote/request" className={`hover:text-purple-500 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Request Quote</a></li>
              <li><a href="/quote/track" className={`hover:text-purple-500 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Track Quote</a></li>
            </ul>
          </div>

          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent'
            }`}>
              Legal
            </h3>
            <ul className="space-y-2">
              <li><a href="/terms" className={`hover:text-purple-500 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Terms & Conditions</a></li>
              <li><a href="/privacy" className={`hover:text-purple-500 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Privacy Policy</a></li>
            </ul>

            <h3 className={`text-lg font-semibold mt-4 mb-2 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent'
            }`}>
              Social Media
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:text-purple-500 transition-colors text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                <FaFacebookF />
              </a>
              <a
                href="https://wa.me/27604755243?text=Hello%20Caro%20Group%20Investments,%20I%20need%20to%20enquire%20about%20auto%20parts.."
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:text-purple-500 transition-colors text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                <FaWhatsapp />
              </a>
              <a
                href="tel:+27604755243"
                className={`hover:text-purple-500 transition-colors text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                <FaPhoneAlt />
              </a>
              <a
                href="mailto:info@carogroupinvestments.com"
                className={`hover:text-purple-500 transition-colors text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                <FaEnvelope />
              </a>
            </div>
          </div>

          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent'
            }`}>
              Contact Us
            </h3>
            <address className={`not-italic space-y-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>
                <a
                  href="https://maps.app.goo.gl/kaZ7oebMTbM2mSzH8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-purple-500 transition-colors"
                >
                  <FaMapMarkerAlt className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  <span>6764 Seedcracker St, Centurion, 0173</span>
                </a>
              </p>

              <p>
                <a
                  href="tel:+27604755243"
                  className="flex items-center space-x-2 hover:text-purple-500 transition-colors"
                >
                  <FaPhoneAlt className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  <span>+27 60 475 5243</span>
                </a>
              </p>

              <p>
                <a
                  href="mailto:info@carogroup.co.za"
                  className="flex items-center space-x-2 hover:text-purple-500 transition-colors"
                >
                  <FaEnvelope className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  <span>info@carogroupinvestments.com</span>
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} mt-8 pt-8 text-center`}>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            &copy; {new Date().getFullYear()} Caro Group Investments. All rights reserved. Developed by:{" "}
            <a
              href="https://wa.me/27616583827?text=i%20Saw%20your%20work%20i%20want%20you%20to%20help%20me%20creating%20our%20website.%20What%20is%20your%20charges"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:text-purple-500 transition-colors ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent'
              }`}
            >
              Kimocks Labs
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;