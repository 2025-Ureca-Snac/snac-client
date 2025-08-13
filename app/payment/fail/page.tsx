'use client';
import { useEffect, Suspense, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/app/(shared)/utils/api';

/**
 * @author 이승우
 * @description 토스 결제 실패 컴포넌트
 */
function PaymentFailComponent() {
  const searchParams = useSearchParams();
  const [failureReason, setFailureReason] = useState<string>('');
  const [countdown, setCountdown] = useState(3);
  const isMessageSentRef = useRef(false); // 중복 전송 방지 (useRef 사용)

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
        // 결제 실패 정보가 백엔드에 전송되었습니다.
      } catch {
        // 결제 실패 정보 전송 실패
      }
    };

    sendFailureToBackend();

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
                success: false,
                code: code,
                message: message,
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
  }, [searchParams]); // searchParams 의존성 추가

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl text-destructive">✕</span>
        </div>
        <h2 className="text-xl font-bold text-card-foreground mb-2">
          결제 실패
        </h2>
        <p className="text-muted-foreground">{failureReason}</p>
        <p className="text-sm text-muted-foreground mt-4">
          {countdown}초 후 자동으로 창이 닫힙니다...
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
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        </div>
      }
    >
      <PaymentFailComponent />
    </Suspense>
  );
}
