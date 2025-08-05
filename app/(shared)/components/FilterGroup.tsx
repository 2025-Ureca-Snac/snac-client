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
  className?: string;
  // [수정] 속성 이름을 다시 mobileGridCols로 변경하여 모바일 전용임을 명확히 합니다.
  mobileGridCols?: 2 | 3 | 4;
}

export default function FilterGroup({
  title,
  options,
  selectedValues,
  onValueChange,
  variant = 'button',
  className = '',
  mobileGridCols,
}: FilterGroupProps) {
  const handleValueChange = (value: string) => {
    onValueChange(value);
  };

  // [수정] 모바일에서는 grid, PC(md 이상)에서는 세로 flex 레이아웃을 적용합니다.
  const layoutClasses = mobileGridCols
    ? `grid grid-cols-${mobileGridCols} gap-2 md:flex md:flex-col md:items-start md:gap-3`
    : 'flex flex-wrap gap-2 md:flex-col md:items-start md:gap-3';

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-regular-md md:text-medium-md font-semibold ">
        {title}
      </h3>
      <div className={layoutClasses}>
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
