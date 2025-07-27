// components/ui/Select.tsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface SelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
  disabled?: boolean; 
}

const Select: React.FC<SelectProps> = ({ label, value, onChange, options, required = false,  disabled = false }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="mb-4">
      <label className={`block text-sm font-medium mb-1 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-md transition-colors ${
          isDarkMode
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary-dark focus:ring-primary-dark'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-primary'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        required={required}
        disabled={disabled} 
      >
        <option value="" className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}>
          Select a category
        </option>
        {options.map(option => (
          <option 
            key={option.value} 
            value={option.value}
            className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;