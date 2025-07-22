'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../(shared)/components/Header';
import { Footer } from '../../(shared)/components/Footer';

export default function CompletePage() {
  const router = useRouter();

  const handleNewMatch = () => {
    router.push('/match');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              거래 완료! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              성공적으로 거래가 완료되었습니다.
              <br />
              이용해 주셔서 감사합니다.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-green-50 p-4 rounded-lg text-left">
              <h3 className="font-semibold text-green-800 mb-3">거래 요약</h3>
              <div className="space-y-2 text-sm text-green-700">
                <p>
                  <span className="font-medium">거래 상대:</span> user07
                </p>
                <p>
                  <span className="font-medium">데이터량:</span> 2GB
                </p>
                <p>
                  <span className="font-medium">거래 금액:</span> 2,000원
                </p>
                <p>
                  <span className="font-medium">완료 시간:</span>{' '}
                  {new Date().toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg text-left">
              <h3 className="font-semibold text-blue-800 mb-3">💰 적립 내역</h3>
              <div className="space-y-2 text-sm text-blue-700">
                <p>
                  <span className="font-medium">거래 완료 적립금:</span> +100P
                </p>
                <p>
                  <span className="font-medium">첫 거래 보너스:</span> +50P
                </p>
                <p>
                  <span className="font-medium">총 적립 포인트:</span> 150P
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg text-left">
              <h3 className="font-semibold text-yellow-800 mb-3">
                ⭐ 평가하기
              </h3>
              <p className="text-sm text-yellow-700 mb-3">
                거래 상대방을 평가해 주세요
              </p>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="text-2xl hover:text-yellow-400 transition-colors"
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleNewMatch}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              새로운 매칭 시작
            </button>

            <button
              onClick={handleGoHome}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              홈으로 돌아가기
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">
              문의사항이 있으시면 고객센터(1588-0000)로 연락해 주세요.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
