'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * @author 이승우
 * @description 토스 결제 실패 페이지
 */
export default function PaymentFailPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    // 부모 창에 실패 메시지 전송
    window.opener?.postMessage(
      {
        type: 'PAYMENT_RESULT',
        success: false,
        orderId: orderId,
        amount: amount,
      },
      '*'
    );

    // 3초 후 창 닫기
    setTimeout(() => {
      window.close();
    }, 3000);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl text-red-600">✕</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">결제 실패</h2>
        <p className="text-gray-600">결제가 취소되었거나 실패했습니다.</p>
        <p className="text-sm text-gray-500 mt-4">
          3초 후 자동으로 창이 닫힙니다...
        </p>
      </div>
    </div>
  );
}
