'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/app/(shared)/utils/api';
import { getApiErrorInfo } from '@/app/(shared)/types/api-errors';
import { MatchPartner } from '@/app/(shared)/stores/match-store';
import { SNACK_GRADES } from '@/app/(shared)/constants/snack-grades';
import Image from 'next/image';

interface ActionButtonsProps {
  partner: MatchPartner & {
    name: string;
    data: number;
    price: number;
    rating: number;
  };
}

export default function ActionButtons({ partner }: ActionButtonsProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  // 바삭스코어에 따른 등급 계산
  const currentGrade =
    SNACK_GRADES.find(
      (grade) => partner.rating >= grade.min && partner.rating <= grade.max
    ) || SNACK_GRADES[0];

  const handleNewMatch = () => {
    router.push('/match');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  // 단골 여부 확인
  const checkFavoriteStatus = useCallback(async () => {
    if (!partner?.cardId) return;

    const memberId =
      partner.type === 'seller' ? partner.buyerId : partner.sellerId;

    try {
      const response = await api.get('/favorites/check', {
        params: { toMemberId: memberId },
      });
      const responseData = response.data as {
        data: { isFavorite: boolean };
      };
      setIsFavorite(responseData.data.isFavorite);
    } catch {
      //.error('단골 여부 확인 실패:', error);
      setIsFavorite(false);
    } finally {
      setIsCheckingFavorite(false);
    }
  }, [partner?.cardId, partner?.type, partner?.buyerId, partner?.sellerId]);

  // 컴포넌트 마운트 시 단골 여부 확인
  useEffect(() => {
    checkFavoriteStatus();
  }, [checkFavoriteStatus]);

  // 단골 등록/해제 토글
  const handleToggleFavorite = async () => {
    if (!partner?.cardId) {
      toast.error('거래 상대방 정보를 찾을 수 없습니다.');
      return;
    }

    setIsToggling(true);

    const memberId =
      partner.type === 'seller' ? partner.buyerId : partner.sellerId;

    try {
      if (isFavorite) {
        // 단골 해제
        const response = await api.delete(`/favorites/${memberId}`);

        if (response.status === 200 || response.status === 204) {
          setIsFavorite(false);
          toast.success('단골 해제가 완료되었습니다!', {
            description: `${partner.name}님이 단골 목록에서 제거되었습니다.`,
            duration: 3000,
          });
        }
      } else {
        // 단골 등록
        const response = await api.post('/favorites', {
          toMemberId: memberId,
        });

        if (response.status === 201) {
          setIsFavorite(true);
          toast.success('단골 등록이 완료되었습니다!', {
            description: `${partner.name}님이 단골 목록에 추가되었습니다.`,
            duration: 3000,
          });
        }
      }
    } catch (error) {
      //.error('단골 등록/해제 실패:', error);
      const errorInfo = getApiErrorInfo(error);
      toast.error(
        isFavorite ? '단골 해제에 실패했습니다.' : '단골 등록에 실패했습니다.',
        {
          description: errorInfo.userMessage,
          duration: 3000,
        }
      );
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 단골 등록 카드 */}
      <div className="relative bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
        {/* 서브틀한 글로우 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/5 via-transparent to-purple-300/3"></div>

        <div className="relative p-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-pink-300 to-white bg-clip-text text-transparent mb-6">
            거래 상대방
          </h2>

          {/* 상대방 정보 */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 mb-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {partner.name}
                </h3>

                <div className="flex items-center space-x-2">
                  <Image
                    src={currentGrade.icon}
                    alt={currentGrade.name}
                    width={16}
                    height={16}
                  />
                  <p className="text-gray-400 text-sm">
                    바삭스코어: {partner.rating}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-bold">{partner.data}GB</p>
                <p className="text-gray-400 text-sm">{partner.carrier}</p>
              </div>
            </div>
          </div>

          {/* 단골 등록/해제 버튼 */}
          <button
            onClick={handleToggleFavorite}
            disabled={isCheckingFavorite || isToggling}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden group mb-4 ${
              isCheckingFavorite || isToggling
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : isFavorite
                  ? 'bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-300 hover:to-red-400 shadow-lg hover:shadow-red-400/25'
                  : 'bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-300 hover:to-purple-400 shadow-lg hover:shadow-pink-400/25'
            }`}
          >
            {isCheckingFavorite ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>확인 중...</span>
              </span>
            ) : isToggling ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>{isFavorite ? '해제 중...' : '등록 중...'}</span>
              </span>
            ) : (
              <>
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>{isFavorite ? '💔' : '❤️'}</span>
                  <span>{isFavorite ? '단골 해제하기' : '단골 등록하기'}</span>
                </span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="relative bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
        {/* 서브틀한 글로우 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-blue-300/3"></div>

        <div className="relative p-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-green-300 to-white bg-clip-text text-transparent mb-6">
            다음 액션
          </h2>

          <div className="space-y-4">
            <button
              onClick={handleNewMatch}
              className="w-full bg-gradient-to-r from-green-400 to-green-500 text-black py-4 px-6 rounded-xl font-bold text-lg hover:from-green-300 hover:to-green-400 transition-all duration-300 shadow-lg hover:shadow-green-400/25 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span>🔄</span>
                <span>새로운 매칭 시작</span>
              </span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            </button>

            <button
              onClick={handleGoHome}
              className="w-full border-2 border-gray-600 text-gray-300 py-4 px-6 rounded-xl font-bold text-lg hover:bg-gray-800/50 hover:border-gray-500 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span>🏠</span>
                <span>홈으로 돌아가기</span>
              </span>
              <div className="absolute inset-0 bg-gray-700/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            </button>
          </div>

          {/* 거래 히스토리 섹션 */}
          <div className="mt-8 p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl backdrop-blur-sm">
            <h3 className="font-bold text-gray-200 mb-3">거래 히스토리</h3>
            <p className="text-sm text-gray-400 mb-4">
              마이페이지에서 모든 거래 내역을 확인할 수 있습니다.
            </p>
            <button
              onClick={() => router.push('/mypage')}
              className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
            >
              거래 내역 보기 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
