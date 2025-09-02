import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ProductSkeletonProps {
  count?: number;
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 8 }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className={`border rounded-lg overflow-hidden shadow-md ${
            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
          }`}
        >
          {/* Image skeleton */}
          <div className={`h-48 bg-gradient-to-r ${
            isDarkMode 
              ? 'from-gray-700 via-gray-600 to-gray-700' 
              : 'from-gray-200 via-gray-100 to-gray-200'
          } animate-pulse bg-[length:200%_100%] bg-[position:200%_0] transition-all duration-1000 ease-in-out`}></div>
          
          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            {/* Title skeleton */}
            <div className={`h-6 rounded bg-gradient-to-r ${
              isDarkMode 
                ? 'from-gray-700 via-gray-600 to-gray-700' 
                : 'from-gray-200 via-gray-100 to-gray-200'
            } animate-pulse bg-[length:200%_100%] bg-[position:200%_0] transition-all duration-1000 ease-in-out`}></div>
            
            {/* Description skeleton */}
            <div className="space-y-2">
              <div className={`h-4 rounded bg-gradient-to-r ${
                isDarkMode 
                  ? 'from-gray-700 via-gray-600 to-gray-700' 
                  : 'from-gray-200 via-gray-100 to-gray-200'
              } animate-pulse bg-[length:200%_100%] bg-[position:200%_0] transition-all duration-1000 ease-in-out`}></div>
              <div className={`h-4 rounded w-3/4 bg-gradient-to-r ${
                isDarkMode 
                  ? 'from-gray-700 via-gray-600 to-gray-700' 
                  : 'from-gray-200 via-gray-100 to-gray-200'
              } animate-pulse bg-[length:200%_100%] bg-[position:200%_0] transition-all duration-1000 ease-in-out`}></div>
            </div>
            
            {/* Price and button skeleton */}
            <div className="flex justify-between items-center">
              <div className={`h-5 w-20 rounded bg-gradient-to-r ${
                isDarkMode 
                  ? 'from-gray-700 via-gray-600 to-gray-700' 
                  : 'from-gray-200 via-gray-100 to-gray-200'
              } animate-pulse bg-[length:200%_100%] bg-[position:200%_0] transition-all duration-1000 ease-in-out`}></div>
              <div className="flex items-center gap-2">
                <div className={`h-8 w-14 rounded bg-gradient-to-r ${
                  isDarkMode 
                    ? 'from-gray-700 via-gray-600 to-gray-700' 
                    : 'from-gray-200 via-gray-100 to-gray-200'
                } animate-pulse bg-[length:200%_100%] bg-[position:200%_0] transition-all duration-1000 ease-in-out`}></div>
                <div className={`h-8 w-24 rounded bg-gradient-to-r ${
                  isDarkMode 
                    ? 'from-gray-700 via-gray-600 to-gray-700' 
                    : 'from-gray-200 via-gray-100 to-gray-200'
                } animate-pulse bg-[length:200%_100%] bg-[position:200%_0] transition-all duration-1000 ease-in-out`}></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
