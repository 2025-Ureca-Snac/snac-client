'use client';
import { useEffect, Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/app/(shared)/utils/api';

/**
 * @author 이승우
 * @description 토스 결제 실패 컴포넌트
 */
function PaymentFailComponent() {
  const searchParams = useSearchParams();
  const [failureReason, setFailureReason] = useState<string>('');

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const code = searchParams.get('code');
    const message = searchParams.get('message');
    setFailureReason(message || '결제 요청에 실패했습니다.');

    // 백엔드에 실패 정보 전송
    const sendFailureToBackend = async () => {
      try {
        await api.post('/payments/fail', {
          errorCode: code,
          errorMessage: message,
          orderId: orderId,
        });
        console.log('결제 실패 정보가 백엔드에 전송되었습니다.');
      } catch (error) {
        console.error('결제 실패 정보 전송 실패:', error);
      }
    };

    sendFailureToBackend();

    // 부모 창에 실패 메시지 전송
    window.opener?.postMessage(
      {
        type: 'PAYMENT_RESULT',
        success: false,
        code: code,
        message: message,
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
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl text-red-600">✕</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">결제 실패</h2>
        <p className="text-gray-600">{failureReason}</p>
        <p className="text-sm text-gray-500 mt-4">
          3초 후 자동으로 창이 닫힙니다...
        </p>
      </div>
    </div>
  );
}

/**
 * @author 이승우
 * @description 토스 결제 실패 페이지
 */
export default function PaymentFailPage() {
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
      <PaymentFailComponent />
    </Suspense>
  );
}
