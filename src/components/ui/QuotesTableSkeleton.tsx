import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface QuotesTableSkeletonProps {
  rows?: number;
}

const QuotesTableSkeleton: React.FC<QuotesTableSkeletonProps> = ({ rows = 5 }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header skeleton */}
      <div className={`h-8 w-48 rounded bg-gradient-to-r mb-6 ${
        isDarkMode 
          ? 'from-gray-700 via-gray-600 to-gray-700' 
          : 'from-gray-200 via-gray-100 to-gray-200'
      } animate-pulse bg-[length:200%_100%] bg-[position:200%_0] transition-all duration-1000 ease-in-out`}></div>

      <div className="overflow-x-auto">
        <table className={`min-w-full border rounded-lg ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <thead className={`${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <tr>
              {['Tracking Code', 'Customer', 'Items', 'Status', 'Created', 'Actions'].map((header, index) => (
                <th key={index} className={`py-3 px-4 border-b text-left text-sm font-medium ${
                  isDarkMode ? 'text-gray-300 border-gray-600' : 'text-gray-700 border-gray-200'
                }`}>
                  <div className={`h-4 w-20 rounded bg-gradient-to-r ${
                    isDarkMode 
                      ? 'from-gray-600 via-gray-500 to-gray-600' 
                      : 'from-gray-300 via-gray-200 to-gray-300'
                  } animate-pulse bg-[length:200%_100%] bg-[position:200%_0] transition-all duration-1000 ease-in-out`}></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${
            isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
          }`}>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className={`${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}>
                {/* Tracking Code */}
                <td className="py-3 px-4">
                  <div className={`h-4 w-24 rounded bg-gradient-to-r ${
                    isDarkMode 
                      ? 'from-gray-600 via-gray-500 to-gray-600' 
                      : 'from-gray-200 via-gray-100 to-gray-200'
                  } animate-pulse bg-[length:200%_100%] bg-[position:200%_0] transition-all duration-1000 ease-in-out`}></div>
                </td>
                
                {/* Customer */}
                <td className="py-3 px-4">
                  <div className="space-y-2">
                    <div className={`h-4 w-32 rounded bg-gradient-to-r ${
                      isDarkMode 
                        ? 'from-gray-600 via-gray-500 to-gray-600' 
                        : 'from-gray-200 via-gray-100 to-gray-200'
                    } animate-pulse bg-[length:200%_100%] bg-[position:200%_0] transition-all duration-1000 ease-in-out`}></div>
                    <div className={`h-3 w-40 rounded bg-gradient-to-r ${
                      isDarkMode 
                        ? 'from-gray-600 via-gray-500 to-gray-600' 
                        : 'from-gray-200 via-gray-100 to-gray-200'
                    } animate-pulse bg-[length:200%_100%] bg-[position:200%_0] transition-all duration-1000 ease-in-out`}></div>
                  </div>
                </td>
                
                {/* Items */}
                <td className="py-3 px-4">
                  <div className={`h-4 w-16 rounded bg-gradient-to-r ${
                    isDarkMode 
                      ? 'from-gray-600 via-gray-500 to-gray-600' 
                      : 'from-gray-200 via-gray-100 to-gray-200'
                  } animate-pulse bg-[length:200%_100%] bg-[position:200%_0] transition-all duration-1000 ease-in-out`}></div>
                </td>
                
                {/* Status */}
                <td className="py-3 px-4">
                  <div className={`h-6 w-20 rounded bg-gradient-to-r ${
                    isDarkMode 
                      ? 'from-gray-600 via-gray-500 to-gray-600' 
                      : 'from-gray-200 via-gray-100 to-gray-200'
                  } animate-pulse bg-[length:200%_100%] bg-[position:200%_0] transition-all duration-1000 ease-in-out`}></div>
                </td>
                
                {/* Created */}
                <td className="py-3 px-4">
                  <div className={`h-4 w-20 rounded bg-gradient-to-r ${
                    isDarkMode 
                      ? 'from-gray-600 via-gray-500 to-gray-600' 
                      : 'from-gray-200 via-gray-100 to-gray-200'
                  } animate-pulse bg-[length:200%_100%] bg-[position:200%_0] transition-all duration-1000 ease-in-out`}></div>
                </td>
                
                {/* Actions */}
                <td className="py-3 px-4">
                  <div className={`h-8 w-24 rounded bg-gradient-to-r ${
                    isDarkMode 
                      ? 'from-gray-600 via-gray-500 to-gray-600' 
                      : 'from-gray-200 via-gray-100 to-gray-200'
                  } animate-pulse bg-[length:200%_100%] bg-[position:200%_0] transition-all duration-1000 ease-in-out`}></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuotesTableSkeleton;
