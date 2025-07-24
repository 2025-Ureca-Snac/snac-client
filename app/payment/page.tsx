'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RechargeModal from '../(shared)/components/recharge-modal';
import RechargeConfirmModal from '../(shared)/components/recharge-confirm-modal';
import ProgressSteps from '../(shared)/components/progress-steps';
import ProductDetails from '../(shared)/components/product-details';
import PaymentMethods from '../(shared)/components/payment-methods';
import PaymentSummary from '../(shared)/components/payment-summary';
import PaymentButton from '../(shared)/components/payment-button';
import api from '../(shared)/utils/api';

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
  const [snackMoney, setSnackMoney] = useState(3000); // 스낵 머니 3,000
  const [snackPoints, setSnackPoints] = useState(1500); // 스낵 포인트 1,500 (테스트용)
  const [paymentMethod, setPaymentMethod] = useState('toss');
  const [snackPointsToUse, setSnackPointsToUse] = useState(0);
  const [showSnackPayment, setShowSnackPayment] = useState(false);

  const productPrice = 2000;
  const finalAmount = Math.max(0, productPrice - snackPointsToUse);

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
      const orderId = `ORDER_${Date.now()}`;
      const amount = finalAmount;

      // 여기서 실제 스낵 포인트 결제 API를 호출할 수 있습니다
      console.log('스낵 포인트 결제:', {
        orderId,
        amount,
        snackPointsUsed: snackPointsToUse,
        finalAmount,
      });

      // INSERT_YOUR_CODE
      // pay 파라미터에 따라 API 엔드포인트 분기
      // pay 값은 sell 또는 buy가 될 수 있음
      // pay 값을 파라미터에서 받아오도록 수정
      const searchParams = new URLSearchParams(window.location.search);
      const pay = searchParams.get('pay'); // 기본값은 'sell'

      const apiEndpoint =
        pay === 'sell' ? '/trades/sell' : pay === 'buy' ? '/trades/buy' : '';

      const response = await api.post(apiEndpoint, {
        cardId: orderId,
        money: amount,
        point: snackPointsToUse,
      });

      const responseData = response.data as Record<string, unknown>;
      if (responseData.status === 'OK') {
        // 결제 성공 시 사용한 스낵 머니와 스낵 포인트 차감
        setSnackMoney((prev) => prev - amount);
        setSnackPoints((prev) => prev - snackPointsToUse);

        router.push(
          `/payment/complete?pay=${pay}&orderId=${orderId}&amount=${amount}`
        );
      } else {
        alert('결제가 실패했습니다. 다시 시도해주세요.');
        console.error('결제 실패:', responseData);
      }
    } catch (error) {
      console.error('스낵 포인트 결제 오류:', error);
      alert('결제 중 오류가 발생했습니다.');
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
      const totalAvailable = snackMoney + snackPoints;

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
        const shortage = finalAmount - totalAvailable;
        setShortageAmount(shortage);
        setRechargeConfirmModalOpen(true);
      }
    } else {
      // 초기 결제 방법 선택
      if (paymentMethod === 'toss') {
        // 토스페이먼츠로 결제 - 충전 모달 열기
        console.log('토스페이먼츠 결제 선택');

        // 충분한 금액이 있는지 확인
        const totalAvailable = snackMoney + snackPoints;
        if (totalAvailable >= productPrice) {
          // 충분한 경우: 주문 금액으로 설정
          setShortageAmount(productPrice);
        } else {
          // 부족한 경우: 부족한 금액으로 설정
          const shortage = productPrice - totalAvailable;
          setShortageAmount(shortage);
        }

        setRechargeModalOpen(true);
      } else if (paymentMethod === 'snack') {
        // 스낵 포인트로 결제 화면 표시
        console.log('스낵 포인트 결제 화면 표시');

        // 스낵 머니 + 스낵 포인트가 주문 금액보다 작으면 바로 충전 확인 모달 열기
        const totalAvailable = snackMoney + snackPoints;
        if (totalAvailable < productPrice) {
          const shortage = productPrice - totalAvailable;
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

  const handlePaymentMethodChange = (method: string) => {
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
            <ProductDetails productPrice={productPrice} />

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
