'use client';

import React from 'react';

interface FilterButtonsProps {
  onReset: () => void;
  onApply: () => void;
  resetDisabled?: boolean;
  applyDisabled?: boolean;
  resetText?: string;
  applyText?: string;
}

export default function FilterButtons({
  onReset,
  onApply,
  resetDisabled = false,
  applyDisabled = false,
  resetText = '초기화',
  applyText = '검색/적용',
}: FilterButtonsProps) {
  return (
    <div className="flex justify-center gap-4 mt-4">
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
