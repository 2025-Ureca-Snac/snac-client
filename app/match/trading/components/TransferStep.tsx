'use client';

import React from 'react';

export default function TransferStep() {
  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* 메인 카드 - 투명 배경 */}
      <div className="relative bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
        {/* 서브틀한 글로우 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-blue-300/3"></div>

        <div className="relative p-8">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-cyan-400/10 px-4 py-2 rounded-full mb-4">
              <span className="text-cyan-400 text-lg">📡</span>
              <span className="text-cyan-400 text-sm font-medium tracking-wider">
                DATA TRANSFER
              </span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-300 to-white bg-clip-text text-transparent mb-2">
              데이터 전송 대기
            </h2>
            <p className="text-gray-400">판매자가 데이터를 전송하고 있습니다</p>
          </div>

          {/* 중앙 로딩 애니메이션 */}
          <div className="text-center mb-8">
            <div className="relative mx-auto w-24 h-24 mb-6">
              {/* 외부 링 */}
              <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 border-r-cyan-300 rounded-full animate-spin"></div>
              {/* 중간 링 */}
              <div
                className="absolute inset-3 border-3 border-transparent border-b-blue-400 border-l-blue-300 rounded-full animate-spin"
                style={{
                  animationDirection: 'reverse',
                  animationDuration: '2s',
                }}
              ></div>

              {/* 글로우 효과 */}
              <div className="absolute inset-0 bg-cyan-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
            </div>

            <p className="text-gray-300 text-lg mb-2">데이터 전송 진행 중...</p>
            <p className="text-gray-500 text-sm">잠시만 기다려주세요</p>
          </div>

          {/* 전송 상태 카드 */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700/50">
            <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
              <span className="text-cyan-400">📊</span>
              <span>전송 상태</span>
            </h3>
            <div className="space-y-4">
              {/* 결제 완료 */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div className="absolute -inset-1 bg-green-400 rounded-full blur opacity-30"></div>
                </div>
                <div>
                  <div className="text-green-400 font-medium">결제 완료</div>
                  <div className="text-green-300/70 text-xs">
                    Payment Confirmed
                  </div>
                </div>
              </div>

              {/* 데이터 전송 중 */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                  </div>
                  <div className="absolute -inset-1 bg-cyan-400 rounded-full blur opacity-40 animate-pulse"></div>
                </div>
                <div>
                  <div className="text-cyan-400 font-medium">
                    데이터 전송 중...
                  </div>
                  <div className="text-cyan-300/70 text-xs">
                    Transferring Data
                  </div>
                </div>
              </div>

              {/* 전송 확인 대기 */}
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center border-2 border-gray-500">
                  <span className="text-gray-400 text-sm">⏳</span>
                </div>
                <div>
                  <div className="text-gray-400 font-medium">
                    전송 확인 대기
                  </div>
                  <div className="text-gray-500 text-xs">
                    Awaiting Confirmation
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 전송 정보 */}
          <div className="relative bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-xl p-6 mb-8 border border-blue-400/20">
            <div className="absolute inset-0 bg-blue-500/5 rounded-xl"></div>
            <div className="relative flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 text-xl">ℹ️</span>
              </div>
              <div>
                <div className="text-blue-300 font-semibold mb-2">
                  전송 정보
                </div>
                <div className="text-blue-200/80 text-sm space-y-1">
                  <p>
                    • 평균 전송 시간:{' '}
                    <span className="text-blue-300 font-medium">
                      30초 ~ 1분
                    </span>
                  </p>
                  <p>• 전송 완료 시 자동으로 다음 단계로 진행됩니다</p>
                  <p>• 네트워크 상태에 따라 시간이 다를 수 있습니다</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
