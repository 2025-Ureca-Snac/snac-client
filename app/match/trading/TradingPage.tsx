'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../(shared)/components/Header';
import { Footer } from '../../(shared)/components/Footer';
import { useMatchStore } from '../../(shared)/stores/match-store';
import { useGlobalWebSocket } from '../../(shared)/hooks/useGlobalWebSocket';
import TradingHeader from './components/TradingHeader';
import TradingSteps from './components/TradingSteps';
import ConfirmationStep from './components/ConfirmationStep';
import PaymentStep from './components/PaymentStep';
import TransferStep from './components/TransferStep';
import VerificationStep from './components/VerificationStep';
import WaitingPaymentStep from './components/WaitingPaymentStep';
import ShowPhoneStep from './components/ShowPhoneStep';
import UploadDataStep from './components/UploadDataStep';

type TradingStep =
  | 'confirmation'
  | 'payment'
  | 'transfer'
  | 'verification'
  | 'waiting_payment' // 구매자 결제 대기 (판매자용)
  | 'show_phone' // 구매자 핸드폰번호 표시 (판매자용)
  | 'upload_data'; // 데이터 전송 (판매자용)

// 구매자용 거래 단계
const BUYER_TRADING_STEPS: TradingStep[] = [
  'confirmation',
  'payment',
  'transfer',
  'verification',
];

// 판매자용 거래 단계
const SELLER_TRADING_STEPS: TradingStep[] = [
  'confirmation',
  'waiting_payment', // 구매자 결제 대기
  'show_phone', // 구매자 핸드폰번호 표시
  'upload_data', // 데이터 전송 (스크린샷 업로드)
  'verification', // 거래 완료 확인
];

export default function TradingPage() {
  const router = useRouter();
  const { partner, sendTradeConfirm } = useMatchStore();
  const [currentStep, setCurrentStep] = useState<TradingStep>('confirmation');
  const [timeLeft, setTimeLeft] = useState(300); // 5분 제한
  const [isValidPartner, setIsValidPartner] = useState(false);
  // 전역 WebSocket 연결 유지
  useGlobalWebSocket();

  // 현재 사용자가 판매자인지 구매자인지 판단
  const isSeller = partner?.type === 'buyer';
  // 사용자 역할에 따른 거래 단계 설정
  const TRADING_STEPS = isSeller ? SELLER_TRADING_STEPS : BUYER_TRADING_STEPS;

  // 보안: partner 정보가 없으면 매칭 페이지로 리다이렉트
  useEffect(() => {
    if (!partner) {
      console.warn('❌ 유효하지 않은 거래 정보: partner 정보가 없습니다.');
      alert('유효하지 않은 거래 정보입니다. 매칭 페이지로 이동합니다.');
      router.push('/match');
      return;
    }
    // partner 정보 유효성 검증
    if (
      !partner.tradeId ||
      !partner.carrier ||
      !partner.dataAmount ||
      !partner.priceGb
    ) {
      console.warn('❌ 불완전한 거래 정보:', partner);
      alert('거래 정보가 불완전합니다. 매칭 페이지로 이동합니다.');
      router.push('/match');
      return;
    }

    console.log('✅ 유효한 거래 정보 확인:', partner);
    setIsValidPartner(true);
  }, [partner, router]);

  // 거래 시간 제한 처리
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

  // partner 정보가 유효하지 않으면 로딩 표시
  if (!isValidPartner) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">거래 정보를 확인하는 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 이제 partner는 항상 유효함 (MatchPartner 타입 그대로 사용)
  const partnerInfo = partner!;
  console.log(partnerInfo, 'partnerInfo');

  const handleNextStep = () => {
    const currentIndex = TRADING_STEPS.indexOf(currentStep);

    if (currentIndex < TRADING_STEPS.length - 1) {
      setCurrentStep(TRADING_STEPS[currentIndex + 1]);
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
    // 판매자인 경우
    if (isSeller) {
      switch (currentStep) {
        case 'confirmation':
          return (
            <ConfirmationStep
              partner={partnerInfo}
              onNext={handleNextStep}
              onCancel={handleCancel}
            />
          );

        case 'waiting_payment':
          return <WaitingPaymentStep partner={partnerInfo} />;

        case 'show_phone':
          return (
            <ShowPhoneStep
              partner={partnerInfo}
              buyerPhone={partnerInfo.phone}
              onNext={handleNextStep}
            />
          );

        case 'upload_data':
          return (
            <UploadDataStep partner={partnerInfo} onNext={handleNextStep} />
          );

        case 'verification':
          return (
            <VerificationStep
              dataAmount={partnerInfo.dataAmount}
              timeLeft={timeLeft}
              tradeId={partnerInfo.tradeId}
              sendTradeConfirm={sendTradeConfirm}
              onNext={handleNextStep}
            />
          );

        default:
          return null;
      }
    }

    // 구매자인 경우 (기존 로직)
    else {
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
            <PaymentStep
              amount={partnerInfo.priceGb}
              tradeId={partnerInfo.tradeId}
              onNext={handleNextStep}
            />
          );

        case 'transfer':
          return <TransferStep onNext={handleNextStep} />;

        case 'verification':
          return (
            <VerificationStep
              dataAmount={partnerInfo.dataAmount}
              timeLeft={timeLeft}
              tradeId={partnerInfo.tradeId}
              sendTradeConfirm={sendTradeConfirm}
              onNext={handleNextStep}
            />
          );

        default:
          return null;
      }
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
                🔧 테스트 단계 ({isSeller ? '판매자' : '구매자'})
              </h4>
              <div className="space-y-2">
                {isSeller ? (
                  // 판매자용 테스트 버튼
                  <>
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
                      onClick={() => setCurrentStep('waiting_payment')}
                      className={`block w-full px-3 py-2 rounded text-xs transition-colors ${
                        currentStep === 'waiting_payment'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      결제 대기
                    </button>
                    <button
                      onClick={() => setCurrentStep('show_phone')}
                      className={`block w-full px-3 py-2 rounded text-xs transition-colors ${
                        currentStep === 'show_phone'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      핸드폰번호 표시
                    </button>
                    <button
                      onClick={() => setCurrentStep('upload_data')}
                      className={`block w-full px-3 py-2 rounded text-xs transition-colors ${
                        currentStep === 'upload_data'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      데이터 업로드
                    </button>
                    <button
                      onClick={() => setCurrentStep('verification')}
                      className={`block w-full px-3 py-2 rounded text-xs transition-colors ${
                        currentStep === 'verification'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      거래 완료
                    </button>
                  </>
                ) : (
                  // 구매자용 테스트 버튼
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
