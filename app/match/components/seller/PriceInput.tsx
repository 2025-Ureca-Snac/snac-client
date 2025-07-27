'use client';

import React from 'react';

interface PriceInputProps {
  value: number;
  onChange: (value: number) => void;
}

export default function PriceInput({ value, onChange }: PriceInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    onChange(newValue);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-white">가격</h3>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          min="100"
          max="10000"
          step="100"
          value={value}
          onChange={handleChange}
          className="flex-1 px-3 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="가격을 입력하세요"
        />
        <span className="text-gray-400 text-sm font-medium">원</span>
      </div>
      <div className="text-xs text-gray-400">
        100원 ~ 10,000원 범위에서 입력 가능합니다
      </div>
    </div>
  );
}
