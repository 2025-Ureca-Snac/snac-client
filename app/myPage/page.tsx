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
import React, { useState, useEffect } from 'react';
import { useUserStore } from '../(shared)/stores/user-store';

const FAVORITES = Array(12).fill('데이터바삭이');

export default function MyPage() {
  const { profile, updatePreferences, updateProfile, setProfile } =
    useUserStore();
  const [favoriteModalOpen, setFavoriteModalOpen] = useState(false);
  const [changePwOpen, setChangePwOpen] = useState(false);
  const [changePhoneOpen, setChangePhoneOpen] = useState(false);
  const [changeNicknameOpen, setChangeNicknameOpen] = useState(false);
  const [socialLoginOpen, setSocialLoginOpen] = useState(false);
  const [serviceGuideOpen, setServiceGuideOpen] = useState(false);
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);

  // 테스트용 사용자 데이터 설정
  useEffect(() => {
    if (!profile) {
      setProfile({
        id: '1',
        email: 'test@example.com',
        name: '김유정',
        nickname: '김유정',
        phone: '010-1234-5678',
        birthDate: new Date('1999-05-02'),
        points: 104,
        money: 6000,
        preferences: {
          theme: 'light',
          language: 'ko',
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }, [profile, setProfile]);

  // SettingList에서 항목 클릭 시 모달 오픈
  const handleSettingClick = (item: string) => {
    if (item === '비밀번호 변경') setChangePwOpen(true);
    if (item === '번호 변경') setChangePhoneOpen(true);
    if (item === '닉네임 변경') setChangeNicknameOpen(true);
    if (item === '소셜 로그인 연동') setSocialLoginOpen(true);
    if (item === '서비스 가이드') setServiceGuideOpen(true);
    if (item === '개인정보 처리방침') setPrivacyPolicyOpen(true);
    if (item === '화면 테마') setThemeModalOpen(true);
  };

  // 단골 목록 모달 열기 이벤트 리스너
  useEffect(() => {
    const handleOpenFavoriteModal = () => {
      setFavoriteModalOpen(true);
    };

    window.addEventListener('openFavoriteModal', handleOpenFavoriteModal);

    return () => {
      window.removeEventListener('openFavoriteModal', handleOpenFavoriteModal);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="flex w-full min-h-screen">
        {/* 좌측 메뉴 (데스크탑만) */}
        <div className="hidden md:block w-64 flex-shrink-0 md:pt-8 md:pl-4">
          <SideMenu />
        </div>
        {/* 메인 컨텐츠 */}
        <main className="flex-1 flex flex-col md:pt-8 pt-4 md:px-6 px-2">
          <div className="max-w-4xl mx-auto w-full">
            <section className="w-full max-w-full">
              {/* ScoreCard (User Profile + 바삭 스코어 + 새싹 스낵이) */}
              <ScoreCard />
              {/* ActionButtons (판매 내역, 구매 내역, 신고 내역) */}
              <ActionButtons />
              {/* Accordion (거래 후기) */}
              <Accordion />
              {/* SettingList (설정 리스트) */}
              <SettingList onItemClick={handleSettingClick} />
              {/* 하단 버튼들 */}
              <div className="flex flex-col gap-3 mt-6">
                <button className="w-full py-4 rounded-lg bg-yellow-600 text-white font-bold text-lg hover:bg-yellow-700 transition-colors">
                  로그아웃
                </button>
                <button className="w-full py-4 rounded-lg bg-gray-100 text-gray-700 font-bold text-lg">
                  탈퇴하기
                </button>
              </div>
              {/* 비밀번호 변경 모달 */}
              <ChangePasswordModal
                open={changePwOpen}
                onClose={() => setChangePwOpen(false)}
                onSubmit={(current, next, confirm) => {
                  alert(`현재: ${current}\n새 비번: ${next}\n확인: ${confirm}`);
                  setChangePwOpen(false);
                }}
              />
              {/* 번호 변경 모달 */}
              <ChangePhoneModal
                open={changePhoneOpen}
                onClose={() => setChangePhoneOpen(false)}
                onSubmit={(current, next, code) => {
                  alert(`현재: ${current}\n변경: ${next}\n코드: ${code}`);
                  setChangePhoneOpen(false);
                }}
              />
              <ServiceGuideModal
                open={serviceGuideOpen}
                onClose={() => setServiceGuideOpen(false)}
              />
              <PrivacyPolicyModal
                open={privacyPolicyOpen}
                onClose={() => setPrivacyPolicyOpen(false)}
              />
              {/* 소셜 로그인 연동 모달 */}
              <SocialLoginModal
                open={socialLoginOpen}
                onClose={() => setSocialLoginOpen(false)}
                onSubmit={(provider, isLinked) => {
                  if (isLinked) {
                    alert(`${provider} 계정이 연동되었습니다.`);
                  } else {
                    alert(`${provider} 계정 연동이 해제되었습니다.`);
                  }
                }}
              />
              {/* 닉네임 변경 모달 */}
              <ChangeNicknameModal
                open={changeNicknameOpen}
                onClose={() => setChangeNicknameOpen(false)}
                currentNickname={profile?.nickname || ''}
                onSubmit={(nickname) => {
                  if (profile) {
                    updateProfile({ nickname });
                  }
                  alert(`닉네임이 "${nickname}"로 변경되었습니다.`);
                  setChangeNicknameOpen(false);
                }}
              />
            </section>
          </div>
        </main>
        {/* 단골 목록 모달 */}
        <FavoriteListModal
          open={favoriteModalOpen}
          onClose={() => setFavoriteModalOpen(false)}
          favorites={FAVORITES}
        />
        {/* 화면 테마 모달 */}
        <ThemeModal
          open={themeModalOpen}
          onClose={() => setThemeModalOpen(false)}
          currentTheme={profile?.preferences.theme || 'light'}
          onThemeChange={(theme) => {
            if (profile) {
              updatePreferences({ theme });
            }
          }}
        />
      </div>
    </div>
  );
}
