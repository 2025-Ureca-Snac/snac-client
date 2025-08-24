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
import { api } from '../(shared)/utils/api';
import { ApiResponse } from '../(shared)/types/api';
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
import { toast } from 'sonner';

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
    const cardId = searchParams.get('id') || searchParams.get('cardId');

    // cardId가 있을 때 카드 상태 조회
    if (cardId) {
      const fetchCardStatus = async () => {
        try {
          const response = await api.get<ApiResponse<CardData>>(
            `/cards/${cardId}`
          );
          // 응답 데이터를 cardData 상태에 저장
          if (response.data.data) {
            setCardData(response.data.data);
          }
        } catch (error) {
          console.error('카드 정보 로딩 실패:', error);
          toast.error('상품 정보를 불러오는데 실패했습니다.');
        }
      };

      fetchCardStatus();
    }

    // 지갑 정보 조회
    const fetchWalletData = async () => {
      try {
        const response =
          await api.get<ApiResponse<{ money: number; point: number }>>(
            '/wallets/summary'
          );
        setWalletData(response.data.data);
      } catch (error) {
        console.error('지갑 정보 로딩 실패:', error);
        toast.error('지갑 정보를 불러오는데 실패했습니다.');
      }
    };

    fetchWalletData();
  }, []);

  // 지갑 정보 새로고침 함수
  const refreshWalletData = async () => {
    try {
      const response =
        await api.get<ApiResponse<{ money: number; point: number }>>(
          '/wallets/summary'
        );
      setWalletData(response.data.data);
    } catch (error) {
      console.error('지갑 정보 새로고침 실패:', error);
    }
  };

  // walletData가 업데이트될 때 snackMoney와 snackPoints 업데이트
  useEffect(() => {
    if (walletData) {
      setSnackMoney(walletData.money);
      setSnackPoints(walletData.point);
    }
  }, [walletData]);

  const productPrice = cardData?.price || 0;
  const finalAmount = getFinalAmount(productPrice, snackPointsToUse);

  const handleSnackPayment = async () => {
    try {
      // 스낵 포인트로 결제 처리

      const amount = finalAmount;

      // INSERT_YOUR_CODE
      // pay 파라미터에 따라 API 엔드포인트 분기
      const searchParams = new URLSearchParams(window.location.search);
      const pay = searchParams.get('pay'); // 기본값은 'sell'
      const cardId = searchParams.get('id') || searchParams.get('cardId');
      const apiEndpoint =
        pay === PAYMENT_TYPES.SELL
          ? '/trades/buy'
          : pay === PAYMENT_TYPES.BUY
            ? '/trades/sell'
            : null;
      if (!apiEndpoint) {
        throw new Error('잘못된 요청 파라미터입니다.');
      }

      const response = await api.post(apiEndpoint, {
        cardId: Number(cardId),
        money: amount,
        point: snackPointsToUse,
      });

      const responseData = response.data as Record<string, unknown>;
      const tradeId = (responseData.data as { tradeId: number }).tradeId;
      if (responseData.status === 'CREATED') {
        // 지갑 정보 새로고침
        try {
          await api.get('/wallets/summary');
        } catch {
          // 지갑 정보 새로고침 실패 처리
        }

        router.push(
          `/payment/complete?pay=${pay}&tradeId=${tradeId}&dataAmount=${cardData?.dataAmount}&amount=${amount}&snackMoneyUsed=${amount}&snackPointsUsed=${snackPointsToUse}&carrier=${cardData?.carrier}`
        );
      } else {
        toast.error(`결제가 실패했습니다. 다시 시도해주세요.`);
      }
    } catch (error) {
      toast.error('스낵 포인트 결제 오류:', {
        description: (error as { response: { data: { message: string } } })
          .response.data.message,
      });
    }
  };

  const handlePaymentClick = () => {
    if (showSnackPayment) {
      // 스낵 결제 화면에서 실제 결제 처리
      const totalAvailable = getTotalAvailable(snackMoney, snackPoints);

      if (finalAmount === 0) {
        // 스낵 포인트로 전액 결제
        handleSnackPayment();
      } else if (totalAvailable >= finalAmount) {
        // 스낵 머니 + 스낵 포인트로 충분한 경우
        handleSnackPayment();
      } else {
        // 스낵 머니 + 스낵 포인트가 부족한 경우 충전 확인
        const shortage = getShortageAmount(finalAmount, totalAvailable);
        setShortageAmount(shortage);
        setRechargeConfirmModalOpen(true);
      }
    } else {
      // 초기 결제 방법 선택
      if (paymentMethod === 'toss') {
        // 토스페이먼츠로 결제 - 충전 모달 열기

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

        // 스낵 머니 + 스낵 포인트가 주문 금액보다 작으면 바로 충전 확인 모달 열기
        const totalAvailable = getTotalAvailable(snackMoney, snackPoints);
        if (totalAvailable < productPrice) {
          const shortage = getShortageAmount(productPrice, totalAvailable);
          setShortageAmount(shortage);
          setRechargeConfirmModalOpen(true);
          return;
        }

        setShowSnackPayment(true);
      } else {
        // 알 수 없는 결제 방법
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
    setRechargeConfirmModalOpen(false);
    setRechargeModalOpen(true);
  };

  const handleRechargeCancel = () => {
    setRechargeConfirmModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-card-foreground mb-2">
              결제하기
            </h1>
            <p className="text-muted-foreground">
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
              <div className="bg-card rounded-lg shadow-sm border border-border p-6">
                <h2 className="text-lg font-semibold text-card-foreground mb-4">
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
        currentMoney={snackMoney}
        shortage={shortageAmount}
        onRefreshData={refreshWalletData}
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
