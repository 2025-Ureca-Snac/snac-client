'use client';

import React from 'react';
import FilterOption from './FilterOption';

interface FilterOptionData {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FilterGroupProps {
  title: string;
  options: FilterOptionData[];
  selectedValues: string[];
  onValueChange: (value: string) => void;
  variant?: 'button' | 'radio' | 'checkbox';
  multiSelect?: boolean;
  className?: string;
}

export default function FilterGroup({
  title,
  options,
  selectedValues,
  onValueChange,
  variant = 'button',
  className = '',
}: FilterGroupProps) {
  const handleValueChange = (value: string) => {
    onValueChange(value);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-regular-md md:text-medium-md font-semibold ">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2 md:flex-col md:items-start md:gap-3">
        {options.map((option) => (
          <FilterOption
            key={option.value}
            value={option.value}
            label={option.label}
            checked={selectedValues.includes(option.value)}
            onChange={handleValueChange}
            disabled={option.disabled}
            name={title}
            variant={variant}
          />
        ))}
      </div>
    </div>
  );
}
