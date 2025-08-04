'use client';

import React from 'react';

interface FilterOptionData {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FilterGroupProps {
  title: string;
  options: FilterOptionData[];
  selectedValues: string[];
  onValueChange: (value: string, multiSelect?: boolean) => void;
  multiSelect?: boolean;
  disabled?: boolean;
}

export default function FilterGroup({
  title,
  options,
  selectedValues,
  onValueChange,
  multiSelect = true,
  disabled = false,
}: FilterGroupProps) {
  const handleOptionClick = (value: string) => {
    if (!disabled) {
      onValueChange(value, multiSelect);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-lg md:text-2xl text-white">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          const isOptionDisabled = disabled || option.disabled;

          return (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              disabled={isOptionDisabled}
              className={`px-4 py-3 rounded-lg border transition-all ${
                isOptionDisabled
                  ? 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed'
                  : isSelected
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white border-gray-400 hover:border-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
