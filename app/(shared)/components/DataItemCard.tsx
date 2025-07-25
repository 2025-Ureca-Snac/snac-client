'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from './Button';
import { PriceUnit } from '@/app/(shared)/types';
import { useAuthStore } from '@/app/(shared)/stores/auth-store';

interface DataItemCardProps {
  imageUrl: string;
  title: string;
  price: number;
  unit: PriceUnit;
  email: string;
  createdAt: string;
  cardCategory: 'BUY' | 'SELL';
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
  email,
  createdAt,
  cardCategory,
  isNew,
  newBadgeText = 'NEW',
  buyButtonText,
  onClickBuy,
}: DataItemCardProps) => {
  const loggedInUser = useAuthStore((state) => state.user);
  const isMyPost = loggedInUser === email;
  const displayPrice =
    unit === 'snack' ? (
      <span className="inline-flex items-center">
        <Image
          src="/snac-price.svg"
          alt="스낵 단위 아이콘"
          width={18}
          height={18}
          className="mr-1"
        />
        {price.toLocaleString()}
      </span>
    ) : (
      <>₩{price.toLocaleString()}</>
    );

  const isBuyView = cardCategory === 'BUY';
  const finalButtonText =
    buyButtonText ?? (isBuyView ? '판매하기' : '구매하기');

  const buttonColorClass = isBuyView
    ? 'bg-candy-pink hover:bg-gray-700 active:bg-gray-800'
    : 'bg-gray-900 hover:bg-red active:bg-red';
  return (
    <div className="transition-transform duration-300 hover:-translate-y-[2px] hover:scale-[1.03] relative bg-[#F3F5F7] rounded-2xl shadow-md w-card-sm h-card-sm md:w-card-md md:h-card-md flex flex-col p-3">
      {isNew && (
        <span className="absolute z-10 bg-red text-white text-regular-2xs md:text-regular-xs font-bold w-[47px]  md:w-[57px] h-[20px] md:h-[24px]  rounded-[16px] flex items-center justify-center ">
          {newBadgeText}
        </span>
      )}
      {isMyPost && (
        <span className="absolute top-3 right-3 z-10 bg-gray-400   text-white text-regular-2xs md:text-regular-xs  w-[47px]  md:w-[57px] h-[20px] md:h-[24px]  rounded-[16px] font-bold px-1 py-1 flex items-center justify-center ">
          작성자
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
        <p className="text-medium-sm md:text-medium-sm text-gray-900 h-6 flex items-center">
          {displayPrice}
        </p>
      </div>

      <div className="flex justify-center ">
        {!isMyPost && (
          <Button
            onClick={() => {
              onClickBuy({ email, createdAt });
            }}
            className={`w-btn-sm h-btn-sm md:w-btn-md md:h-btn-md ${buttonColorClass} transition text-regular-md border rounded-lg flex items-center justify-center`}
          >
            {finalButtonText}
          </Button>
        )}
      </div>
    </div>
  );
};
