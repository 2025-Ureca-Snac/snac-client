'use client';

import React from 'react';

interface CarrierSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const CARRIER_OPTIONS = [
  { value: 'SKT', label: 'SKT' },
  { value: 'KT', label: 'KT' },
  { value: 'LG U+', label: 'LG U+' },
];

export default function CarrierSelect({
  value,
  onChange,
  disabled = false,
}: CarrierSelectProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg md:text-2xl font-medium text-white">통신사</h3>
      <div className="grid grid-cols-3 gap-3">
        {CARRIER_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => !disabled && onChange(option.value)}
            disabled={disabled}
            className={`px-4 py-3 rounded-lg border transition-all ${
              disabled
                ? 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed'
                : value === option.value
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white border-gray-400 hover:border-white hover:bg-white hover:bg-opacity-10'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
