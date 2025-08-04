'use client';

import React, { useState, useEffect } from 'react';
import { useGlobalWebSocket } from '@/app/(shared)/hooks/useGlobalWebSocket';
import { api } from '@/app/(shared)/utils/api';
import Image from 'next/image';

// 첨부 이미지 URL 응답 타입 정의
interface AttachmentUrlResponse {
  data: string;
  code: string;
  status: string;
  message: string;
  timestamp: string;
}

interface VerificationStepProps {
  dataAmount: number;
  timeLeft: number;
  tradeId?: number;
  userRole: 'buyer' | 'seller';
  onNext: () => void;
}

export default function VerificationStep({
  dataAmount,
  timeLeft,
  tradeId,
  userRole,
  onNext,
}: VerificationStepProps) {
  const { sendTradeConfirm: wsSendTradeConfirm } = useGlobalWebSocket();
  const [isConfirming, setIsConfirming] = useState(false);
  const [attachmentImageUrl, setAttachmentImageUrl] = useState<string>('');
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  // 전송 완료 시간을 컴포넌트 마운트 시점에 고정
  const [completionTime] = useState(() => new Date().toLocaleTimeString());

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 첨부 이미지 URL 가져오기 (구매자일 때만)
  useEffect(() => {
    const fetchAttachmentImage = async () => {
      if (userRole === 'buyer' && tradeId) {
        try {
          setIsLoadingImage(true);
          const response = await api.get<AttachmentUrlResponse>(
            `/trades/${tradeId}/attachment-url`
          );

          if (response.data.status === 'OK' && response.data.data) {
            setAttachmentImageUrl(response.data.data);
          }
        } catch (error) {
          console.error('첨부 이미지 URL 가져오기 실패:', error);
        } finally {
          setIsLoadingImage(false);
        }
      }
    };

    fetchAttachmentImage();
  }, [userRole, tradeId]);

  // 구매자 거래 확정 처리
  const handleBuyerConfirm = async () => {
    if (!tradeId) {
      onNext();
      return;
    }

    setIsConfirming(true);
    try {
      const success = wsSendTradeConfirm(tradeId);
      if (success) {
        console.log('✅ 거래 확정 요청 성공');
        setTimeout(() => {
          onNext();
        }, 1000);
      } else {
        toast.error('거래 확정 요청에 실패했습니다.');
      }
    } catch (error) {
      console.error('거래 확정 오류:', error);
      toast.error('거래 확정 중 오류가 발생했습니다.');
    } finally {
      setIsConfirming(false);
    }
  };

  // 구매자용 화면
  if (userRole === 'buyer') {
    return (
      <div className="max-w-2xl mx-auto px-4">
        {/* 메인 카드 - 투명 배경 */}
        <div className="relative bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
          {/* 서브틀한 글로우 효과 */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-blue-300/3"></div>

          <div className="relative p-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-green-300 to-white bg-clip-text text-transparent mb-6 text-center">
              데이터 수신 확인
            </h2>

            {/* 완료 상태 카드 */}
            <div className="bg-green-900/20 border border-green-400/30 rounded-xl p-6 mb-6 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-400/25">
                  <span className="text-black text-lg">📱</span>
                </div>
                <h3 className="font-bold text-green-300">데이터 전송 완료</h3>
              </div>
              <p className="text-green-200 text-sm">
                판매자가 {dataAmount}GB 데이터를 전송했습니다. 수신
                확인해주세요.
              </p>
            </div>

            {/* 전송 정보 */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 mb-6 backdrop-blur-sm">
              <h3 className="font-bold text-white mb-4">전송 정보</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">전송량:</span>
                  <span className="font-medium text-white">{dataAmount}GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">전송 시간:</span>
                  <span className="font-medium text-white">
                    {completionTime}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">잔여 시간:</span>
                  <span className="font-medium text-orange-400">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </div>

            {/* 판매자가 업로드한 사진 표시 */}
            {isLoadingImage ? (
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 mb-6 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-green-300">
                    전송 증명 사진을 불러오는 중...
                  </span>
                </div>
              </div>
            ) : attachmentImageUrl ? (
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 mb-6 backdrop-blur-sm">
                <h3 className="font-bold text-white mb-4">전송 증명 사진</h3>
                <div className="relative">
                  <Image
                    src={attachmentImageUrl}
                    alt="전송 증명 사진"
                    className="w-full h-auto rounded-lg shadow-lg object-contain"
                    width={300}
                    height={300}
                  />
                  <div className="absolute top-2 right-2 bg-green-500/80 text-white px-2 py-1 rounded-full text-xs font-medium">
                    ✓ 전송 완료
                  </div>
                </div>
                <p className="text-gray-300 text-sm mt-3">
                  판매자가 업로드한 데이터 전송 스크린샷입니다.
                </p>
              </div>
            ) : (
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 mb-6 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-gray-400">📷</span>
                  <span className="text-gray-300">
                    전송 증명 사진을 불러올 수 없습니다.
                  </span>
                </div>
              </div>
            )}

            {/* 주의사항 */}
            <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-xl p-6 mb-6 backdrop-blur-sm">
              <div className="flex items-start space-x-3">
                <span className="text-yellow-400 text-xl">⚠️</span>
                <div>
                  <div className="font-bold text-yellow-300 mb-2">
                    데이터 수신 확인
                  </div>
                  <div className="text-sm text-yellow-200">
                    휴대폰에서 데이터가 정상적으로 수신되었는지 확인 후 아래
                    버튼을 눌러주세요.
                  </div>
                </div>
              </div>
            </div>

            {/* 확인 버튼 */}
            <button
              onClick={handleBuyerConfirm}
              disabled={isConfirming}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden group ${
                isConfirming
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-400 to-green-500 text-black hover:from-green-300 hover:to-green-400 shadow-lg hover:shadow-green-400/25'
              }`}
            >
              {isConfirming ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>확정 중...</span>
                </span>
              ) : (
                <>
                  <span className="relative z-10">데이터 수신 확인 완료</span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 판매자용 화면 (구매자 데이터 수신 완료 대기)
  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* 메인 카드 - 투명 배경 */}
      <div className="relative bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
        {/* 서브틀한 글로우 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-purple-300/3"></div>

        <div className="relative p-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-300 to-white bg-clip-text text-transparent mb-6 text-center">
            거래 완료 대기
          </h2>

          {/* 대기 상태 카드 */}
          <div className="bg-blue-900/20 border border-blue-400/30 rounded-xl p-8 mb-6 backdrop-blur-sm">
            <div className="text-center">
              {/* 복잡한 로딩 애니메이션 */}
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-blue-400/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <div
                  className="absolute inset-2 border-2 border-blue-300/50 border-b-transparent rounded-full animate-spin animation-delay-150"
                  style={{ animationDirection: 'reverse' }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-blue-400 text-lg animate-pulse">
                    ⏳
                  </span>
                </div>
              </div>
              <h3 className="font-bold text-blue-300 mb-3">
                구매자 확인 대기 중
              </h3>
              <p className="text-blue-200 text-sm">
                구매자가 데이터 수신을 확인하고 있습니다. 잠시만 기다려주세요.
              </p>
            </div>
          </div>

          {/* 전송 완료 정보 */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 mb-6 backdrop-blur-sm">
            <h3 className="font-bold text-white mb-4">전송 완료 정보</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">전송량:</span>
                <span className="font-medium text-white">{dataAmount}GB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">전송 시간:</span>
                <span className="font-medium text-white">{completionTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">잔여 시간:</span>
                <span className="font-medium text-orange-400">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          {/* 대기 안내 */}
          <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-xl p-6 mb-6 backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              <span className="text-yellow-400 text-xl animate-pulse">⏳</span>
              <div>
                <div className="font-bold text-yellow-300 mb-2">대기 중</div>
                <div className="text-sm text-yellow-200">
                  구매자가 데이터 수신을 확인하면 거래가 완료됩니다.
                </div>
              </div>
            </div>
          </div>

          {/* 진행 상황 */}
          <div className="bg-gray-800/50 border border-gray-600/50 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              <span className="text-blue-400 text-xl">💡</span>
              <div>
                <div className="font-bold text-gray-200 mb-2">
                  거래 진행 상황
                </div>
                <div className="text-sm text-gray-300">
                  데이터 전송이 완료되었습니다. 구매자의 확인을 기다리고
                  있습니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
