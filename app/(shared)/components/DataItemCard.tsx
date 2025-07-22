'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from './Button';

interface DataItemCardProps {
  imageUrl: string;
  title: string;
  price: number;
  onClickBuy: () => void;
  isNew?: boolean;
  newBadgeText?: string;
  buyButtonText?: string;
}

export const DataItemCard = ({
  imageUrl,
  title,
  price,
  isNew,
  newBadgeText = 'NEW',
  buyButtonText = '구매하기',
  onClickBuy,
}: DataItemCardProps) => {
  return (
    <div className="transition-transform duration-300 hover:-translate-y-[2px] hover:scale-[1.03] relative bg-[#F3F5F7] rounded-2xl shadow-md w-card-sm h-card-sm md:w-card-md md:h-card-md flex flex-col p-3">
      {isNew && (
        <span className="absolute z-10 bg-red text-white text-regular-sm md:text-regular-md font-bold w-[57px] md:w-[67px] h-[24px]  rounded-[4px] flex items-center justify-center ">
          {newBadgeText}
        </span>
      )}

      <div className="relative h-[64px] md:h-[125px] mt-[35px] md:mt-[80px]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>

      <div className="flex-grow flex flex-col items-center md:items-start md:py-[18px] mt-2">
        <h3 className="text-medium-xs font-bold md:text-medium-md text-[#141718]">
          {title}
        </h3>
        <p className="text-medium-sm md:text-medium-sm text-gray-900">
          ₩{price.toLocaleString()}
        </p>
      </div>

      <div className="flex justify-center ">
        <Button
          onClick={onClickBuy}
          className="w-btn-sm h-btn-sm md:w-btn-md md:h-btn-md bg-gray-900 hover:bg-gray-800 transition text-regular-md border rounded-lg flex items-center justify-center"
        >
          {buyButtonText}
        </Button>
      </div>
    </div>
  );
};
