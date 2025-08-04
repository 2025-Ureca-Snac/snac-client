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
          className="px-4 py-3 bg-gray-100 rounded-lg font-bold text-gray-800 hover:bg-gray-200 dark:hover-bg-gray-700  md:bg-transparent md:border md:border-gray-400 md:text-gray-400"
        >
          {resetText}
        </button>
        <button
          onClick={onApply}
          disabled={applyDisabled}
          className="px-2 py-3 rounded-lg font-bold transition-colors bg-teal-green md:bg-gray-800 dark:bg-black-200 dark:text-black text-white hover:bg-gray-500"
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
        className={`w-[40%] px-6 py-3 bg-gray-600 text-white rounded-lg transition-colors ${
          resetDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'
        }`}
      >
        {resetText}
      </button>
      <button
        onClick={onApply}
        disabled={applyDisabled}
        className={`w-full px-6 py-3 bg-green-600 text-white rounded-lg transition-colors ${
          applyDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
        }`}
      >
        {applyText}
      </button>
    </div>
  );
}
