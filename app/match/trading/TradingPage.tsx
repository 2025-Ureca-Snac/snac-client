'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../(shared)/components/Header';
import { Footer } from '../../(shared)/components/Footer';

type TradingStep = 'confirmation' | 'payment' | 'transfer' | 'verification';

export default function TradingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<TradingStep>('confirmation');
  const [timeLeft, setTimeLeft] = useState(300); // 5분 제한

  useEffect(() => {
    if (timeLeft <= 0) {
      // 시간 초과 시 매칭 취소
      router.push('/match');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, router]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextStep = () => {
    const steps: TradingStep[] = [
      'confirmation',
      'payment',
      'transfer',
      'verification',
    ];
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      // 거래 완료
      router.push('/match/complete');
    }
  };

  const handleCancel = () => {
    if (confirm('거래를 취소하시겠습니까?')) {
      router.push('/match');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'confirmation':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">거래 정보 확인</h2>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3">
                거래 상대방 정보
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">닉네임:</span> user07
                </p>
                <p>
                  <span className="font-medium">평점:</span> ⭐⭐⭐⭐⭐ (4.8)
                </p>
                <p>
                  <span className="font-medium">거래 횟수:</span> 156회
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3">거래 내용</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">데이터량:</span> 2GB
                </p>
                <p>
                  <span className="font-medium">가격:</span> 2,000원
                </p>
                <p>
                  <span className="font-medium">통신사:</span> KT
                </p>
                <p>
                  <span className="font-medium">거래 방식:</span> 즉시 전송
                </p>
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              거래 진행하기
            </button>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">결제 진행</h2>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800 text-sm">
                💡 안전한 거래를 위해 에스크로 시스템을 통해 결제합니다.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border p-4 rounded-lg">
                <h3 className="font-semibold mb-2">결제 정보</h3>
                <p className="text-2xl font-bold text-blue-600">2,000원</p>
                <p className="text-sm text-gray-600 mt-1">수수료 포함</p>
              </div>

              <div className="space-y-2">
                <button className="w-full border-2 border-blue-600 text-blue-600 py-3 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  카드 결제
                </button>
                <button className="w-full border-2 border-gray-300 text-gray-600 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  계좌 이체
                </button>
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              결제 완료 (시뮬레이션)
            </button>
          </div>
        );

      case 'transfer':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">
              데이터 전송 대기
            </h2>

            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">
                판매자가 데이터를 전송하고 있습니다...
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">전송 상태</h3>
              <div className="space-y-2 text-sm">
                <p>✅ 결제 완료</p>
                <p>🔄 데이터 전송 중...</p>
                <p>⏳ 전송 확인 대기</p>
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              전송 완료 확인 (시뮬레이션)
            </button>
          </div>
        );

      case 'verification':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">거래 확인</h2>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-3">전송 완료!</h3>
              <p className="text-green-700 text-sm">
                2GB 데이터가 성공적으로 전송되었습니다.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border p-4 rounded-lg">
                <h3 className="font-semibold mb-2">전송 내역</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>전송량: 2GB</p>
                  <p>전송 시간: {new Date().toLocaleTimeString()}</p>
                  <p>잔여 시간: {formatTime(timeLeft)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">거래 평가</h4>
                <div className="flex space-x-2">
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

            <button
              onClick={handleNextStep}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              거래 완료
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepProgress = () => {
    const steps: TradingStep[] = [
      'confirmation',
      'payment',
      'transfer',
      'verification',
    ];
    return ((steps.indexOf(currentStep) + 1) / steps.length) * 100;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* 진행률 표시 */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-lg font-bold">실시간 거래</h1>
              <div className="text-sm font-mono text-red-600">
                {formatTime(timeLeft)}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getStepProgress()}%` }}
              ></div>
            </div>
          </div>

          {/* 단계별 콘텐츠 */}
          {renderStepContent()}

          {/* 취소 버튼 */}
          <button
            onClick={handleCancel}
            className="w-full mt-4 bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            거래 취소
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
