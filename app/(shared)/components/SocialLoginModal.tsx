import React, { useState } from 'react';
import ModalPortal from './modal-portal';
import { api, handleApiError } from '../utils/api';
import { useAuthStore } from '../stores/auth-store';

interface SocialLoginModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (provider: string, isLinked: boolean) => void;
}

export default function SocialLoginModal({
  open,
  onClose,
  onSubmit,
}: SocialLoginModalProps) {
  const { token } = useAuthStore();
  const [linkedProviders, setLinkedProviders] = useState<{
    [key: string]: boolean;
  }>({
    kakao: false,
    naver: false,
    google: false,
  });
  // 모달이 열릴 때 현재 연동 상태를 가져오기
  React.useEffect(() => {
    if (open) {
      fetchLinkedProviders();
    }
  }, [open]);

  const fetchLinkedProviders = async () => {
    // 현재는 상태 조회 API가 없으므로 기본값으로 설정
    setLinkedProviders({
      kakao: false,
      naver: false,
      google: false,
    });
  };

  const socialProviders = [
    {
      id: 'kakao',
      name: '카카오',
      color: 'bg-yellow-400',
      textColor: 'text-black',
      icon: 'K',
    },
    {
      id: 'naver',
      name: '네이버',
      color: 'bg-green-500',
      textColor: 'text-white',
      icon: 'N',
    },
    {
      id: 'google',
      name: '구글',
      color: 'bg-white',
      textColor: 'text-gray-700',
      icon: 'G',
      border: 'border border-gray-300',
    },
  ];

  const handleToggleProvider = async (providerId: string) => {
    const isCurrentlyLinked = linkedProviders[providerId];
    const provider = socialProviders.find((p) => p.id === providerId);

    if (!provider) {
      alert('지원하지 않는 소셜 로그인 제공자입니다.');
      return;
    }

    try {
      if (!isCurrentlyLinked) {
        // 소셜 로그인 연동 - 팝업으로 OAuth2 인증 페이지 열기
        const popup = window.open(
          `http://localhost:8080/oauth2/authorization/${providerId}?state=${token}`,
          'socialLogin',
          'width=500,height=600,scrollbars=yes,resizable=yes'
        );

        // 팝업이 차단되었는지 확인
        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          alert(
            '팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해주세요.'
          );
          return;
        }

        // 팝업 창이 닫힐 때까지 대기
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            // 팝업이 닫히면 연동 성공으로 간주하고 상태 업데이트
            setLinkedProviders((prev) => ({
              ...prev,
              [providerId]: true,
            }));
            if (onSubmit) {
              onSubmit(providerId, true);
            }
          }
        }, 1000);
      } else {
        // 소셜 로그인 해제 API 호출
        await api.delete(`/oauth2/authorization/unlink/${providerId}`);
        setLinkedProviders((prev) => ({
          ...prev,
          [providerId]: false,
        }));
        if (onSubmit) {
          onSubmit(providerId, false);
        }
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      alert(`소셜 로그인 연동 처리 중 오류가 발생했습니다: ${errorMessage}`);
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
            {socialProviders.map((provider) => (
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
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    linkedProviders[provider.id] ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      linkedProviders[provider.id]
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
