'use client';
import React from 'react';
import Image from 'next/image';
import { PriceUnit } from '@/app/(shared)/types';

interface PriceUnitToggleProps {
  currentUnit: PriceUnit;
  setCurrentUnit: (unit: PriceUnit) => void;
  isMobile?: boolean;
}

export const PriceUnitToggle = ({
  currentUnit,
  setCurrentUnit,
  isMobile = false,
}: PriceUnitToggleProps) => {
  const containerWidth = isMobile ? 'w-32' : 'w-44';
  const paddingY = isMobile ? 'py-1' : 'py-2';

  const textSize = isMobile ? 'text-regular-sm' : 'text-regular-sm';
  const iconSize = isMobile ? 16 : 18;
  const iconMargin = isMobile ? 'mr-1' : 'mr-1.5';
  const shadow = isMobile ? 'shadow-md' : 'shadow-light';

  return (
    <div
      className={`relative flex ${containerWidth} items-center rounded-full bg-gray-200 p-1`}
    >
      <div
        className={`absolute h-[calc(100%-8px)] w-[calc(50%-4px)] transform rounded-full bg-white ${shadow} transition-transform duration-300 ease-in-out ${
          currentUnit === 'won' ? 'translate-x-full' : 'translate-x-0'
        }`}
      />
      <button
        onClick={() => setCurrentUnit('snack')}
        className={`relative z-10 flex flex-1 items-center justify-center ${paddingY} text-center ${textSize} font-bold transition-colors duration-300 ${
          currentUnit === 'snack'
            ? 'text-gray-900 dark:text-gray-100'
            : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        <Image
          src="/snac-price.svg"
          alt="스낵 단위 아이콘"
          width={iconSize}
          height={iconSize}
          className={iconMargin}
        />
        스낵
      </button>
      <button
        onClick={() => setCurrentUnit('won')}
        className={`relative z-10 flex flex-1 items-center justify-center ${paddingY} text-center ${textSize} font-bold transition-colors duration-300 ${
          currentUnit === 'won'
            ? 'text-gray-900 dark:text-gray-100'
            : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        ₩ 원
      </button>
    </div>
  );
};
