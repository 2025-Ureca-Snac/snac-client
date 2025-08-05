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
  className?: string;
  variant?: 'button' | 'radio' | 'checkbox';
}

export default function FilterOption({
  value,
  label,
  checked,
  onChange,
  disabled = false,
  name,
  className = '',
  variant = 'button',
}: FilterOptionProps) {
  const handleChange = () => {
    if (!disabled) {
      onChange(value);
    }
  };

  if (variant === 'radio') {
    return (
      <label
        className={`flex items-center space-x-3 cursor-pointer dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 p-1 ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span className="text-gray-500 dark:text-gray-200  mr-auto text-regular-sm  min-w-[200px] ">
          {label}
        </span>
        <input
          type="radio"
          name={name || 'filter-option'}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="h-6 w-6 border-gray-300 text-teal-green cursor-pointer focus:ring-teal-green"
        />
      </label>
    );
  }

  if (variant === 'checkbox') {
    return (
      <label
        className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors ${className} ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-800/30 dark:hover:bg-gray-700 dark:text-white'
        }`}
      >
        <div className="relative">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only"
          />
          <div
            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
              checked
                ? 'bg-green-500 border-green-500'
                : 'bg-transparent border-gray-400 hover:border-gray-300 dark:hover:bg-gray-700'
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
        <span className="text-white dark:text-black md:text-lg text-base font-noto-sans-kr">
          {label}
        </span>
      </label>
    );
  }

  // button variant (default)
  return (
    <button
      onClick={handleChange}
      disabled={disabled}
      className={`px-2 py-2 text-regular-sm h-[40px] rounded-[10px] border transition-colors md:w-full  md:flex md:h-auto md:p-1 md:border-none md:bg-transparent md:rounded-none ${
        checked
          ? 'bg-teal-green text-white border-teal-green font-semibold md:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 md:text-midnight-black md:font-bold md:underline dark:text-white'
          : 'bg-white text-gray-700 dark:hover:bg-gray-700 hover:bg-gray-50 md:text-gray-500 '
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {label}
    </button>
  );
}
