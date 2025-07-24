'use client';

import React from 'react';

interface TransferStepProps {
  onNext: () => void;
}

export default function TransferStep({ onNext }: TransferStepProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          데이터 전송 대기
        </h2>

        <div className="text-center mb-6">
          <div className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            판매자가 데이터를 전송하고 있습니다...
          </p>
          <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">전송 상태</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-sm text-gray-700">결제 완료</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-sm text-blue-600 font-medium">
                데이터 전송 중...
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-xs">⏳</span>
              </div>
              <span className="text-sm text-gray-500">전송 확인 대기</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 text-lg">ℹ️</span>
            <div>
              <div className="font-medium text-blue-800">전송 정보</div>
              <div className="text-sm text-blue-700 mt-1">
                평균 전송 시간: 30초 ~ 1분
                <br />
                전송 완료 시 자동으로 다음 단계로 진행됩니다.
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          전송 완료 확인 (시뮬레이션)
        </button>
      </div>
    </div>
  );
}
