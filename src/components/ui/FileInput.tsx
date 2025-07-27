// components/ui/FileInput.tsx
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface FileInputProps {
  label?: string;
  onChange: (files: FileList) => void;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  className?: string;
}

const FileInput: React.FC<FileInputProps> = ({ 
  label, 
  onChange, 
  multiple = false, 
  accept = 'image/*',
  disabled = false,
  className,
  ...props 
}) => {
  const { isDarkMode } = useTheme();
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files);
      e.target.value = ''; // Reset to allow same file re-upload
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onChange(e.dataTransfer.files);
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label className={`block mb-2 text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {label}
        </label>
      )}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full px-3 py-2 border-2 border-dashed rounded-lg transition-colors ${
          isDragging
            ? isDarkMode 
              ? 'border-primary-dark bg-purple-50 dark:bg-gray-700'
              : 'border-primary bg-purple-50 dark:bg-gray-700'
            : isDarkMode 
              ? 'border-gray-600 bg-gray-700 hover:border-gray-500' 
              : 'border-gray-300 bg-white hover:border-gray-400'
        } ${className}`}
      >
        <input
          type="file"
          onChange={handleChange}
          multiple={multiple}
          accept={accept}
          disabled={disabled}
          className="hidden"
          id="file-upload"
          {...props}
        />
        <label
          htmlFor="file-upload"
          className={`cursor-pointer ${
            isDarkMode ? 'text-primary-dark' : 'text-primary'
          } font-medium`}
        >
          {isDragging ? 'Drop images here' : 'Click to select or drag and drop'}
        </label>
        <p className={`text-sm ${isDarkMode ? 'text-primary-dark' : 'text-primary'}`}>
          {multiple ? 'Multiple images allowed' : 'Single image only'}
        </p>
      </div>
    </div>
  );
};

export default FileInput;