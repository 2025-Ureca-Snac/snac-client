'use client';

import React, { useState, useEffect } from 'react';
import FilterGroup from './filter/FilterGroup';
import TransactionTypeForm from './TransactionTypeForm';
import { Filters } from '../types';
import { useGlobalWebSocket } from '@/app/(shared)/hooks/useGlobalWebSocket';
import { useWebSocketStore } from '@/app/(shared)/stores/websocket-store';

interface FilterSectionProps {
  onFilterChange?: (filters: Filters) => void;
  onApply?: () => void;
  onReset?: () => void;
  currentFilters?: Filters;
  title?: string;
  // 판매자 등록 관련 props 추가
  onSellerInfoChange?: (info: SellerRegistrationInfo) => void;
  onToggleSellerStatus?: () => void;
  sellerInfo?: SellerRegistrationInfo;
}

export interface SellerRegistrationInfo {
  dataAmount: number;
  price: number;
  carrier: string;
  isActive: boolean;
}

// 필터 옵션 데이터
const FILTER_OPTIONS = {
  transactionType: [
    { value: '구매자', label: '구매자' },
    { value: '판매자', label: '판매자' },
  ],
  carrier: [
    { value: 'SKT', label: 'SKT' },
    { value: 'KT', label: 'KT' },
    { value: 'LG U+', label: 'LG U+' },
  ],
  dataAmount: [
    { value: '1GB', label: '1GB' },
    { value: '2GB', label: '2GB' },
  ],
  price: [
    { value: 'ALL', label: '전체' },
    { value: 'P0_1000', label: '1,000원 이하' },
    { value: 'P0_1500', label: '1,500원 이하' },
    { value: 'P0_2000', label: '2,000원 이하' },
    { value: 'P0_2500', label: '2,500원 이하' },
  ],
};

export default function FilterSection({
  onFilterChange,
  onApply,
  onReset,
  currentFilters,
  title = '실시간 매칭 조건을 선택해주세요',
  onSellerInfoChange,
  onToggleSellerStatus,
  sellerInfo,
}: FilterSectionProps) {
  const [selectedFilters, setSelectedFilters] = useState<Filters>(
    currentFilters || {
      transactionType: [],
      carrier: [],
      dataAmount: [],
      price: [],
    }
  );

  // WebSocket 연결
  useGlobalWebSocket({
    skipAuthCheck: true,
  });

  // store에서 연결된 사용자 수 가져오기
  const { connectedUsers } = useWebSocketStore();

  // 현재 선택된 거래 방식
  const currentTransactionType = selectedFilters.transactionType[0] || '';
  const isBuyer = currentTransactionType === '구매자';
  const isSeller = currentTransactionType === '판매자';

  // 판매자 등록 정보 (내부 상태)
  const [internalSellerInfo, setInternalSellerInfo] =
    useState<SellerRegistrationInfo>(
      sellerInfo || {
        dataAmount: 1,
        price: 1500,
        carrier: 'SKT',
        isActive: false,
      }
    );

  const handleFilterChange = (
    category: keyof Filters,
    value: string,
    multiSelect: boolean = true
  ) => {
    let newValues: string[];

    if (multiSelect) {
      // 다중선택: 기존 로직
      newValues = selectedFilters[
        category as keyof typeof selectedFilters
      ].includes(value)
        ? selectedFilters[category as keyof typeof selectedFilters].filter(
            (item) => item !== value
          )
        : [...selectedFilters[category as keyof typeof selectedFilters], value];
    } else {
      // 단일선택: 새로운 값으로 교체
      newValues = [value];
    }

    const newFilters = {
      ...selectedFilters,
      [category]: newValues,
    };

    setSelectedFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const resetFilters = () => {
    const emptyFilters = {
      transactionType: [],
      carrier: [],
      dataAmount: [],
      price: [],
    };
    setSelectedFilters(emptyFilters);
    onFilterChange?.(emptyFilters);
    onReset?.();
  };

  const applyFilters = () => {
    onFilterChange?.(selectedFilters);
    onApply?.();
  };

  // 판매자 정보 변경 핸들러
  const handleSellerInfoChange = (
    field: keyof SellerRegistrationInfo,
    value: string | number | boolean
  ) => {
    const newInfo = {
      ...internalSellerInfo,
      [field]: value,
    };
    setInternalSellerInfo(newInfo);
    onSellerInfoChange?.(newInfo);
  };

  const handleToggleSellerStatus = () => {
    const newInfo = {
      ...internalSellerInfo,
      isActive: !internalSellerInfo.isActive,
    };
    setInternalSellerInfo(newInfo);
    onSellerInfoChange?.(newInfo);
    onToggleSellerStatus?.();
  };

  // currentFilters가 변경될 때 selectedFilters 업데이트
  useEffect(() => {
    if (currentFilters) {
      setSelectedFilters(currentFilters);
    }
  }, [currentFilters]);

  // sellerInfo가 변경될 때 내부 상태 업데이트
  useEffect(() => {
    if (sellerInfo) {
      setInternalSellerInfo(sellerInfo);
    }
  }, [sellerInfo]);

  return (
    <section className="relative bg-black text-white py-16 px-6 overflow-hidden">
      {/* 동적 배경 요소들 */}
      <div className="absolute inset-0 z-0">
        {/* 메인 그라데이션 배경 */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-black to-black"></div>

        {/* 움직이는 글로우 원들 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse animate-float"></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse delay-1000 animate-float"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse delay-2000 animate-float"
          style={{ animationDelay: '4s' }}
        ></div>

        {/* 그리드 패턴 */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(34, 197, 94, 0.5) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        ></div>

        {/* 상단 글로우 라인 */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-60"></div>

        {/* 하단 글로우 라인 */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40"></div>
      </div>

      <div className="relative z-20 max-w-[524px] mx-auto">
        {/* 실시간 매칭 상태 표시 */}
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium text-sm text-gray-300 ">
              현재 접속자수: {connectedUsers}명
            </span>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-6 text-white">
          {title}
        </h1>

        <div className="space-y-6">
          {/* 거래 방식 선택은 항상 표시 */}
          <FilterGroup
            title="거래 방식"
            options={FILTER_OPTIONS.transactionType}
            selectedValues={selectedFilters.transactionType}
            onValueChange={(value) =>
              handleFilterChange('transactionType', value, false)
            }
            multiSelect={false}
            disabled={
              sellerInfo?.isActive && currentTransactionType === '판매자'
            }
          />

          {/* 거래 방식에 따른 폼 */}
          <TransactionTypeForm
            transactionType={currentTransactionType as '구매자' | '판매자' | ''}
            filterOptions={{
              carrier: FILTER_OPTIONS.carrier,
              dataAmount: FILTER_OPTIONS.dataAmount,
              price: FILTER_OPTIONS.price,
            }}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
            onApply={applyFilters}
            sellerInfo={internalSellerInfo}
            onSellerInfoChange={handleSellerInfoChange}
            onToggleSellerStatus={handleToggleSellerStatus}
          />

          {/* 거래 방식을 선택하지 않았을 때 */}
          {!isBuyer && !isSeller && (
            <div className="text-center py-8">
              <p className="text-gray-300">거래 방식을 선택해주세요</p>
            </div>
          )}
        </div>
      </div>

      {/* 동적 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-150px) translateX(150px);
          }
          50% {
            transform: translateY(-150px) translateX(-150px);
          }
          75% {
            transform: translateY(25px) translateX(30px);
          }
        }

        @keyframes scan {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </section>
  );
}
