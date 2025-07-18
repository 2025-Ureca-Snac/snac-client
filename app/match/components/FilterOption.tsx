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
      className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800/30'
      }`}
    >
      <div className="relative">
        <input
          type={multiSelect ? 'checkbox' : 'radio'}
          name={multiSelect ? undefined : name || 'filter-option'}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
            checked
              ? 'bg-green-500 border-green-500'
              : 'bg-transparent border-gray-400 hover:border-gray-300'
          } ${disabled ? 'cursor-not-allowed' : ''}`}
        >
          {checked && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={4}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
      <span className="text-white md:text-lg text-base font-noto-sans-kr">
        {label}
      </span>
    </label>
  );
}
