'use client';
import { useEffect, Suspense, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * @author 이승우
 * @description 토스 결제 성공 컴포넌트
 */
function PaymentSuccessComponent() {
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(3);
  const isMessageSentRef = useRef(false); // 중복 전송 방지 (useRef 사용)

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const paymentKey = searchParams.get('paymentKey');

    // ✅ 3초 카운트다운 시작
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);

          // ✅ 중복 전송 방지 (Strict Mode 대응)
          if (!isMessageSentRef.current) {
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
            isMessageSentRef.current = true;
          }

          // 메시지 전송 후 창 닫기
          setTimeout(() => {
            window.close();
          }, 100);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(countdownInterval);
  }, []); // ✅ 빈 의존성 배열로 한 번만 실행 (Strict Mode 대응)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl text-green-600">✓</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">결제 완료!</h2>
        <p className="text-gray-600">스낵머니가 성공적으로 충전되었습니다.</p>
        <p className="text-sm text-gray-500 mt-4">
          {countdown}초 후 자동으로 창이 닫힙니다...
        </p>
      </div>
    </div>
  );
}

/**
 * @author 이승우
 * @description 토스 결제 성공 페이지
 */
export default function PaymentSuccessPage() {
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
      <PaymentSuccessComponent />
    </Suspense>
  );
}
