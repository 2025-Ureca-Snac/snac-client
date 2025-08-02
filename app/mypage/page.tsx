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
import React, { useEffect, useState, useCallback } from 'react';
import { useUserStore } from '../(shared)/stores/user-store';
import { useModalStore } from '../(shared)/stores/modal-store';
import { useWebSocketGuard } from '../(shared)/hooks/useWebSocketGuard';
import { api } from '../(shared)/utils/api';
import { ApiResponse } from '../(shared)/types/api';
import { toast } from 'sonner';
import { FavoriteItem, FavoriteResponse } from '../(shared)/types/mypage';
import MyPageBottomButtons from '../(shared)/components/mypage-bottom-buttons';
import LoadingSpinner from '../(shared)/components/LoadingSpinner';

export default function MyPage() {
  // WebSocket 가드 사용
  useWebSocketGuard();

  const { profile, fetchUserProfile, updateNickname, isLoading, error } =
    useUserStore();
  const { isOpen, modalType, closeModal } = useModalStore();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  /**
   * @author 이승우
   * @description 단골 목록 조회 API 함수
   * @returns 단골 목록 데이터
   */
  const getFavorites = useCallback(async (): Promise<FavoriteResponse> => {
    const response = await api.get<ApiResponse<FavoriteResponse>>('/favorites');
    console.log('단골 목록 조회: ', response.data.data);
    return response.data.data;
  }, []);

  /**
   * @author 이승우
   * @description 단골 삭제 API 함수
   * @param memberId - 삭제할 회원 ID
   */
  const deleteFavorite = useCallback(
    async (memberId: number): Promise<void> => {
      await api.delete(`/favorites/${memberId}`);
      console.log('단골 삭제 완료: ', memberId);
    },
    []
  );

  /**
   * @author 이승우
   * @description 단골 목록 로드 함수
   */
  const loadFavorites = useCallback(async () => {
    try {
      const response = await getFavorites();
      setFavorites(response.contents || []);
    } catch (err) {
      console.error('단골 목록 로드 실패:', err);
      setFavorites([]);
      toast.error('단골 목록을 불러오는데 실패했습니다.');
    }
  }, [getFavorites]);

  /**
   * @author 이승우
   * @description 단골 삭제 핸들러
   * @param memberId - 삭제할 회원 ID
   * @param nickname - 삭제할 회원 닉네임
   */
  const handleDeleteFavorite = useCallback(
    async (memberId: number, nickname: string) => {
      // 사용자 확인을 위한 toast 사용
      toast.error(`${nickname}을(를) 단골에서 삭제하시겠습니까?`, {
        action: {
          label: '삭제',
          onClick: async () => {
            try {
              await deleteFavorite(memberId);
              // 삭제 후 목록 새로고침
              await loadFavorites();
              toast.success(`${nickname}이(가) 단골에서 삭제되었습니다.`);
            } catch (err) {
              console.error('단골 삭제 실패:', err);
              toast.error('단골 삭제에 실패했습니다.');
            }
          },
        },
      });
    },
    [deleteFavorite, loadFavorites]
  );

  // 컴포넌트 마운트 시 사용자 정보와 단골 목록 가져오기
  useEffect(() => {
    fetchUserProfile();
    loadFavorites();
  }, []); // fetchUserProfile을 의존성에서 제거

  // error가 있을 때 toast로 표시
  useEffect(() => {
    if (error) {
      toast.error(error, {
        action: {
          label: '다시 시도',
          onClick: fetchUserProfile,
        },
      });
    }
  }, [error]);

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
          <LoadingSpinner size="lg" color="border-primary" />
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

              {/* 하단 버튼들 */}
              <MyPageBottomButtons />
            </section>
          </div>
        </main>
      </div>

      {/* 모달들 */}
      <ChangePasswordModal
        open={isOpen && modalType === 'change-password'}
        onClose={closeModal}
        onSubmit={() => {
          // 비밀번호 변경 성공 시 모달 닫기
          closeModal();
        }}
      />
      <ChangePhoneModal
        open={isOpen && modalType === 'change-phone'}
        onClose={closeModal}
        onSubmit={() => {
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
        onSubmit={() => {
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
