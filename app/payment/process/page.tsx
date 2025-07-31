'use client';
import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { loadTossPayments } from '@tosspayments/payment-sdk';

/**
 * @author 이승우
 * @description 토스 결제 처리 컴포넌트
 */
function PaymentProcessComponent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const amount = searchParams.get('amount');
    const orderId = searchParams.get('orderId');
    const customerEmail = searchParams.get('customerEmail');
    const customerName = searchParams.get('customerName');
    const orderName = searchParams.get('orderName');

    if (amount && orderId) {
      const processPayment = async () => {
        try {
          const tossPayments = await loadTossPayments(
            'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'
          );

          await tossPayments.requestPayment('카드', {
            amount: parseInt(amount),
            orderId: orderId,
            orderName: orderName || '스낵머니 충전',
            customerName: customerName || '스낵 사용자',
            customerEmail: customerEmail || undefined,
            successUrl: `${window.location.origin}/payment/success?orderId=${orderId}&amount=${amount}`,
            failUrl: `${window.location.origin}/payment/fail`,
          });
        } catch (error) {
          console.error('토스페이먼츠 결제 오류:', error);

          // 부모 창에 에러 메시지 전송
          window.opener?.postMessage(
            {
              type: 'PAYMENT_ERROR',
              error: '결제 중 오류가 발생했습니다.',
            },
            window.location.origin
          );
          window.close();
        }
      };

      processPayment();
    }
  }, [searchParams]);

  // 결제 성공/실패 페이지에서 메시지 전송
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'PAYMENT_RESULT') {
        // 부모 창에 결제 결과 전송
        window.opener?.postMessage(
          {
            type: 'PAYMENT_RESULT',
            success: event.data.success,
            orderId: event.data.orderId,
            amount: event.data.amount,
          },
          window.location.origin
        );
        window.close();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">결제창을 여는 중입니다...</p>
      </div>
    </div>
  );
}

/**
 * @author 이승우
 * @description 토스 결제 처리 페이지
 */
export default function PaymentProcessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      }
    >
      <PaymentProcessComponent />
    </Suspense>
  );
}
