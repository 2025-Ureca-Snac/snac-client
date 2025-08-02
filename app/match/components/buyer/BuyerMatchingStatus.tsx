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
      .catch((error) => {
        console.error('Lottie 애니메이션 로드 실패:', error);
      });
  }, []);

  // 구매자 모드가 아니면 표시하지 않음
  if (!appliedFilters.transactionType.includes('구매자')) {
    return null;
  }

  return (
    <div className="bg-gradient-to-b from-green-900 to-black text-white py-12 px-6 relative">
      <div className="max-w-[524px] mx-auto text-center">
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
          {isSearching && animationData ? (
            <div className="w-16 h-16">
              <Lottie
                loop
                animationData={animationData}
                play
                style={{ width: 64, height: 64 }}
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full border-2 border-green-400 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          )}
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
        <div className="bg-black/30 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium mb-3">내 검색 조건</h3>
          <div className="space-y-2 text-sm">
            {appliedFilters.carrier.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-300">통신사:</span>
                <span className="text-white">
                  {appliedFilters.carrier.join(', ')}
                </span>
              </div>
            )}
            {appliedFilters.dataAmount.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-300">데이터량:</span>
                <span className="text-white">
                  {appliedFilters.dataAmount.join(', ')}
                </span>
              </div>
            )}
            {appliedFilters.price.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-300">가격:</span>
                <span className="text-white">
                  {appliedFilters.price.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 새로운 검색 버튼 (검색 완료 후 표시) */}
        {!isSearching && onGoBack && (
          <button
            onClick={onGoBack}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors mb-4"
          >
            🔄 다른 조건으로 다시 검색하기
          </button>
        )}

        {/* 찾기 중일 때 로딩 표시 */}
        {isSearching && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400"></div>
          </div>
        )}
      </div>
    </div>
  );
}
