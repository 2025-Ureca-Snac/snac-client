'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/app/(shared)/stores/user-store';
import { useModalStore } from '@/app/(shared)/stores/modal-store';
import SideMenu from '@/app/(shared)/components/SideMenu';
import SettingList from '@/app/(shared)/components/SettingList';

import ChangePasswordModal from '@/app/(shared)/components/ChangePasswordModal';
import ChangePhoneModal from '@/app/(shared)/components/ChangePhoneModal';
import ChangeNicknameModal from '@/app/(shared)/components/ChangeNicknameModal';
import SocialLoginModal from '@/app/(shared)/components/SocialLoginModal';
import ServiceGuideModal from '@/app/(shared)/components/ServiceGuideModal';
import PrivacyPolicyModal from '@/app/(shared)/components/PrivacyPolicyModal';
import ThemeModal from '@/app/(shared)/components/ThemeModal';

export default function SettingsPageClient() {
  const { profile, fetchUserProfile, updateNickname } = useUserStore();
  const { modalType, isOpen, openModal, closeModal } = useModalStore();

  const isProfileLoadedRef = useRef(false);

  // 컴포넌트 마운트 시 사용자 정보 가져오기
  useEffect(() => {
    // 이미 로드된 경우 중복 호출 방지
    if (isProfileLoadedRef.current) {
      return;
    }
    isProfileLoadedRef.current = true;
    fetchUserProfile();
  }, [fetchUserProfile]);

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    closeModal();
  };

  // 닉네임 변경 완료 핸들러
  const handleNicknameChange = async (newNickname: string) => {
    try {
      await updateNickname(newNickname);
      closeModal();
    } catch {
      // 닉네임 변경 실패 처리
    }
  };

  // 비밀번호 변경 완료 핸들러
  const handlePasswordChange = async () => {
    closeModal();
  };

  // 전화번호 변경 완료 핸들러
  const handlePhoneChange = async () => {
    closeModal();
  };

  // 소셜 로그인 연동 완료 핸들러
  const handleSocialLogin = async () => {
    closeModal();
  };

  // 설정 클릭 핸들러 (MyPage와 동일)
  const handleSettingItemClick = (item: string) => {
    // handleSettingClick 함수와 동일한 로직을 직접 구현
    const SETTING_MODAL_MAP = new Map([
      ['비밀번호 변경', 'change-password' as const],
      ['전화번호 변경', 'change-phone' as const],
      ['닉네임 변경', 'change-nickname' as const],
      ['소셜 로그인 연동', 'social-login' as const],
      ['서비스 가이드', 'service-guide' as const],
      ['개인정보 처리방침', 'privacy-policy' as const],
      ['화면 테마', 'theme' as const],
    ]);

    const modalType = SETTING_MODAL_MAP.get(item);
    if (modalType) {
      openModal(modalType);
    } else {
      // 알 수 없는 설정 항목 처리
    }
  };

  // 데스크탑 헤더
  const DesktopHeader = () => (
    <div className="hidden md:block mb-8">
      {/* 네비게이션 */}
      <nav aria-label="페이지 네비게이션">
        <div className="flex items-center gap-2 mb-4">
          <Link
            href="/mypage"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            마이페이지
          </Link>
          <span className="text-muted-foreground" aria-hidden="true">
            /
          </span>
          <span className="text-card-foreground font-medium">
            설정
          </span>
        </div>
      </nav>

      {/* 제목과 설명 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-card-foreground mb-2">
          설정
        </h1>
        <p className="text-muted-foreground text-lg">
          계정 설정 및 개인정보를 관리하세요
        </p>
      </div>
    </div>
  );

  // 모바일 헤더
  const MobileHeader = () => (
    <div className="md:hidden mb-6">
      {/* 네비게이션 */}
      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/mypage"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          마이페이지
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-card-foreground font-medium">설정</span>
      </div>

      {/* 제목 */}
      <h1 className="text-xl font-bold text-card-foreground">설정</h1>
    </div>
  );

  return (
    <div className="min-h-screen bg-card w-full">
      <div className="flex w-full min-h-screen">
        {/* 좌측 메뉴 (데스크탑만) */}
        <div className="hidden md:block w-64 flex-shrink-0 md:pt-8 md:pl-4">
          <SideMenu />
        </div>

        {/* 메인 컨텐츠 */}
        <main className="flex-1 flex flex-col md:pt-8 pt-4 md:px-6 px-2">
          <div className="max-w-4xl mx-auto w-full">
            {/* PC 헤더 */}
            <DesktopHeader />

            {/* 모바일 헤더 */}
            <MobileHeader />

            <section className="w-full max-w-full">
              <div className="bg-card rounded-lg shadow-sm border border-border">
                <div className="p-6">
                  <SettingList onItemClick={handleSettingItemClick} />
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* 모달들 */}
      <ChangePasswordModal
        open={isOpen && modalType === 'change-password'}
        onClose={handleCloseModal}
        onSubmit={handlePasswordChange}
      />

      <ChangePhoneModal
        open={isOpen && modalType === 'change-phone'}
        onClose={handleCloseModal}
        onSubmit={handlePhoneChange}
      />

      <ChangeNicknameModal
        open={isOpen && modalType === 'change-nickname'}
        onClose={handleCloseModal}
        onSubmit={handleNicknameChange}
        currentNickname={profile?.nickname || ''}
      />

      <SocialLoginModal
        open={isOpen && modalType === 'social-login'}
        onClose={handleCloseModal}
        onSubmit={handleSocialLogin}
      />

      <ServiceGuideModal
        open={isOpen && modalType === 'service-guide'}
        onClose={handleCloseModal}
      />

      <PrivacyPolicyModal
        open={isOpen && modalType === 'privacy-policy'}
        onClose={handleCloseModal}
      />

      <ThemeModal
        open={isOpen && modalType === 'theme'}
        onClose={handleCloseModal}
      />
    </div>
  );
}
