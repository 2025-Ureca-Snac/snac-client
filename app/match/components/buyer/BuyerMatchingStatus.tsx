'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Filters } from '../../types';

// Lottie Player를 동적으로 import (SSR 문제 방지)
const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false });

interface BuyerMatchingStatusProps {
  appliedFilters: Filters;
  isSearching: boolean;
  foundUsersCount?: number;
  onGoBack?: () => void;
}

// 필터 값을 사용자 친화적인 이름으로 변환하기 위한 옵션
const FILTER_OPTIONS: Record<keyof Filters, Record<string, string>> = {
  transactionType: {
    구매자: '구매자',
    판매자: '판매자',
  },
  carrier: {
    SKT: 'SKT',
    KT: 'KT',
    'LG U+': 'LG U+',
  },
  dataAmount: {
    '1GB': '1GB',
    '2GB': '2GB',
  },
  price: {
    ALL: '전체',
    P0_1000: '1,000원 이하',
    P0_1500: '1,500원 이하',
    P0_2000: '2,000원 이하',
    P0_2500: '2,500원 이하',
  },
};

// 필터 값을 사용자 친화적인 이름으로 변환하는 유틸리티 함수
const getFilterDisplayName = (
  category: keyof Filters,
  value: string
): string => {
  return FILTER_OPTIONS[category]?.[value] || value;
};

// 필터 배열을 사용자 친화적인 이름으로 변환하는 함수
const getFilterDisplayNames = (
  category: keyof Filters,
  values: string[]
): string => {
  return values
    .map((value) => getFilterDisplayName(category, value))
    .join(', ');
};

export default function BuyerMatchingStatus({
  appliedFilters,
  isSearching,
  foundUsersCount = 0,
  onGoBack,
}: BuyerMatchingStatusProps) {
  const [animationData, setAnimationData] = useState(null);

  // Lottie 애니메이션 데이터 로드
  useEffect(() => {
    fetch('/searching-lotties.json')
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch(() => {
        //.error('Lottie 애니메이션 로드 실패:', error);
      });
  }, []);

  // 구매자 모드가 아니면 표시하지 않음
  if (!appliedFilters.transactionType.includes('구매자')) {
    return null;
  }

  return (
    <div className="relative bg-black text-white py-12 px-6 overflow-hidden">
      {/* 동적 배경 요소들 */}
      <div className="absolute inset-0 z-0">
        {/* 메인 그라데이션 배경 */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-black to-black"></div>

        {/* 움직이는 글로우 원들 */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animate-float"></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse delay-1000 animate-float"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse delay-2000 animate-float"
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

      <div className="relative z-20 max-w-[524px] mx-auto text-center">
        {/* 뒤로가기 버튼 */}
        {onGoBack && (
          <button
            onClick={onGoBack}
            className="absolute top-4 left-4 flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>검색 조건 수정</span>
          </button>
        )}

        {/* 검색 아이콘 - Lottie 애니메이션 */}
        <div className="mb-8 flex justify-center">
          <div className="w-32 h-32 flex items-center justify-center">
            {animationData ? (
              <Lottie
                loop
                animationData={animationData}
                play={isSearching}
                style={{ width: 120, height: 120 }}
              />
            ) : (
              <div className="w-32 h-32  rounded-full animate-pulse flex items-center justify-center"></div>
            )}
          </div>
        </div>

        {/* 매칭 상태 메시지 */}
        <div className="mb-8">
          {isSearching ? (
            <h2 className="text-2xl font-semibold mb-2">
              매칭 상대를 찾는 중...
            </h2>
          ) : (
            <h2 className="text-2xl font-semibold mb-2">
              {foundUsersCount > 0
                ? `${foundUsersCount}명의 판매자를 찾았습니다`
                : '조건에 맞는 판매자가 없습니다'}
            </h2>
          )}
        </div>

        {/* 내 검색 조건 표시 */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-green-400/30 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium mb-3">내 검색 조건</h3>
          <div className="space-y-2 text-sm">
            {appliedFilters.carrier.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-300">통신사:</span>
                <span className="text-white">
                  {getFilterDisplayNames('carrier', appliedFilters.carrier)}
                </span>
              </div>
            )}
            {appliedFilters.dataAmount.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-300">데이터량:</span>
                <span className="text-white">
                  {getFilterDisplayNames(
                    'dataAmount',
                    appliedFilters.dataAmount
                  )}
                </span>
              </div>
            )}
            {appliedFilters.price.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-300">가격:</span>
                <span className="text-white">
                  {getFilterDisplayNames('price', appliedFilters.price)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 새로운 검색 버튼 (검색 완료 후 표시) */}
        {!isSearching && onGoBack && (
          <button
            onClick={onGoBack}
            className="w-full bg-green-500/20 border border-green-400/50 text-green-400 py-3 px-6 rounded-lg font-medium hover:bg-green-500/30 hover:border-green-400/70 transition-all duration-300 mb-4"
          >
            🔄 다른 조건으로 다시 검색하기
          </button>
        )}

        {/* 찾기 중일 때 로딩 표시 */}
        {isSearching && (
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-transparent border-t-green-400 border-r-cyan-400"></div>
              <div
                className="absolute inset-0 animate-spin rounded-full h-6 w-6 border-2 border-transparent border-b-purple-400 border-l-green-400"
                style={{
                  animationDirection: 'reverse',
                  animationDuration: '1.5s',
                }}
              ></div>
              <div className="absolute inset-1 bg-green-400/20 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>

      {/* 동적 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-10px) translateX(5px);
          }
          50% {
            transform: translateY(-5px) translateX(-5px);
          }
          75% {
            transform: translateY(5px) translateX(10px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
