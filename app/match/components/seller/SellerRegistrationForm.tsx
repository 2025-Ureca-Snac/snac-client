'use client';

import React from 'react';
import { SellerRegistrationInfo } from '../FilterSection';
import CarrierSelect from './CarrierSelect';
import DataAmountInput from './DataAmountInput';
import PriceInput from './PriceInput';
import SellerStatusToggle from './SellerStatusToggle';

interface SellerRegistrationFormProps {
  sellerInfo: SellerRegistrationInfo;
  onSellerInfoChange: (
    field: keyof SellerRegistrationInfo,
    value: string | number | boolean
  ) => void;
  onToggleStatus: () => void;
}

export default function SellerRegistrationForm({
  sellerInfo,
  onSellerInfoChange,
  onToggleStatus,
}: SellerRegistrationFormProps) {
  return (
    <div className="space-y-6">
      {/* 통신사 선택 */}
      <CarrierSelect
        value={sellerInfo.carrier}
        onChange={(value) => onSellerInfoChange('carrier', value)}
      />

      {/* 데이터량 입력 */}
      <DataAmountInput
        value={sellerInfo.dataAmount}
        onChange={(value) => onSellerInfoChange('dataAmount', value)}
      />

      {/* 가격 입력 */}
      <PriceInput
        value={sellerInfo.price}
        onChange={(value) => onSellerInfoChange('price', value)}
      />

      {/* 판매 상태 토글 */}
      <SellerStatusToggle sellerInfo={sellerInfo} onToggle={onToggleStatus} />
    </div>
  );
}
