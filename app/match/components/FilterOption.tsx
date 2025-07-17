'use client';

import React from 'react';

interface FilterOptionProps {
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
  multiSelect?: boolean;
  disabled?: boolean;
  name?: string;
}

export default function FilterOption({
  value,
  label,
  checked,
  onChange,
  multiSelect = true,
  disabled = false,
  name,
}: FilterOptionProps) {
  const handleChange = () => {
    if (!disabled) {
      onChange(value);
    }
  };

  return (
    <label
      className={`flex items-center space-x-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input
        type={multiSelect ? 'checkbox' : 'radio'}
        name={multiSelect ? undefined : name || 'filter-option'}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={`w-4 h-4 text-green-600 bg-gray-700 rounded focus:ring-green-500 ${
          disabled ? 'cursor-not-allowed' : ''
        }`}
      />
      <span className="text-sm md:text-lg">{label}</span>
    </label>
  );
}
