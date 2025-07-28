'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ModalPortal from './modal-portal';
import { PriceUnit } from '../types';

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
  ratingScore: number;
}

interface TradeConfirmationModalProps {
  modalItem: DataItem | null;
  onClose: () => void;
  unit: PriceUnit;
}

const formatCarrierName = (carrier: string): string =>
  carrier === 'LG' ? 'LGU+' : carrier;

const formatDataAmount = (amountInMB: number): string =>
  amountInMB >= 1024 && amountInMB % 1024 === 0
    ? `${amountInMB / 1024}GB`
    : `${amountInMB}MB`;

export default function TradeConfirmationModal({
  modalItem,
  onClose,
  unit,
}: TradeConfirmationModalProps) {
  const router = useRouter();

  const handleConfirm = () => {
    if (!modalItem) return;

    if (modalItem.cardCategory === 'SELL') {
      const queryParams = new URLSearchParams({
        id: modalItem.id.toString(),
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

    onClose();
  };

  return (
    <ModalPortal
      isOpen={!!modalItem}
      onClose={onClose}
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
              onClick={handleConfirm}
              className={`w-full py-2 rounded ${
                modalItem.cardCategory === 'SELL'
                  ? 'bg-midnight-black text-white'
                  : 'bg-candy-pink text-white'
              }`}
            >
              {modalItem.cardCategory === 'SELL' ? '구매하기' : '판매하기'}
            </button>

            <button onClick={onClose} className="w-full py-2 rounded border">
              취소하기
            </button>
          </div>
        </div>
      )}
    </ModalPortal>
  );
}
