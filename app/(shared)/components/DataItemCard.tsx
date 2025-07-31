'use client';

import { useAuthStore } from '@/app/(shared)/stores/auth-store';
import { AuthState } from '@/app/(shared)/types/auth-store';
import React from 'react';
import Image from 'next/image';
import { Button } from './Button';
import { PriceUnit } from '@/app/(shared)/types';
import { useRouter } from 'next/navigation';

interface DataItemCardProps {
  imageUrl: string;
  title: string;
  price: number;
  unit: PriceUnit;
  email: string;
  createdAt: string;
  cardCategory: string;
  onClickBuy: (meta: { email: string; createdAt: string }) => void;
  ratingScore: number;
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
  ratingScore,
  isNew,
  newBadgeText = 'NEW',
  buyButtonText,
  onClickBuy,
}: DataItemCardProps) => {
  const loggedInUser = useAuthStore((state: AuthState) => state.user);
  const router = useRouter();
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
    <div className="transition-transform duration-300 hover:scale-[1.02] relative bg-[#F3F5F7] rounded-2xl shadow-md max-w-[150px] max-h-[203px] md:max-w-[238px] md:max-h-[348px] flex flex-col p-3">
      {isNew && (
        <span className="absolute z-10 bg-red text-white text-regular-2xs md:text-regular-xs font-bold w-[47px]  md:w-[57px] h-[20px] md:h-[24px]  rounded-[16px] flex items-center justify-center ">
          {newBadgeText}
        </span>
      )}
      {isMyPost && (
        <span className="absolute top-3 right-3 z-10 bg-gray-400 text-white text-regular-2xs md:text-regular-xs w-[47px] md:w-[57px] h-[20px] md:h-[24px] rounded-[16px] font-bold px-1 py-1 flex items-center justify-center ">
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
        <p className="text-regular-2xs text-gray-500">
          바삭스코어 {ratingScore}
        </p>
      </div>

      <div className="flex justify-center h-btn-sm md:h-btn-md">
        {!isMyPost ? (
          <Button
            onClick={() => {
              // 로그인 상태 확인
              if (!loggedInUser) {
                alert('로그인 해주세요.');
                router.push('/login');
                return;
              }
              onClickBuy({ email, createdAt });
            }}
            className={`w-btn-sm h-btn-sm md:w-btn-md md:h-btn-md ${buttonColorClass} transition text-regular-md border rounded-lg flex items-center justify-center`}
            style={{ fontSize: 'clamp(12px, 2.5vw, 16px)' }}
          >
            {finalButtonText}
          </Button>
        ) : (
          <div className="w-btn-sm h-btn-sm md:w-btn-md md:h-btn-md" />
        )}
      </div>
    </div>
  );
};
