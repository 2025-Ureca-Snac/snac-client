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
      <h3 className="font-medium text-lg md:text-2xl text-primary-foreground">{title}</h3>
      <div
        className={`grid gap-3 ${title === '통신사' ? 'grid-cols-3' : 'grid-cols-2'}`}
      >
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
                  ? 'bg-muted text-muted-foreground border-border cursor-not-allowed'
                  : isSelected
                    ? 'bg-card text-card-foreground border-white'
                    : 'bg-transparent text-primary-foreground border-gray-400 hover:border-white hover:bg-card hover:bg-opacity-10'
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
