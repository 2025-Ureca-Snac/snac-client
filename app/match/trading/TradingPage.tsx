'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useMatchStore } from '../../(shared)/stores/match-store';
import { useAuthStore } from '../../(shared)/stores/auth-store';
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
import TradeCancelModal from '@/app/(shared)/components/TradeCancelModal';
import { Header } from '@/app/(shared)/components/Header';

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
  const { partner, setUserRole, userRole, updatePartner } = useMatchStore();
  const [currentStep, setCurrentStep] = useState<TradingStep>('confirmation');
  const [timeLeft, setTimeLeft] = useState(3000); // 5분 제한
  const [isValidPartner, setIsValidPartner] = useState(false);

  // TradingPage 진입 시 matchPageRefreshed 세션스토리지 아이템을 false로 설정
  useEffect(() => {
    console.log('🔄 TradingPage 진입 - matchPageRefreshed 플래그 초기화');
    sessionStorage.setItem('matchPageRefreshed', 'false');
  }, []);

  // 현재 사용자가 판매자인지 구매자인지 판단
  // partner.buyer가 현재 사용자라면 구매자, partner.seller가 현재 사용자라면 판매자
  const { user } = useAuthStore();
  const isSeller = partner?.seller === user;

  // matchStore에서 파트너 정보 직접 사용 (null 체크 후 사용)
  const partnerInfo = useMatchStore.getState().partner;

  // 디버깅: 파트너 정보 변경 시 로그 출력
  useEffect(() => {
    console.log('🔄 TradingPage partnerInfo 업데이트:', partnerInfo);
  }, [partnerInfo]);
  // 전역 WebSocket 연결 유지
  const { activatePage, deactivatePage, sendTradeCancel } =
    useGlobalWebSocket();

  // TradingPage 활성화
  useEffect(() => {
    activatePage('trading', (status, tradeData) => {
      console.log('🔔 거래 상태 변경 오는거맞냐:', {
        status,
        tradeData,
        userRole,
        isSeller,
      });
      console.log('userRole확인!!!:', userRole);

      // PAYMENT_CONFIRMED 상태일 때 show_phone 단계로 이동 (판매자용)
      if (status === 'PAYMENT_CONFIRMED' && userRole === 'seller') {
        console.log('💰 결제 확인됨 - show_phone 단계로 이동');
        setCurrentStep('show_phone');
      }
      // DATA_SENT 상태일 때 verification 단계로 이동 (구매자용)
      else if (status === 'DATA_SENT' && userRole === 'buyer') {
        console.log('📤 데이터 전송됨 - verification 단계로 이동');
        setCurrentStep('verification');
      }
      // COMPLETED 상태일 때 거래 완료 페이지로 이동 (모든 사용자)
      else if (status === 'COMPLETED') {
        console.log('🎉 거래 완료 - 완료 페이지로 이동');
        router.push('/match/complete');
      } else {
        console.log('❌ 조건 불일치:', {
          status,
          userRole,
          isSeller,
          isPaymentConfirmed: status === 'PAYMENT_CONFIRMED',
          isSellerRole: userRole === 'seller',
          isDataSent: status === 'DATA_SENT',
          isBuyerRole: userRole === 'buyer',
          isCompleted: status === 'COMPLETED',
        });
      }
    });
    return () => {
      deactivatePage('trading');
    };
  }, [
    activatePage,
    deactivatePage,
    userRole,
    isSeller,
    setCurrentStep,
    router,
  ]);
  // 사용자 역할에 따른 거래 단계 설정
  const TRADING_STEPS = isSeller ? SELLER_TRADING_STEPS : BUYER_TRADING_STEPS;

  // userRole 설정 및 partner.type 수정
  useEffect(() => {
    if (partner) {
      const role = isSeller ? 'seller' : 'buyer';
      setUserRole(role);

      // partner.type을 현재 사용자의 역할로 올바르게 설정
      if (partner.type !== role) {
        updatePartner({ type: role });
        console.log('🔄 partner.type 업데이트:', role);
      }

      console.log('🔄 userRole 설정:', role);
    }
  }, [partner, isSeller, setUserRole, updatePartner]);

  // 보안: partner 정보가 없으면 매칭 페이지로 리다이렉트
  useEffect(() => {
    if (!partner) {
      console.warn('❌ 유효하지 않은 거래 정보: partner 정보가 없습니다.');
      alert('유효하지 않은 거래 정보입니다. 매칭 페이지로 이동합니다.');
      router.push('/match');
      return;
    }
    // partner 정보 유효성 검증
    if (!partner.carrier || !partner.dataAmount || !partner.priceGb) {
      console.warn('❌ 불완전한 거래 정보:', partner);
      alert('거래 정보가 불완전합니다. 매칭 페이지로 이동합니다.');
      router.push('/match');
      return;
    }

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
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">거래 정보를 확인하는 중...</p>
          </div>
        </main>
      </div>
    );
  }

  // partnerInfo는 위에서 이미 선언됨 (partner와 동일)

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
      // WebSocket을 통해 거래 취소 메시지 전송
      const tradeId = partnerInfo?.tradeId;
      if (isSeller) {
        // 판매자인 경우
        sendTradeCancel('seller', currentStep, tradeId);
      } else {
        // 구매자인 경우
        sendTradeCancel('buyer', currentStep, tradeId);
      }

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
              partner={partnerInfo!}
              onNext={handleNextStep}
              onCancel={handleCancel}
            />
          );

        case 'waiting_payment':
          return <WaitingPaymentStep partner={partnerInfo!} />;

        case 'show_phone':
          return (
            <ShowPhoneStep
              partner={partnerInfo!}
              buyerPhone={partnerInfo!.phone}
              onNext={handleNextStep}
            />
          );

        case 'upload_data':
          return (
            <UploadDataStep
              partner={partnerInfo!}
              tradeId={partnerInfo!.tradeId}
              onNext={handleNextStep}
            />
          );

        case 'verification':
          return (
            <VerificationStep
              dataAmount={partnerInfo!.dataAmount}
              timeLeft={timeLeft}
              tradeId={partnerInfo!.tradeId}
              userRole={userRole || 'seller'}
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
              partner={partnerInfo!}
              onNext={handleNextStep}
              onCancel={handleCancel}
            />
          );

        case 'payment':
          return (
            <PaymentStep
              amount={partnerInfo!.priceGb}
              tradeId={partnerInfo!.tradeId}
              onNext={handleNextStep}
            />
          );

        case 'transfer':
          return <TransferStep />;

        case 'verification':
          return (
            <VerificationStep
              dataAmount={partnerInfo!.dataAmount}
              timeLeft={timeLeft}
              tradeId={partnerInfo!.tradeId}
              userRole={userRole || 'buyer'}
              onNext={handleNextStep}
            />
          );

        default:
          return null;
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-400/5 via-transparent to-green-300/3">
      {/* 헤더 */}
      <TradingHeader
        timeLeft={timeLeft}
        currentStep={currentStep}
        userRole={userRole}
      />

      {/* 단계 표시 */}
      <TradingSteps currentStep={currentStep} userRole={userRole} />

      {/* 메인 콘텐츠 */}
      <main className="relative flex-1 px-4 py-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        {/* 배경 글로우 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-green-300/3"></div>
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse delay-1000"></div>

        <div className="relative z-10">
          {renderStepContent()}

          {/* 취소 버튼 */}
          <div className="max-w-2xl mx-auto mt-8">
            <button
              onClick={handleCancel}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-red-500 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-red-500/25 border border-red-500/30"
            >
              거래 취소
            </button>
          </div>
        </div>

        {/* 개발용 테스트 버튼들 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl shadow-2xl border border-green-400/20 backdrop-blur-sm">
              <h4 className="text-green-400 text-sm font-medium mb-3">
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
                          ? 'bg-green-500 text-black font-semibold'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                      }`}
                    >
                      거래 확인
                    </button>
                    <button
                      onClick={() => setCurrentStep('waiting_payment')}
                      className={`block w-full px-3 py-2 rounded text-xs transition-colors ${
                        currentStep === 'waiting_payment'
                          ? 'bg-green-500 text-black font-semibold'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                      }`}
                    >
                      결제 대기
                    </button>
                    <button
                      onClick={() => setCurrentStep('show_phone')}
                      className={`block w-full px-3 py-2 rounded text-xs transition-colors ${
                        currentStep === 'show_phone'
                          ? 'bg-green-500 text-black font-semibold'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                      }`}
                    >
                      핸드폰번호 표시
                    </button>
                    <button
                      onClick={() => setCurrentStep('upload_data')}
                      className={`block w-full px-3 py-2 rounded text-xs transition-colors ${
                        currentStep === 'upload_data'
                          ? 'bg-green-500 text-black font-semibold'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                      }`}
                    >
                      데이터 업로드
                    </button>
                    <button
                      onClick={() => setCurrentStep('verification')}
                      className={`block w-full px-3 py-2 rounded text-xs transition-colors ${
                        currentStep === 'verification'
                          ? 'bg-green-500 text-black font-semibold'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
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
                          ? 'bg-green-500 text-black font-semibold'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                      }`}
                    >
                      거래 확인
                    </button>
                    <button
                      onClick={() => setCurrentStep('payment')}
                      className={`block w-full px-3 py-2 rounded text-xs transition-colors ${
                        currentStep === 'payment'
                          ? 'bg-green-500 text-black font-semibold'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                      }`}
                    >
                      결제
                    </button>
                    <button
                      onClick={() => setCurrentStep('transfer')}
                      className={`block w-full px-3 py-2 rounded text-xs transition-colors ${
                        currentStep === 'transfer'
                          ? 'bg-green-500 text-black font-semibold'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                      }`}
                    >
                      이체
                    </button>
                    <button
                      onClick={() => setCurrentStep('verification')}
                      className={`block w-full px-3 py-2 rounded text-xs transition-colors ${
                        currentStep === 'verification'
                          ? 'bg-green-500 text-black font-semibold'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
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
      <TradeCancelModal />
    </div>
  );
}
