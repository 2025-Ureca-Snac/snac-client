import React, { useState, useEffect } from 'react';
import ModalPortal from './modal-portal';
import { useAuthStore } from '../stores/auth-store';
import { useUserStore } from '../stores/user-store';
import {
  SOCIAL_MODAL_PROVIDERS,
  SOCIAL_LOGIN_MODAL_INITIAL_STATE,
} from '../constants/social-login-modal-constants';
import { SocialLoginModalProps } from '../types/social-login-modal';
import { toast } from 'sonner';

/**
 * @author 이승우
 * @description 소셜 로그인 모달 컴포넌트{@link SocialLoginModalProps(open, onClose, onSubmit)}
 * @param {boolean} open 모달 열림 상태
 * @param {Function} onClose 모달 닫기 함수
 * @param {Function} onSubmit 소셜 로그인 연동 함수
 */
export default function SocialLoginModal({
  open,
  onClose,
  onSubmit,
}: SocialLoginModalProps) {
  const { linkSocialAccount, unlinkSocialAccount } = useAuthStore();
  const { profile } = useUserStore();
  const [linkedProviders, setLinkedProviders] = useState<{
    [key: string]: boolean;
  }>(SOCIAL_LOGIN_MODAL_INITIAL_STATE);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // 모달이 열릴 때 현재 연동 상태를 가져오기
  useEffect(() => {
    if (open && profile) {
      // API에서 받은 실제 연동 상태로 설정
      setLinkedProviders({
        google: profile.googleConnected || false,
        kakao: profile.kakaoConnected || false,
        naver: profile.naverConnected || false,
      });
    }
  }, [open, profile]);

  // 모달이 닫힐 때 로딩 상태 초기화
  useEffect(() => {
    if (!open) {
      setIsLoading(null);
    }
  }, [open]);

  const handleToggleProvider = async (providerId: string) => {
    const isCurrentlyLinked = linkedProviders[providerId];
    const provider = SOCIAL_MODAL_PROVIDERS.find((p) => p.id === providerId);

    if (!provider) {
      toast.error('지원하지 않는 소셜 로그인 제공자입니다.');
      return;
    }

    setIsLoading(providerId);

    try {
      if (!isCurrentlyLinked) {
        // 소셜 로그인 연동
        console.log('소셜 로그인 연동 시작:', providerId);
        const success = await linkSocialAccount(providerId);
        console.log('소셜 로그인 연동 결과:', success);

        if (success) {
          setLinkedProviders((prev) => ({
            ...prev,
            [providerId]: true,
          }));

          console.log('로컬 상태 업데이트 완료');
          toast.success(`${provider.name} 계정이 연동되었습니다.`);

          if (onSubmit) {
            onSubmit(providerId, true);
          }
        } else {
          toast.error('소셜 로그인 연동에 실패했습니다.');
        }
      } else {
        // 소셜 로그인 해제
        const success = await unlinkSocialAccount(providerId);

        if (success) {
          // 로컬 상태 업데이트
          setLinkedProviders((prev) => ({
            ...prev,
            [providerId]: false,
          }));

          toast.success(`${provider.name} 계정 연동이 해제되었습니다.`);

          if (onSubmit) {
            onSubmit(providerId, false);
          }
        } else {
          toast.error('소셜 로그인 해제에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('소셜 로그인 연동 처리 중 오류:', error);

      // 에러 타입에 따른 메시지 처리
      if (error instanceof Error) {
        if (error.message.includes('중복')) {
          toast.error('이미 연동된 계정입니다.');
        } else if (error.message.includes('연동된 계정이 없습니다')) {
          toast.error('연동된 계정이 없습니다.');
        } else {
          toast.error('소셜 로그인 처리 중 오류가 발생했습니다.');
        }
      } else {
        toast.error('소셜 로그인 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <ModalPortal isOpen={open} onClose={onClose}>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
        onClick={onClose}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
      >
        <div
          className="bg-white rounded-2xl shadow-xl w-[370px] max-w-full pt-6 pb-8 px-6 relative flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 상단 아이콘 */}
          <div className="flex flex-col items-center -mt-12 mb-2">
            <div
              className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2 border-4 border-white shadow"
              style={{ marginTop: '-32px' }}
            >
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                  fill="#2563EB"
                />
              </svg>
            </div>
            <div className="text-xl font-extrabold text-black text-center">
              소셜 로그인 연동
            </div>
            <button
              onClick={onClose}
              type="button"
              className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-gray-600"
              aria-label="닫기"
            >
              ×
            </button>
          </div>
          <div className="w-full text-center text-gray-600 mb-6 text-sm">
            소셜 계정 연동 상태를 관리해주세요.
          </div>

          {/* 소셜 로그인 옵션들 */}
          <div className="w-full flex flex-col gap-3 mb-6">
            {SOCIAL_MODAL_PROVIDERS.map((provider) => (
              <div
                key={provider.id}
                className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${provider.color} ${provider.textColor} ${provider.border || ''}`}
                  >
                    {provider.icon}
                  </div>
                  <span className="font-semibold text-gray-800">
                    {provider.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleProvider(provider.id)}
                  disabled={isLoading === provider.id}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    linkedProviders[provider.id] ? 'bg-blue-600' : 'bg-gray-200'
                  } ${isLoading === provider.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading === provider.id ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        linkedProviders[provider.id]
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      }`}
                    />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
