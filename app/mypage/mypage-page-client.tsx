'use client';
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/app/(shared)/stores/user-store';

import { useWebSocketGuard } from '@/app/(shared)/hooks/useWebSocketGuard';
import { toast } from 'sonner';

import { useFavorites } from '@/app/(shared)/hooks/use-favorites';
import LoadingState from '@/app/(shared)/components/loading-state';
import MyPageContent from '@/app/mypage/components/mypage-content';
import MyPageModals from '@/app/mypage/components/mypage-modals';

export default function MyPagePageClient() {
  const router = useRouter();

  // WebSocket 가드 사용
  useWebSocketGuard();

  const {
    profile,
    fetchUserProfile,
    updateNickname,
    isLoading,
    error,
    setError,
  } = useUserStore();

  const { favorites, handleDeleteFavorite } = useFavorites();

  // 중복 호출 방지를 위한 ref
  const isProfileLoadedRef = useRef(false);

  // 컴포넌트 마운트 시 사용자 정보 가져오기
  useEffect(() => {
    // 이미 로드된 경우 중복 호출 방지
    if (isProfileLoadedRef.current) {
      return;
    }

    isProfileLoadedRef.current = true;
    fetchUserProfile();
  }, []); // fetchUserProfile을 의존성에서 제거

  // error가 있을 때 로그인 페이지로 이동
  useEffect(() => {
    if (error) {
      console.log('유저 정보 가져오기 실패 :', error);
      toast.error('로그인 후 이용이 가능합니다.');
      // 로그인 페이지로 이동
      router.push('/login');
    }
  }, [error, router]);

  // 로그인 성공 후 에러 상태 초기화
  useEffect(() => {
    if (profile && error) {
      // 프로필이 있으면 에러 상태 초기화
      setError(null);
    }
  }, [profile, error, setError]);

  // 로딩 상태 표시
  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-background w-full">
      <MyPageContent favorites={favorites} />
      <MyPageModals
        profile={profile}
        favorites={favorites}
        onUpdateNickname={updateNickname}
        onFetchUserProfile={fetchUserProfile}
        onDeleteFavorite={handleDeleteFavorite}
      />
    </div>
  );
}
