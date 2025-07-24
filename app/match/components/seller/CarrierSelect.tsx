'use client';

import React from 'react';

interface CarrierSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const CARRIER_OPTIONS = [
  { value: 'SKT', label: 'SKT' },
  { value: 'KT', label: 'KT' },
  { value: 'LG U+', label: 'LG U+' },
];

export default function CarrierSelect({ value, onChange }: CarrierSelectProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-white">통신사</h3>
      <div className="grid grid-cols-3 gap-3">
        {CARRIER_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-3 rounded-lg border transition-all ${
              value === option.value
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
