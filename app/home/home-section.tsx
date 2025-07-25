'use client';

import React, { useState } from 'react';
import { DataItemCard } from '../(shared)/components/DataItemCard';
import { isToday } from '@/app/(shared)/utils/';
import { PriceUnit } from '@/app/(shared)/types';
import ModalPortal from '@/app/(shared)/components/modal-portal';
import { useRouter } from 'next/navigation';

interface DataItem {
  id: number;
  name: string;
  createdAt: string;
  email: string;
  sellStatus: string;
  cardCategory: 'BUY' | 'SELL';
  carrier: string;
  dataAmount: number;
  price: number;
  updatedAt: string;
}

interface HomeSectionProps {
  cards: DataItem[];
  unit: PriceUnit;
}

const getCarrierImageUrl = (carrier: string): string => {
  switch (carrier) {
    case 'SKT':
      return '/SKT.png';
    case 'KT':
      return '/KT.png';
    case 'LGU+':
    case 'LG':
      return '/LG.png';
    default:
      return '/SKT.png';
  }
};

const formatCarrierName = (carrier: string): string =>
  carrier === 'LG' ? 'LGU+' : carrier;

const formatDataAmount = (amountInMB: number): string =>
  amountInMB >= 1024 && amountInMB % 1024 === 0
    ? `${amountInMB / 1024}GB`
    : `${amountInMB}MB`;

export default function HomeSection({ cards, unit }: HomeSectionProps) {
  const [modalItem, setModalItem] = useState<DataItem | null>(null);
  const router = useRouter();
  return (
    <>
      {/* 카드 그리드 */}
      <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {cards.map((item) => (
          <DataItemCard
            key={item.id}
            title={`${formatCarrierName(item.carrier)} 데이터 ${formatDataAmount(item.dataAmount)}`}
            imageUrl={getCarrierImageUrl(item.carrier)}
            price={item.price}
            isNew={isToday(item.updatedAt)}
            unit={unit}
            email={item.email}
            cardCategory={item.cardCategory}
            createdAt={item.createdAt}
            onClickBuy={() => setModalItem(item)}
          />
        ))}
      </div>

      <ModalPortal
        isOpen={!!modalItem}
        onClose={() => setModalItem(null)}
        className="bg-black bg-opacity-50 flex items-center justify-center"
      >
        {modalItem && (
          <div className="bg-white rounded-lg p-6 w-10/12 max-w-sm max-h-[60vh] overflow-y-auto">
            <h3 className="text-regular-md font-bold text-left mb-1">
              {modalItem.cardCategory === 'BUY' ? '판매하기' : '구매하기'}
            </h3>

            <p className="text-left text-regular-sm text-gray-600 mb-4">
              아래 정보를 확인해주세요
            </p>
            <h2 className="text-heading-2xl font-bold text-center mb-2">
              {formatCarrierName(modalItem.carrier)} 데이터{' '}
              {formatDataAmount(modalItem.dataAmount)}{' '}
            </h2>

            <p className="text-center mb-6">
              {modalItem.price.toLocaleString()}
              {unit === 'snack' ? '스낵' : '₩'}에{' '}
              {modalItem.cardCategory === 'BUY' ? '판매합니다' : '구매합니다'}.
            </p>

            <div className="mt-6 flex flex-col space-y-2">
              <button
                onClick={() => {
                  if (modalItem.cardCategory === 'SELL') {
                    const queryParams = new URLSearchParams({
                      email: modalItem.email,
                      createdAt: modalItem.createdAt,
                      carrier: modalItem.carrier,
                      dataAmount: modalItem.dataAmount.toString(),
                      price: modalItem.price.toString(),
                      unit: unit,
                      pay: 'sell',
                    });

                    router.push(`/payment?${queryParams.toString()}`);
                  } else {
                    const confirmed = window.confirm('판매하시겠습니까?');
                    if (confirmed) {
                      console.log('판매 확정:', modalItem);
                      // TODO: 구매자 로직 추가
                    }
                  }

                  setModalItem(null);
                }}
                className={`w-full py-2 rounded ${
                  modalItem.cardCategory === 'SELL'
                    ? 'bg-midnight-black text-white'
                    : 'bg-candy-pink text-white'
                }`}
              >
                {modalItem.cardCategory === 'SELL' ? '구매하기' : '판매하기'}
              </button>

              <button
                onClick={() => setModalItem(null)}
                className="w-full py-2 rounded border"
              >
                취소하기
              </button>
            </div>
          </div>
        )}
      </ModalPortal>
    </>
  );
}
