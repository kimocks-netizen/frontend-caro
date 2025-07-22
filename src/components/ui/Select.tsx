// components/ui/Select.tsx
import React from 'react';

interface SelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
  disabled?: boolean; 
}

const Select: React.FC<SelectProps> = ({ label, value, onChange, options, required = false,  disabled = false }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-md"
        required={required}
         disabled={disabled} 
      >
        <option value="">Select a category</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;