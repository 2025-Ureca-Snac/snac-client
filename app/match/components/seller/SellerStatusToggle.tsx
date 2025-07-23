'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SellerRegistrationInfo } from '../FilterSection';

// Lottie Player를 동적으로 import (SSR 문제 방지)
const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false });

interface SellerStatusToggleProps {
  sellerInfo: SellerRegistrationInfo;
  onToggle: () => void;
}

export default function SellerStatusToggle({
  sellerInfo,
  onToggle,
}: SellerStatusToggleProps) {
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

  return (
    <div className="space-y-4">
      {/* 등록된 정보 표시 */}
      {sellerInfo.isActive && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            {/* Lottie 애니메이션 또는 기본 아이콘 */}
            {animationData ? (
              <div className="w-6 h-6">
                <Lottie
                  loop
                  animationData={animationData}
                  play
                  style={{ width: 24, height: 24 }}
                />
              </div>
            ) : (
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            )}
            <span className="text-green-800 font-medium">
              구매자를 찾고 있습니다
            </span>
          </div>
          <div className="text-sm text-green-700 space-y-1">
            <p>📱 통신사: {sellerInfo.carrier}</p>
            <p>
              📊 데이터량:{' '}
              {sellerInfo.dataAmount >= 1
                ? `${sellerInfo.dataAmount}GB`
                : `${sellerInfo.dataAmount * 1000}MB`}
            </p>
            <p>💰 가격: {sellerInfo.price.toLocaleString()}원</p>
          </div>
        </div>
      )}

      {/* 상태 토글 버튼 */}
      <button
        onClick={onToggle}
        className={`w-full px-6 py-4 rounded-lg font-medium transition-all duration-300 ${
          sellerInfo.isActive
            ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
            : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
        }`}
      >
        <div className="flex items-center justify-center space-x-3">
          {/* 상태 표시 - 활성화일 때 Lottie 애니메이션 */}
          {sellerInfo.isActive ? (
            <div className="flex items-center space-x-2">
              {animationData ? (
                <div className="w-4 h-4">
                  <Lottie
                    loop
                    animationData={animationData}
                    play
                    style={{ width: 16, height: 16 }}
                  />
                </div>
              ) : (
                <div className="w-3 h-3 rounded-full bg-green-300 animate-pulse"></div>
              )}
            </div>
          ) : (
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
          )}

          <span>
            {sellerInfo.isActive
              ? '판매 활성화됨 - 매칭 중'
              : '판매 비활성화됨'}
          </span>
        </div>
        <div className="text-sm opacity-75 mt-1">
          {sellerInfo.isActive
            ? '구매자들이 실시간으로 거래를 신청할 수 있습니다'
            : '거래 신청을 받지 않습니다'}
        </div>
      </button>

      {/* 비활성화 상태일 때 안내 메시지 */}
      {!sellerInfo.isActive && (
        <div className="text-center py-4">
          <div className="text-gray-500 text-sm">
            위 버튼을 눌러서 판매를 활성화하세요
          </div>
          <div className="text-xs text-gray-400 mt-1">
            활성화하면 조건에 맞는 구매자들에게 표시됩니다
          </div>
        </div>
      )}
    </div>
  );
}
