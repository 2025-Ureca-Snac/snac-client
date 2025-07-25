import { create } from 'zustand';
import { UserProfile, UserState } from '../types/user-store';

export const useUserStore = create<UserState>()((set, get) => ({
  // 초기 상태
  profile: null,
  isLoading: false,
  error: null,

  // 프로필 설정
  setProfile: (profile: UserProfile) => {
    set({ profile, error: null });
  },

  // 프로필 업데이트
  updateProfile: (updates: Partial<UserProfile>) => {
    const currentProfile = get().profile;
    if (currentProfile) {
      set({
        profile: {
          ...currentProfile,
          ...updates,
          updatedAt: new Date(),
        },
      });
    }
  },

  // 설정 업데이트
  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => {
    const currentProfile = get().profile;
    if (currentProfile) {
      set({
        profile: {
          ...currentProfile,
          preferences: {
            ...currentProfile.preferences,
            ...preferences,
          },
          updatedAt: new Date(),
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
