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
      .catch(() => {
        //.error('Lottie 애니메이션 로드 실패:', error);
      });
  }, []);

  return (
    <div className="space-y-4">
      {/* 등록된 정보 표시 */}

      {/* 상태 토글 버튼 - 형광블랙 컨셉 */}
      <button
        onClick={onToggle}
        className={`relative w-full px-6 py-5 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 text-white shadow-lg hover:shadow-xl ${
          sellerInfo.isActive
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-2 border-green-400'
            : 'bg-gradient-to-r from-slate-700 to-gray-800 border-2 border-slate-500 hover:border-slate-400 animate-pulse'
        }`}
      >
        <div className="flex items-center justify-center space-x-3">
          {/* 상태 표시 - 활성화일 때 형광 효과 */}
          {sellerInfo.isActive ? (
            <div className="flex items-center space-x-2">
              {animationData ? (
                <div className="w-5 h-5">
                  <Lottie
                    loop
                    animationData={animationData}
                    play
                    style={{ width: 20, height: 20 }}
                  />
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full bg-green-300 animate-pulse shadow-lg shadow-green-300/50"></div>
              )}
              <span className="text-lg">판매 활성화됨 - 매칭 중</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-slate-400 border-2 border-slate-300 shadow-md animate-bounce"></div>
              <span className="text-lg animate-pulse">판매 비활성화됨</span>
            </div>
          )}
        </div>

        {/* 서브 텍스트 */}
        <div
          className={`text-sm mt-2 ${
            sellerInfo.isActive ? 'text-green-100' : 'text-slate-200'
          }`}
        >
          {sellerInfo.isActive
            ? '구매자들이 실시간으로 거래를 신청할 수 있습니다'
            : '버튼을 눌러서 판매를 활성화하세요'}
        </div>

        {/* 활성화 상태일 때 추가 시각적 효과 */}
        {sellerInfo.isActive && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 to-emerald-400/20 animate-pulse pointer-events-none"></div>
        )}

        {/* 비활성화 상태일 때 추가 시각적 효과 */}
        {!sellerInfo.isActive && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-slate-400/10 to-gray-400/10 animate-pulse pointer-events-none"></div>
        )}
      </button>

      {sellerInfo.isActive && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 shadow-lg">
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
            <span className="text-gray-950 font-semibold">
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
    </div>
  );
}
