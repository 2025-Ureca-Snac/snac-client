'use client';
import SideMenu from '../(shared)/components/SideMenu';
import ScoreCard from '../(shared)/components/ScoreCard';
import ActionButtons from '../(shared)/components/ActionButtons';
import Accordion from '../(shared)/components/Accordion';
import SettingList from '../(shared)/components/SettingList';
import FavoriteListModal from '../(shared)/components/FavoriteListModal';
import ChangePasswordModal from '../(shared)/components/ChangePasswordModal';
import ChangePhoneModal from '../(shared)/components/ChangePhoneModal';
import ChangeNicknameModal from '../(shared)/components/ChangeNicknameModal';
import SocialLoginModal from '../(shared)/components/SocialLoginModal';
import ServiceGuideModal from '../(shared)/components/ServiceGuideModal';
import PrivacyPolicyModal from '../(shared)/components/PrivacyPolicyModal';
import ThemeModal from '../(shared)/components/ThemeModal';
import React, { useEffect, useState } from 'react';
import { useUserStore } from '../(shared)/stores/user-store';
import { useModalStore } from '../(shared)/stores/modal-store';
import { useAuthStore } from '../(shared)/stores/auth-store';
import { useWebSocketGuard } from '../(shared)/hooks/useWebSocketGuard';
import { useRouter } from 'next/navigation';
import { api } from '../(shared)/utils/api';
import { ApiResponse } from '../(shared)/types/api';
import { toast } from 'sonner';

/**
 * @author 이승우
 * @description 마이페이지 페이지
 */
// 단골 목록 타입
interface FavoriteItem {
  memberId: number;
  nickname: string;
}

interface FavoriteResponse {
  contents: FavoriteItem[];
}

