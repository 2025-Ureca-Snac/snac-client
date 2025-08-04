'use client';

import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';

export default function Certification() {
  const [countdown, setCountdown] = useState(5);
  const [isProcessing, setIsProcessing] = useState(true);
  const isMessageSentRef = useRef(false); // 메시지 전송 상태 추적 (useRef 사용)

  // 창이 닫히는 순간에 헤더 정보를 추출하는 함수
  const extractAuthData = async () => {
    // 이미 메시지를 전송했다면 중복 전송 방지
    if (isMessageSentRef.current) {
      console.log('이미 메시지를 전송했으므로 중복 전송을 방지합니다');
      return;
    }

    try {
      // URL 파라미터에서 인증 정보 추출
      const urlParams = new URLSearchParams(window.location.search);
      const social = urlParams.get('social');
      const error = urlParams.get('error');

      console.log('URL 파라미터에서 추출한 인증 데이터:', {
        social,
        error,
        urlParams: Object.fromEntries(urlParams.entries()),
      });

      // error 파라미터가 있으면 인증 실패, social 파라미터가 있으면 성공
      if (error) {
        // 인증 실패 시
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'AUTH_ERROR',
              data: {
                error,
              },
            },
            '*' //window.location.origin
          );
          isMessageSentRef.current = true; // 메시지 전송 완료 표시
        } else {
          // 부모 창이 없는 경우 (직접 접근) 처리
          console.log('인증 실패:', error);
          toast.error('인증에 실패했습니다. 다시 시도해주세요.');
        }
      } else if (social) {
        // 인증 성공
        // 부모 창에 성공 메시지 전달
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'AUTH_SUCCESS',
              data: {
                authorization: social,
              },
            },
            '*' //window.location.origin
          );
          isMessageSentRef.current = true; // 메시지 전송 완료 표시
          console.log('인증 성공 - 데이터 전송 완료');
        } else {
          // 부모 창이 없는 경우 (직접 접근) 처리
          console.log('인증 성공:', { social });
          toast.success('인증이 성공적으로 완료되었습니다!');
        }
      } else {
        // 파라미터가 없는 경우 (예상치 못한 상황)
        console.log('예상치 못한 상황: 파라미터가 없습니다');
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'AUTH_ERROR',
              data: {
                error: 'UNEXPECTED_ERROR',
              },
            },
            '*' //window.location.origin
          );
          isMessageSentRef.current = true;
        } else {
          toast.error('예상치 못한 상황이 발생했습니다.');
        }
      }
    } catch (error) {
      console.error('인증 데이터 추출 중 오류:', error);
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'AUTH_ERROR',
            data: {
              error: 'EXTRACTION_ERROR',
            },
          },
          window.location.origin
        );
        isMessageSentRef.current = true; // 메시지 전송 완료 표시
      } else {
        toast.error('인증 데이터 추출 중 오류가 발생했습니다.');
      }
    }
  };

  useEffect(() => {
    // 창이 닫히는 순간에 실행되는 이벤트 리스너
    const handleBeforeUnload = () => {
      console.log('창이 닫히기 직전 - 인증 데이터 추출 시작');
      extractAuthData();
    };

    // beforeunload 이벤트 리스너 등록
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 처리 완료 후 카운트다운 시작
    setIsProcessing(false);

    // 카운트다운 타이머 설정
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) {
          clearInterval(countdownTimer);
          if (window.opener) {
            // 창을 닫기 전에 인증 데이터 추출
            console.log('카운트다운 완료 - 인증 데이터 추출');
            extractAuthData();

            // 잠시 후 창 닫기
            setTimeout(() => {
              console.log('인증 창을 닫습니다');
              window.close();
            }, 200);
          } else {
            window.location.href = '/mypage';
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 클린업 함수
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(countdownTimer);
    };
  }, []);

  // 수동 닫기 함수
  const handleClose = () => {
    if (window.opener) {
      console.log('수동으로 인증 창을 닫습니다');
      // 창을 닫기 전에 인증 데이터 추출
      extractAuthData();
      setTimeout(() => {
        window.close();
      }, 100);
    } else {
      window.location.href = '/mypage';
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">인증 처리 중...</p>
            <p className="text-gray-400 text-sm mt-2">잠시만 기다려주세요</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">인증 완료!</h2>
            <p className="text-gray-600 mb-6">
              인증이 성공적으로 완료되었습니다.
              <br />이 창은 {countdown}초 후 자동으로 닫힙니다.
            </p>

            {/* 시계가 있는 닫기 버튼 */}
            <button
              onClick={handleClose}
              className="relative w-full max-w-sm px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-6 mx-auto"
            >
              {/* 시계 모양 프로그레스 바 */}
              <div className="relative w-16 h-16 flex-shrink-0">
                {/* 시계 외곽 원 */}
                <svg
                  className="w-16 h-16 transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  {/* 배경 원 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="4"
                  />
                  {/* 진행 원 - 테두리만 채워지는 방식 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.9)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.max(0, (countdown / 5) * 283)} 283`}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>

                {/* 중앙 숫자 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {countdown}
                  </span>
                </div>
              </div>

              {/* 버튼 텍스트 */}
              <span className="whitespace-nowrap text-lg">지금 닫기</span>
            </button>
            <p className="text-gray-400 text-sm mt-3">
              또는 잠시 기다리시면 자동으로 닫힙니다
            </p>
          </>
        )}
      </div>
    </div>
  );
}
