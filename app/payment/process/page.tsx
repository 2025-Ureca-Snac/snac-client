'use client';
import { useEffect, Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  loadPaymentWidget,
  PaymentWidgetInstance,
} from '@tosspayments/payment-widget-sdk';
import { toast } from 'sonner';

/**
 * @author 이승우
 * @description 토스 결제 처리 컴포넌트 (샌드박스 결제위젯 방식)
 */
function PaymentProcessComponent() {
  const searchParams = useSearchParams();
  const [paymentWidget, setPaymentWidget] =
    useState<PaymentWidgetInstance | null>(null);

  useEffect(() => {
    const amount = searchParams.get('amount');
    const orderId = searchParams.get('orderId');

    if (amount && orderId) {
      const processPayment = async () => {
        try {
          // ✅ 샌드박스와 동일한 결제위젯 로드
          const widget = await loadPaymentWidget(
            'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm',
            '3gWoIDbGVHgNoUDS1DWDx'
          );

          setPaymentWidget(widget);

          // ✅ 샌드박스와 동일한 결제수단 렌더링
          widget.renderPaymentMethods('#payment-widget', {
            value: parseInt(amount),
          });

          // ✅ 샌드박스와 동일한 약관 동의 렌더링
          widget.renderAgreement('#agreement', {
            variantKey: 'AGREEMENT',
          });

          // 로딩 메시지 숨기기
          setTimeout(() => {
            const loadingElement = document.querySelector('.loading-message');
            const spinnerElement = document.querySelector('.loading-spinner');
            if (loadingElement) {
              (loadingElement as HTMLElement).style.display = 'none';
            }
            if (spinnerElement) {
              (spinnerElement as HTMLElement).style.display = 'none';
            }
          }, 1000);
        } catch {
          // 부모 창에 에러 메시지 전송
          window.opener?.postMessage(
            {
              type: 'PAYMENT_ERROR',
              error: '결제 시스템 초기화 중 오류가 발생했습니다.',
            },
            window.location.origin
          );
          window.close();
        }
      };

      processPayment();
    }
  }, [searchParams]);

  // ✅ 결제하기 버튼 클릭 이벤트 핸들러
  const handlePaymentClick = async () => {
    if (!paymentWidget) return;

    const amount = searchParams.get('amount');
    const orderId = searchParams.get('orderId');
    const customerEmail = searchParams.get('customerEmail');
    const customerName = searchParams.get('customerName');
    const orderName = searchParams.get('orderName');

    // ✅ 필수 정보 검증
    if (!amount || !orderId) {
      toast.error('결제 정보가 올바르지 않습니다. 다시 시도해주세요.');
      window.close();
      return;
    }

    // ✅ 최소 충전 금액 검증
    const amountNumber = parseInt(amount);
    if (amountNumber < 1000) {
      toast.error('최소 1,000원부터 충전 가능합니다.');
      window.close();
      return;
    }

    try {
      /**
       * 결제 요청
       * 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
       * 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
       */
      await paymentWidget.requestPayment({
        orderId: orderId,
        orderName: orderName || '스낵머니 충전',
        customerName: customerName || '스낵 사용자',
        customerEmail: customerEmail || undefined,
        successUrl: `${window.location.origin}/payment/success?orderId=${orderId}&amount=${amount}`,
        failUrl: `${window.location.origin}/payment/fail`,
      });

      // ✅ 결제위젯 방식에서는 Promise 결과를 직접 받음
      // ✅ Toss Payments가 자동으로 successUrl로 리다이렉트
    } catch {
      // ✅ Toss Payments가 자동으로 failUrl로 리다이렉트
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted bg-background">
      <div className="text-center w-full max-w-md mx-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4 loading-spinner"></div>
        <p className="text-muted-foreground mb-6 loading-message">
          결제창을 여는 중입니다...
        </p>

        {/* 결제수단 위젯 */}
        <div id="payment-widget" className="mb-4"></div>

        {/* 약관 동의 위젯 */}
        <div id="agreement" className="mb-4"></div>

        {/* ✅ 샌드박스와 동일한 결제하기 버튼 */}
        <div className="btn-wrapper w-100">
          <button
            className="w-full bg-blue-600 text-primary-foreground py-3 px-4 rounded-md hover:bg-blue-700:bg-blue-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePaymentClick}
            disabled={!paymentWidget}
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * @author 이승우
 * @description 토스 결제 처리 페이지 (샌드박스 결제위젯 방식)
 */
export default function PaymentProcessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-muted bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        </div>
      }
    >
      <PaymentProcessComponent />
    </Suspense>
  );
}
