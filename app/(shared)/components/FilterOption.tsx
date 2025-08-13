'use client';

import React from 'react';

interface FilterOptionProps {
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
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
        className={`flex w-full items-center justify-between cursor-pointer py-2 ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span className="text-muted-foreground text-muted-foreground text-regular-sm">
          {label}
        </span>
        <input
          type="radio"
          name={name || 'filter-option'}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="h-6 w-6 border-border text-teal-green cursor-pointer focus:ring-teal-green"
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
            : 'hover:bg-card/30:bg-muted'
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
                : 'bg-transparent border-gray-400 hover:border-border:bg-muted'
            } ${disabled ? 'cursor-not-allowed' : ''}`}
          >
            {checked && (
              <svg
                className="w-4 h-4 text-primary-foreground"
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
        <span className="text-primary-foreground md:text-lg text-base font-noto-sans-kr">
          {label}
        </span>
      </label>
    );
  }

  return (
    <button
      onClick={handleChange}
      disabled={disabled}
      className={`w-full flex justify-center items-center px-2 py-2 text-regular-sm h-[40px] rounded-[10px] border transition-colors md:w-full md:justify-start md:h-auto md:p-1 md:border-none md:bg-transparent md:rounded-none ${
        checked
          ? 'bg-teal-green text-primary-foreground border-teal-green font-semibold md:bg-transparent md:text-card-foreground md:font-bold md:underline:text-primary-foreground'
          : 'bg-card text-foreground hover:bg-muted  text-muted-foreground:bg-muted md:text-muted-foreground'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {label}
    </button>
  );
}
