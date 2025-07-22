'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../(shared)/components/Header';
import { Footer } from '../../(shared)/components/Footer';
import { useMatchStore } from '../../(shared)/stores/match-store';
import TradingHeader from './components/TradingHeader';
import TradingSteps from './components/TradingSteps';
import ConfirmationStep from './components/ConfirmationStep';
import PaymentStep from './components/PaymentStep';
import TransferStep from './components/TransferStep';
import VerificationStep from './components/VerificationStep';

type TradingStep = 'confirmation' | 'payment' | 'transfer' | 'verification';

export default function TradingPage() {
  const router = useRouter();
  const { partner } = useMatchStore();
  const [currentStep, setCurrentStep] = useState<TradingStep>('confirmation');
  const [timeLeft, setTimeLeft] = useState(300); // 5분 제한

  // 거래 상대방 정보 (store에서 가져오거나 기본값)
  const partnerInfo = partner || {
    id: 'partner_789',
    name: 'user07',
    carrier: 'KT',
    data: 2,
    price: 2000,
    rating: 4.9,
    transactionCount: 156,
    type: 'seller',
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      // 시간 초과 시 매칭 취소
      alert('거래 시간이 초과되었습니다. 매칭 페이지로 돌아갑니다.');
      router.push('/match');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, router]);

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
    if (confirm('거래를 취소하시겠습니까? 패널티가 부과될 수 있습니다.')) {
      router.push('/match');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'confirmation':
        return (
          <ConfirmationStep
            partner={partnerInfo}
            onNext={handleNextStep}
            onCancel={handleCancel}
          />
        );

      case 'payment':
        return (
          <PaymentStep amount={partnerInfo.price} onNext={handleNextStep} />
        );

      case 'transfer':
        return <TransferStep onNext={handleNextStep} />;

      case 'verification':
        return (
          <VerificationStep
            dataAmount={partnerInfo.data}
            timeLeft={timeLeft}
            onNext={handleNextStep}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* 헤더 */}
      <TradingHeader timeLeft={timeLeft} currentStep={currentStep} />

      {/* 단계 표시 */}
      <TradingSteps currentStep={currentStep} />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 px-4 py-6">
        {renderStepContent()}

        {/* 취소 버튼 */}
        <div className="max-w-2xl mx-auto mt-6">
          <button
            onClick={handleCancel}
            className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            거래 취소
          </button>
        </div>

        {/* 개발용 테스트 버튼들 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h4 className="text-white text-sm font-medium mb-3">
                🔧 테스트 단계
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => setCurrentStep('confirmation')}
                  className={`block w-full px-3 py-2 rounded text-xs transition-colors ${
                    currentStep === 'confirmation'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  거래 확인
                </button>
                <button
                  onClick={() => setCurrentStep('payment')}
                  className={`block w-full px-3 py-2 rounded text-xs transition-colors ${
                    currentStep === 'payment'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  결제
                </button>
                <button
                  onClick={() => setCurrentStep('transfer')}
                  className={`block w-full px-3 py-2 rounded text-xs transition-colors ${
                    currentStep === 'transfer'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  이체
                </button>
                <button
                  onClick={() => setCurrentStep('verification')}
                  className={`block w-full px-3 py-2 rounded text-xs transition-colors ${
                    currentStep === 'verification'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  인증
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
