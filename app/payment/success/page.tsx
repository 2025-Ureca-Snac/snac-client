'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * @author 이승우
 * @description 토스 결제 성공 페이지
 */
export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const paymentKey = searchParams.get('paymentKey');

    // 부모 창에 성공 메시지 전송
    window.opener?.postMessage(
      {
        type: 'PAYMENT_RESULT',
        success: true,
        orderId: orderId,
        amount: amount,
        paymentKey: paymentKey,
      },
      window.location.origin
    );

    // 3초 후 창 닫기
    setTimeout(() => {
      window.close();
    }, 3000);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl text-green-600">✓</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">결제 완료!</h2>
        <p className="text-gray-600">스낵머니가 성공적으로 충전되었습니다.</p>
        <p className="text-sm text-gray-500 mt-4">
          3초 후 자동으로 창이 닫힙니다...
        </p>
      </div>
    </div>
  );
}
