'use client';

import React from 'react';

interface FilterButtonsProps {
  onReset: () => void;
  onApply: () => void;
  resetDisabled?: boolean;
  applyDisabled?: boolean;
  resetText?: string;
  applyText?: string;
  className?: string;
  variant?: 'default' | 'home';
}

export default function FilterButtons({
  onReset,
  onApply,
  resetDisabled = false,
  applyDisabled = false,
  resetText = '전체 해제',
  applyText = '적용하기',
  className = '',
  variant = 'default',
}: FilterButtonsProps) {
  if (variant === 'home') {
    return (
      <div className={`grid grid-cols-2 gap-4 p-4 ${className}`}>
        <button
          onClick={onReset}
          disabled={resetDisabled}
          className="px-4 py-3 bg-secondary rounded-lg font-bold text-foreground hover:bg-muted  md:bg-transparent md:border md:border-gray-400 md:text-muted-foreground"
        >
          {resetText}
        </button>
        <button
          onClick={onApply}
          disabled={applyDisabled}
          className="px-2 py-3 rounded-lg font-bold transition-colors bg-teal-green md:bg-card text-primary-foreground hover:bg-muted"
        >
          {applyText}
        </button>
      </div>
    );
  }

  return (
    <div className={`flex justify-center gap-4 mt-4 ${className}`}>
      <button
        onClick={onReset}
        disabled={resetDisabled}
        className={`w-[40%] px-6 py-3 bg-muted text-primary-foreground rounded-lg transition-colors ${
          resetDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'
        }`}
      >
        {resetText}
      </button>
      <button
        onClick={onApply}
        disabled={applyDisabled}
        className={`w-full px-6 py-3 bg-green-600 text-primary-foreground rounded-lg transition-colors ${
          applyDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
        }`}
      >
        {applyText}
      </button>
    </div>
  );
}
