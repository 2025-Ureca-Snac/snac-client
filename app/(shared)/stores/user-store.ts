import { create } from 'zustand';
import { UserProfile, UserState, ApiUserResponse } from '../types/user-store';
import { ApiResponse } from '../types/api';
import { api } from '../utils/api';

export const useUserStore = create<UserState>()((set, get) => ({
  // 초기 상태
  profile: null,
  isLoading: false,
  error: null,

  // 사용자 정보 가져오기
  fetchUserProfile: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.get<ApiResponse<ApiUserResponse>>('/mypage');

      console.log('사용자 정보 API 응답 데이터:', response);

      if (response.status === 200) {
        const userData = response.data.data;
        console.log('API 응답 데이터:', userData);

        const profile: UserProfile = {
          name: userData.name,
          nickname: userData.nickname,
          phone: userData.phone,
          birthDate: new Date(userData.birthDate),
          score: userData.score,
          favoriteCount: userData.favoriteCount,
          nicknameUpdatedAt: new Date(userData.nicknameUpdatedAt),
          googleConnected: userData.googleConnected,
          kakaoConnected: userData.kakaoConnected,
          naverConnected: userData.naverConnected,
        };

        console.log('변환된 UserProfile:', profile);
        set({ profile, error: null });
      } else {
        set({ error: '사용자 정보를 가져오는데 실패했습니다.' });
      }
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error);
      set({ error: '사용자 정보를 가져오는데 실패했습니다.' });
    } finally {
      set({ isLoading: false });
    }
  },

  // 프로필 설정
  setProfile: (profile: UserProfile) => {
    set({ profile, error: null });
  },

  // 프로필 업데이트 (닉네임 제외)
  updateProfile: (
    updates: Partial<Omit<UserProfile, 'nickname' | 'nicknameUpdatedAt'>>
  ) => {
    const currentProfile = get().profile;
    if (currentProfile) {
      set({
        profile: {
          ...currentProfile,
          ...updates,
        },
      });
    }
  },

  // 닉네임 업데이트 (변경 시간 기록)
  updateNickname: (nickname: string) => {
    const currentProfile = get().profile;
    if (currentProfile) {
      set({
        profile: {
          ...currentProfile,
          nickname,
          nicknameUpdatedAt: new Date(),
        },
      });
    }
  },

  // 로딩 상태 설정
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // 에러 설정
  setError: (error: string | null) => {
    set({ error });
  },

  // 프로필 초기화
  clearProfile: () => {
    set({ profile: null, error: null });
  },
}));