export default function MyPage() {
  // WebSocket 가드 사용
  useWebSocketGuard();

  const { profile, fetchUserProfile, updateNickname, isLoading, error } =
    useUserStore();
  const { isOpen, modalType, closeModal } = useModalStore();
  const { logout } = useAuthStore();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // 단골 목록 조회 API 함수
  const getFavorites = async (): Promise<FavoriteResponse> => {
    const response = await api.get<ApiResponse<FavoriteResponse>>('/favorites');
    console.log('단골 목록 조회: ', response.data.data);
    return response.data.data;
  };

  // 단골 삭제 API 함수
  const deleteFavorite = async (memberId: number): Promise<void> => {
    await api.delete(`/favorites/${memberId}`);
    console.log('단골 삭제 완료: ', memberId);
  };

  // 단골 목록 로드
  const loadFavorites = async () => {
    try {
      const response = await getFavorites();
      setFavorites(response.contents || []);
    } catch (err) {
      console.error('단골 목록 로드 실패:', err);
      setFavorites([]);
    }
  };

  // 단골 삭제 핸들러
  const handleDeleteFavorite = async (memberId: number, nickname: string) => {
    if (!confirm(`${nickname}을(를) 단골에서 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteFavorite(memberId);
      // 삭제 후 목록 새로고침
      await loadFavorites();
      toast.success(`${nickname}이(가) 단골에서 삭제되었습니다.`);
    } catch (err) {
      console.error('단골 삭제 실패:', err);
      toast.error('단골 삭제에 실패했습니다.');
    }
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('로그아웃되었습니다.');
      router.push('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      toast.error('로그아웃 중 오류가 발생했습니다.');
    }
  };

  // 컴포넌트 마운트 시 사용자 정보와 단골 목록 가져오기
  useEffect(() => {
    fetchUserProfile();
    loadFavorites();
  }, []); // fetchUserProfile을 의존성에서 제거

  // SettingList에서 항목 클릭 시 모달 오픈
  const handleSettingClick = (item: string) => {
    if (item === '비밀번호 변경')
      useModalStore.getState().openModal('change-password');
    if (item === '번호 변경')
      useModalStore.getState().openModal('change-phone');
    if (item === '닉네임 변경')
      useModalStore.getState().openModal('change-nickname');
    if (item === '소셜 로그인 연동')
      useModalStore.getState().openModal('social-login');
    if (item === '서비스 가이드')
      useModalStore.getState().openModal('service-guide');
    if (item === '개인정보 처리방침')
      useModalStore.getState().openModal('privacy-policy');
    if (item === '화면 테마') useModalStore.getState().openModal('theme');
  };

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="flex w-full min-h-screen">
        {/* 좌측 메뉴 (데스크탑만) */}
        <div className="hidden md:block w-64 flex-shrink-0 md:pt-8 md:pl-4">
          <SideMenu />
        </div>
        {/* 메인 컨텐츠 */}
        <main className="flex-1 flex flex-col md:pt-8 pt-4 md:px-6 px-2 mb-12">
          <div className="max-w-4xl mx-auto w-full">
            <section className="w-full max-w-full">
              {/* ScoreCard (User Profile + 바삭 스코어 + 새싹 스낵이) */}
              <ScoreCard favoriteCount={favorites.length} />
              {/* ActionButtons (판매 내역, 구매 내역, 신고 내역) */}
              <ActionButtons />
              {/* Accordion (거래 후기) */}
              <Accordion />
              {/* SettingList (설정 리스트) */}
              <SettingList onItemClick={handleSettingClick} />
              {/* 오류 메시지 */}
              {error && (
                <div className="flex items-start gap-2 mt-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-red-800 mb-2">{error}</p>
                    <button
                      onClick={fetchUserProfile}
                      className="text-xs text-red-600 hover:text-red-800 underline"
                    >
                      다시 시도
                    </button>
                  </div>
                </div>
              )}

              {/* 하단 버튼들 */}
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={handleLogout}
                  className="w-full py-4 rounded-lg bg-yellow-600 text-white font-bold text-lg hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                  aria-label="로그아웃"
                >
                  로그아웃
                </button>
                <button
                  onClick={() =>
                    toast.info('탈퇴 기능은 아직 구현되지 않았습니다.')
                  }
                  className="w-full py-4 rounded-lg bg-gray-100 text-gray-700 font-bold text-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  aria-label="회원 탈퇴"
                >
                  탈퇴하기
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* 모달들 */}
      <ChangePasswordModal
        open={isOpen && modalType === 'change-password'}
        onClose={closeModal}
        onSubmit={(current, next, confirm) => {
          // 비밀번호 변경 성공 시 모달 닫기
          closeModal();
        }}
      />
      <ChangePhoneModal
        open={isOpen && modalType === 'change-phone'}
        onClose={closeModal}
        onSubmit={(current, next, code) => {
          // 전화번호 변경 성공 시 모달 닫기
          closeModal();
        }}
      />
      <ServiceGuideModal
        open={isOpen && modalType === 'service-guide'}
        onClose={closeModal}
      />
      <PrivacyPolicyModal
        open={isOpen && modalType === 'privacy-policy'}
        onClose={closeModal}
      />
      <SocialLoginModal
        open={isOpen && modalType === 'social-login'}
        onClose={closeModal}
        onSubmit={(provider, isLinked) => {
          // 소셜 로그인 연동/해제 성공 시 사용자 프로필 새로고침
          fetchUserProfile();
          // 모달은 닫지 않고 계속 열어둠 (사용자가 다른 계정도 연동/해제할 수 있도록)
        }}
      />
      <ChangeNicknameModal
        open={isOpen && modalType === 'change-nickname'}
        onClose={closeModal}
        currentNickname={profile?.nickname || ''}
        onSubmit={(nickname) => {
          updateNickname(nickname);
          // 닉네임 변경 성공 시 모달 닫기
          closeModal();
        }}
      />
      <FavoriteListModal
        open={isOpen && modalType === 'favorite-list'}
        onClose={closeModal}
        favorites={favorites.map((fav) => ({
          memberId: fav.memberId,
          nickname: fav.nickname,
        }))}
        onDelete={handleDeleteFavorite}
      />
      <ThemeModal open={isOpen && modalType === 'theme'} onClose={closeModal} />
    </div>
  );
}
