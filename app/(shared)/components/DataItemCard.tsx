'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from './Button';

type PriceUnit = 'snack' | 'won';

interface DataItemCardProps {
  imageUrl: string;
  title: string;
  price: number;
  unit: PriceUnit;
  email: string;
  createdAt: string;
  onClickBuy: (meta: { email: string; createdAt: string }) => void;
  isNew?: boolean;
  newBadgeText?: string;
  buyButtonText?: string;
}

export const DataItemCard = ({
  imageUrl,
  title,
  unit,
  price,
  email, // 데이터는 받지만 사용하지 않음
  createdAt, // 데이터는 받지만 사용하지 않음
  isNew,
  newBadgeText = 'NEW',
  buyButtonText = '구매하기',
  onClickBuy,
}: DataItemCardProps) => {
  const displayPrice =
    unit === 'snack' ? (
      <span className="inline-flex items-center">
        <Image
          src="/snac-price.svg"
          alt="스낵 단위 아이콘"
          width={24}
          height={24}
          className="mr-1"
        />
        {price.toLocaleString()}
      </span>
    ) : (
      <>₩{price.toLocaleString()}</>
    );
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
          {displayPrice}
        </p>
      </div>

      <div className="flex justify-center ">
        <Button
          onClick={() => {
            onClickBuy({ email, createdAt });
          }}
          className="w-btn-sm h-btn-sm md:w-btn-md md:h-btn-md bg-gray-900 hover:bg-gray-800 transition text-regular-md border rounded-lg flex items-center justify-center"
        >
          {buyButtonText}
        </Button>
      </div>
    </div>
  );
};
