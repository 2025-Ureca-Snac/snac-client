import { create } from 'zustand';
import { UserProfile, UserState, ApiUserResponse } from '../types/user-store';
import { ApiResponse } from '../types/api';
import { api } from '../utils/api';

export const useUserStore = create<UserState>()((set, get) => {
  // 중복 호출 방지를 위한 플래그
  let isFetching = false;

  return {
    // 초기 상태
    profile: null,
    isLoading: false,
    error: null,

    // 사용자 정보 가져오기
    fetchUserProfile: async () => {
      // 이미 요청 중인 경우 중복 호출 방지
      if (isFetching) {
        return;
      }

      try {
        isFetching = true;
        set({ isLoading: true, error: null });

        const response = await api.get<ApiResponse<ApiUserResponse>>('/mypage');

        if (response.status === 200) {
          const userData = response.data.data;

          const profile: UserProfile = {
            name: userData.name,
            nickname: userData.nickname,
            phone: userData.phone,
            birthDate: new Date(userData.birthDate),
            score: userData.score,
            favoriteCount: userData.favoriteCount,
            nextNicknameChangeAllowedAt: new Date(
              userData.nextNicknameChangeAllowedAt
            ),
            googleConnected: userData.googleConnected,
            kakaoConnected: userData.kakaoConnected,
            naverConnected: userData.naverConnected,
          };

          set({ profile, error: null });
        } else {
          set({ error: '사용자 정보를 가져오는데 실패했습니다.' });
        }
      } catch {
        set({ error: '사용자 정보를 가져오는데 실패했습니다.' });
      } finally {
        set({ isLoading: false });
        isFetching = false;
      }
    },

    // 프로필 설정
    setProfile: (profile: UserProfile) => {
      set({ profile, error: null });
    },

    // 프로필 업데이트 (닉네임 제외)
    updateProfile: (
      updates: Partial<
        Omit<UserProfile, 'nickname' | 'nextNicknameChangeAllowedAt'>
      >
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

    // 닉네임 업데이트
    updateNickname: (nickname: string) => {
      const currentProfile = get().profile;
      if (currentProfile) {
        set({
          profile: {
            ...currentProfile,
            nickname,
          },
        });
      }
    },

    // 닉네임 변경 시간 업데이트
    updateNextNicknameChangeAllowedAt: (nextNicknameChangeAllowedAt: Date) => {
      const currentProfile = get().profile;
      if (currentProfile) {
        set({
          profile: {
            ...currentProfile,
            nextNicknameChangeAllowedAt,
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
  };
});
