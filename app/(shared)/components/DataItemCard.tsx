'use client';

import { useAuthStore } from '@/app/(shared)/stores/auth-store';
import { AuthState } from '@/app/(shared)/types/auth-store';
import React from 'react';
import Image from 'next/image';
import { Button } from './Button';
import { PriceUnit } from '@/app/(shared)/types';
import { useRouter } from 'next/navigation';
import { useHomeStore } from '@/app/(shared)/stores/home-store';
import { api } from '@/app/(shared)/utils/api';
import { toast } from 'sonner';

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
  sellStatus: string;
  cardId?: number;
  carrier?: string;
  dataAmount?: number;
  skipLoginCheck?: boolean; // 로그인 체크를 건너뛸지 여부
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
  sellStatus,
  cardId,
  carrier,
  dataAmount,
}: DataItemCardProps) => {
  const loggedInUser = useAuthStore((state: AuthState) => state.user);
  const { actions } = useHomeStore();
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

  // sellStatus에 따른 버튼 텍스트와 클릭 가능 여부 결정
  const getButtonConfig = () => {
    switch (sellStatus) {
      case 'SELLING':
        return {
          text: buyButtonText ?? (isBuyView ? '판매하기' : '구매하기'),
          clickable: true,
          className: isBuyView
            ? 'bg-candy-pink hover:bg-candy-pink/90 text-white'
            : 'bg-black hover:bg-black/80 text-white',
        };
      case 'SOLD_OUT':
        return {
          text: '거래 완료',
          clickable: false,
          className: 'bg-muted cursor-not-allowed',
          style: undefined,
        };
      default:
        return {
          text: '거래중',
          clickable: false,
          className: 'bg-muted cursor-not-allowed',
          style: undefined,
        };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className="transition-transform duration-300 hover:scale-[1.02] relative bg-card rounded-2xl shadow-md w-full max-h-[203px] md:max-h-[348px] flex flex-col p-3">
      {isNew && (
        <span className="absolute top-3 left-3 z-10 bg-red text-primary-foreground text-regular-2xs md:text-regular-xs font-bold w-[47px] md:w-[57px] h-[20px] md:h-[24px] rounded-[16px] flex items-center justify-center">
          {newBadgeText}
        </span>
      )}
      {isMyPost && (
        <span className="absolute top-3 right-3 z-10 bg-green-400 text-primary-foreground text-regular-2xs md:text-regular-xs w-[47px] md:w-[57px] h-[20px] md:h-[24px] rounded-[16px] font-bold px-1 py-1 flex items-center justify-center">
          MY
        </span>
      )}
      <div className="relative h-[64px] md:h-[125px] mt-[35px] md:mt-[80px]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          style={{ objectFit: 'contain' }}
        />
      </div>

      <div className="flex-grow flex flex-col items-center md:items-start md:py-[18px] mt-2">
        <h3 className="text-medium-xs font-bold md:text-medium-md text-card-foreground truncate w-full text-center md:text-left">
          {title}
        </h3>
        <p className="text-medium-sm md:text-medium-sm text-card-foreground h-6 flex items-center">
          {displayPrice}
        </p>
        <p className="text-regular-2xs text-muted-foreground">
          바삭스코어 {ratingScore}
        </p>
      </div>

      <div className="flex justify-center h-btn-sm md:h-btn-md">
        {!isMyPost ? (
          <Button
            onClick={() => {
              // 클릭 불가능한 상태면 클릭 이벤트 무시
              if (!buttonConfig.clickable) {
                return;
              }

              onClickBuy({ email, createdAt });
            }}
            className={`w-full h-full ${buttonConfig.className} transition text-regular-md border rounded-lg flex items-center justify-center`}
            style={{
              fontSize: 'clamp(12px, 2.5vw, 16px)',
            }}
            disabled={!buttonConfig.clickable}
          >
            {buttonConfig.text}
          </Button>
        ) : (
          <div className="flex gap-2 w-full h-full">
            {sellStatus === 'SELLING' ? (
              <>
                {cardCategory === 'SELL' && (
                  <Button
                    onClick={() => {
                      // 수정하기 로직
                      if (cardId) {
                        actions.openEditModal(cardId.toString(), {
                          cardCategory: cardCategory as 'SELL' | 'BUY',
                          carrier: (carrier as 'SKT' | 'KT' | 'LGU+') || 'SKT',
                          dataAmount: dataAmount || 0,
                          price: price,
                        });
                      }
                    }}
                    className="flex-1 bg-primary hover:bg-primary/90 whitespace-nowrap text-primary-foreground transition text-regular-md border rounded-lg flex items-center justify-center"
                    style={{ fontSize: 'clamp(8px, 2.5vw, 16px)' }}
                  >
                    <span className="md:hidden">수정</span>
                    <span className="hidden md:inline">수정하기</span>
                  </Button>
                )}

                <Button
                  onClick={() => {
                    // 삭제하기 로직
                    if (cardCategory === 'SELL') {
                      if (confirm('정말 삭제하시겠습니까?')) {
                        if (cardId) {
                          api
                            .delete(`/cards/${cardId}`)
                            .then(() => {
                              toast.success('게시글이 삭제되었습니다.');
                              actions.triggerRefetch();
                            })
                            .catch(() => {
                              toast.error('삭제에 실패했습니다.');
                            });
                        }
                      }
                    } else {
                      toast.error('구매 내역에서 삭제해주세요.');
                      router.push('/mypage/purchase-history');
                    }
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 whitespace-nowrap text-white transition text-regular-md border rounded-lg flex items-center justify-center"
                  style={{ fontSize: 'clamp(8px, 2.5vw, 16px)' }}
                >
                  <span className="md:hidden">삭제</span>
                  <span className="hidden md:inline">삭제하기</span>
                </Button>
              </>
            ) : (
              <Button
                className="w-full bg-muted cursor-not-allowed text-muted-foreground transition text-regular-md border rounded-lg flex items-center justify-center"
                style={{ fontSize: 'clamp(12px, 2.5vw, 16px)' }}
                disabled
              >
                {sellStatus === 'TRADING' ? '거래중' : '거래완료'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
