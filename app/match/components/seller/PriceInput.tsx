'use client';

import React from 'react';

interface PriceInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function PriceInput({
  value,
  onChange,
  disabled = false,
}: PriceInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const newValue = parseInt(e.target.value) || 1500; // 최소값을 100으로 설정
    // 범위 제한: 100원 ~ 10,000원
    const clampedValue = Math.max(100, Math.min(10000, newValue));
    onChange(clampedValue);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg md:text-2xl font-medium text-primary-foreground">가격</h3>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          min="100"
          max="10000"
          step="100"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`flex-1 px-3 py-3 border rounded-lg transition-all ${
            disabled
              ? 'bg-muted text-muted-foreground border-border cursor-not-allowed'
              : 'bg-card text-primary-foreground border-border focus:ring-2 focus:ring-green-500 focus:border-transparent'
          }`}
          placeholder="가격을 입력하세요"
        />
        <span
          className={`text-sm font-medium ${disabled ? 'text-muted-foreground' : 'text-muted-foreground'}`}
        >
          원
        </span>
      </div>
      <div
        className={`text-xs ${disabled ? 'text-muted-foreground' : 'text-muted-foreground'}`}
      >
        100원 ~ 10,000원 범위에서 입력 가능합니다
      </div>
    </div>
  );
}
