'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RechargeModal from '../(shared)/components/recharge-modal';
import RechargeConfirmModal from '../(shared)/components/recharge-confirm-modal';
import ProgressSteps from '../(shared)/components/progress-steps';
import ProductDetails from '../(shared)/components/product-details';
import PaymentMethods from '../(shared)/components/payment-methods';
import PaymentSummary from '../(shared)/components/payment-summary';
import PaymentButton from '../(shared)/components/payment-button';
import api from '../(shared)/utils/api';
import {
  PAYMENT_METHODS,
  PAYMENT_TYPES,
  PaymentMethod,
} from '../(shared)/constants/payment';
import {
  getFinalAmount,
  getTotalAvailable,
  getShortageAmount,
} from '../(shared)/utils/payment-calculations';
import { CardData } from '../(shared)/types/card';

/**
 * @author 이승우
 * @description 결제 페이지
 */
export default function PaymentPage() {
  const router = useRouter();
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [rechargeConfirmModalOpen, setRechargeConfirmModalOpen] =
    useState(false);
  const [shortageAmount, setShortageAmount] = useState(0);
  const [snackMoney, setSnackMoney] = useState(0); // 스낵 머니
  const [snackPoints, setSnackPoints] = useState(0); // 스낵 포인트
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PAYMENT_METHODS.TOSS
  );
  const [snackPointsToUse, setSnackPointsToUse] = useState(0);
  const [showSnackPayment, setShowSnackPayment] = useState(false);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [walletData, setWalletData] = useState<{
    money: number;
    point: number;
  } | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const cardId = searchParams.get('id');
    const pay = searchParams.get('pay');

    console.log('Payment Page Search Params:', {
      cardId,
      pay,
      fullUrl: window.location.href,
    });

    // cardId가 있을 때 카드 상태 조회
    if (cardId) {
      const fetchCardStatus = async () => {
        try {
          const response = await api.get(`/cards/${cardId}`);
          console.log('Card Status Response:', response.data);

          // 응답 데이터를 cardData 상태에 저장
          if ((response.data as { data: CardData })?.data) {
            setCardData((response.data as { data: CardData }).data);
          }
        } catch (error) {
          console.error('카드 상태 조회 실패:', error);
        }
      };

      fetchCardStatus();
    }

    // 지갑 정보 조회
    const fetchWalletData = async () => {
      try {
        const response = await api.get('/wallets/summary');
        console.log('Wallet Summary Response:', response.data);
        setWalletData(
          (response.data as { data: { money: number; point: number } }).data
        );
      } catch (error) {
        console.error('지갑 정보 조회 실패:', error);
      }
    };

    fetchWalletData();
  }, []);

  // walletData가 업데이트될 때 snackMoney와 snackPoints 업데이트
  useEffect(() => {
    if (walletData) {
      setSnackMoney(walletData.money);
      setSnackPoints(walletData.point);
    }
  }, [walletData]);

  const productPrice = cardData?.price || 0;
  const finalAmount = getFinalAmount(productPrice, snackPointsToUse);

  // 디버깅용 로그
  console.log('현재 상태:', {
    paymentMethod,
    snackPointsToUse,
    finalAmount,
    showSnackPayment,
  });

  const handleSnackPayment = async () => {
    try {
      // 스낵 포인트로 결제 처리

      const amount = finalAmount;

      // INSERT_YOUR_CODE
      // pay 파라미터에 따라 API 엔드포인트 분기
      const searchParams = new URLSearchParams(window.location.search);
      const pay = searchParams.get('pay'); // 기본값은 'sell'
      const cardId = searchParams.get('id');
      const apiEndpoint =
        pay === PAYMENT_TYPES.SELL
          ? '/trades/buy'
          : pay === PAYMENT_TYPES.BUY
            ? '/trades/sell'
            : null;

      if (!apiEndpoint) {
        throw new Error('잘못된 요청 파라미터입니다.');
      }
      console.log('apiEndpoint', Number(cardId), amount, snackPointsToUse);
      const response = await api.post(apiEndpoint, {
        cardId: Number(cardId),
        money: amount,
        point: snackPointsToUse,
      });

      const responseData = response.data as Record<string, unknown>;
      if (responseData.status === 'CREATED') {
        router.push(
          `/payment/complete?pay=${pay}&orderId=${cardId}&amount=${amount}&snackMoneyUsed=${amount}&snackPointsUsed=${snackPointsToUse}`
        );
      } else {
        alert(`결제가 실패했습니다. 다시 시도해주세요.`);
        console.error('결제 실패:', responseData);
      }
    } catch (error) {
      console.error('스낵 포인트 결제 오류:', error);
      alert(
        `결제 중 오류가 발생했습니다. \n${(error as { response: { data: { message: string } } }).response.data.message}`
      );
    }
  };

  const handlePaymentClick = () => {
    console.log('결제 버튼 클릭:', {
      paymentMethod,
      finalAmount,
      snackPoints,
      showSnackPayment,
    });

    if (showSnackPayment) {
      // 스낵 결제 화면에서 실제 결제 처리
      const totalAvailable = getTotalAvailable(snackMoney, snackPoints);

      if (finalAmount === 0) {
        // 스낵 포인트로 전액 결제
        console.log('스낵 포인트 전액 결제');
        handleSnackPayment();
      } else if (totalAvailable >= finalAmount) {
        // 스낵 머니 + 스낵 포인트로 충분한 경우
        console.log('스낵 머니 + 스낵 포인트 결제');
        handleSnackPayment();
      } else {
        console.log('포인트 부족');
        // 스낵 머니 + 스낵 포인트가 부족한 경우 충전 확인
        const shortage = getShortageAmount(finalAmount, totalAvailable);
        setShortageAmount(shortage);
        setRechargeConfirmModalOpen(true);
      }
    } else {
      // 초기 결제 방법 선택
      if (paymentMethod === 'toss') {
        // 토스페이먼츠로 결제 - 충전 모달 열기
        console.log('토스페이먼츠 결제 선택');

        // 충분한 금액이 있는지 확인
        const totalAvailable = getTotalAvailable(snackMoney, snackPoints);
        if (totalAvailable >= productPrice) {
          // 충분한 경우: 주문 금액으로 설정
          setShortageAmount(productPrice);
        } else {
          // 부족한 경우: 부족한 금액으로 설정
          const shortage = getShortageAmount(productPrice, totalAvailable);
          setShortageAmount(shortage);
        }

        setRechargeModalOpen(true);
      } else if (paymentMethod === PAYMENT_METHODS.SNACK) {
        // 스낵 포인트로 결제 화면 표시
        console.log('스낵 포인트 결제 화면 표시');

        // 스낵 머니 + 스낵 포인트가 주문 금액보다 작으면 바로 충전 확인 모달 열기
        const totalAvailable = getTotalAvailable(snackMoney, snackPoints);
        if (totalAvailable < productPrice) {
          const shortage = getShortageAmount(productPrice, totalAvailable);
          console.log('스낵 선택 시 shortage 계산:', {
            totalAvailable,
            productPrice,
            shortage,
          });
          setShortageAmount(shortage);
          setRechargeConfirmModalOpen(true);
          return;
        }

        setShowSnackPayment(true);
      } else {
        console.log('알 수 없는 결제 방법:', paymentMethod);
      }
    }
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setSnackPointsToUse(0); // 초기화
  };

  const handleSnackPointsChange = (value: number) => {
    setSnackPointsToUse(value);
  };

  const handleRechargeConfirm = () => {
    console.log('handleRechargeConfirm - shortageAmount:', shortageAmount);
    setRechargeConfirmModalOpen(false);
    setRechargeModalOpen(true);
  };

  const handleRechargeCancel = () => {
    setRechargeConfirmModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">결제하기</h1>
            <p className="text-gray-600">
              통신사, 데이터 용량, 가격이 정확한지 확인해주세요
            </p>
          </div>

          {/* Progress Steps */}
          <ProgressSteps showSnackPayment={showSnackPayment} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Details */}
            <ProductDetails cardData={cardData} />

            {/* Payment Information */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  결제 방법
                </h2>

                {/* Payment Methods */}
                <PaymentMethods
                  paymentMethod={paymentMethod}
                  onPaymentMethodChange={handlePaymentMethodChange}
                  showSnackPayment={showSnackPayment}
                />

                {/* Payment Summary */}
                <PaymentSummary
                  productPrice={productPrice}
                  snackMoney={snackMoney}
                  snackPoints={snackPoints}
                  snackPointsToUse={snackPointsToUse}
                  finalAmount={finalAmount}
                  showSnackPayment={showSnackPayment}
                  onSnackPointsChange={handleSnackPointsChange}
                />

                {/* Payment Button */}
                <PaymentButton
                  snackMoney={snackMoney}
                  snackPoints={snackPoints}
                  finalAmount={finalAmount}
                  showSnackPayment={showSnackPayment}
                  onPaymentClick={handlePaymentClick}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Recharge Modal */}
      <RechargeModal
        open={rechargeModalOpen}
        onClose={() => setRechargeModalOpen(false)}
        currentPoints={snackMoney}
        shortage={shortageAmount}
        onRechargeSuccess={(rechargedAmount) => {
          // 스낵 머니 업데이트
          setSnackMoney((prev) => prev + rechargedAmount);

          // 충전 모달 닫기
          setRechargeModalOpen(false);

          // 스낵 결제 화면 표시
          setShowSnackPayment(true);
        }}
      />

      {/* Recharge Confirm Modal */}
      <RechargeConfirmModal
        open={rechargeConfirmModalOpen}
        onClose={handleRechargeCancel}
        onConfirm={handleRechargeConfirm}
        snackMoney={snackMoney}
        snackPoints={snackPoints}
        shortage={shortageAmount}
      />
    </div>
  );
}
