import React from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../context/ThemeContext';
import Button from './Button';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueShopping: () => void;
  onCheckout: () => void;
  productName: string;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({ 
  isOpen, 
  onClose, 
  onContinueShopping, 
  onCheckout,
  productName
}) => {
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Added to Cart
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {productName} has been added to your quote cart.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <Button
              onClick={() => {
                onCheckout();
                onClose();
              }}
              variant="primary"
              className="w-full sm:w-auto sm:ml-3"
            >
              Proceed to Checkout
            </Button>
            <Button
              onClick={() => {
                onContinueShopping();
                onClose();
              }}
              variant="secondary"
              className="w-full sm:w-auto mt-3 sm:mt-0"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render at the top level of the document
  return createPortal(modalContent, document.body);
};

export default AddToCartModal; 