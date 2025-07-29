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
import { useRouter } from 'next/navigation';
import { api } from '../(shared)/utils/api';
import { ApiResponse } from '../(shared)/types/api';

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
      alert(`${nickname}이(가) 단골에서 삭제되었습니다.`);
    } catch (err) {
      console.error('단골 삭제 실패:', err);
      alert('단골 삭제에 실패했습니다.');
    }
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
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

  // 에러 상태 표시
  if (error) {
    return (
      <div className="min-h-screen bg-background w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={fetchUserProfile}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            다시 시도
          </button>
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
                  onClick={() => alert('탈퇴 기능은 아직 구현되지 않았습니다.')}
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
          alert(`현재: ${current}\n새 비번: ${next}\n확인: ${confirm}`);
          closeModal();
        }}
      />
      <ChangePhoneModal
        open={isOpen && modalType === 'change-phone'}
        onClose={closeModal}
        onSubmit={(current, next, code) => {
          alert(`현재: ${current}\n변경: ${next}\n코드: ${code}`);
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
          if (isLinked) {
            alert(`${provider} 계정이 연동되었습니다.`);
          } else {
            alert(`${provider} 계정 연동이 해제되었습니다.`);
          }
        }}
      />
      <ChangeNicknameModal
        open={isOpen && modalType === 'change-nickname'}
        onClose={closeModal}
        currentNickname={profile?.nickname || ''}
        onSubmit={(nickname) => {
          updateNickname(nickname);
          alert(`닉네임이 "${nickname}"로 변경되었습니다.`);
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
