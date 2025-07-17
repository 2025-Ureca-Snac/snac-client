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
  onValueChange: (value: string, multiSelect?: boolean) => void;
  multiSelect?: boolean;
}

export default function FilterGroup({
  title,
  options,
  selectedValues,
  onValueChange,
  multiSelect = true,
}: FilterGroupProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <FilterOption
            key={option.value}
            value={option.value}
            label={option.label}
            checked={selectedValues.includes(option.value)}
            onChange={(value) => onValueChange(value, multiSelect)}
            multiSelect={multiSelect}
            disabled={option.disabled}
            name={title}
          />
        ))}
      </div>
    </div>
  );
}
