import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, handleApiError } from '../utils/api';
import { jwtDecode } from 'jwt-decode';
import { AuthState, JwtPayload } from '../types/auth-store';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 초기 상태
      user: null,
      token: null,
      role: null,
      isLoading: false,

      // 로그인 액션
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          const response = await api.post<unknown>('/login', {
            email,
            password,
          });

          console.log(response);

          const token = response.headers.get('Authorization')?.split(' ')[1];
          if (token) {
            const decoded: JwtPayload = jwtDecode(token);
            set({ user: decoded?.username, role: decoded?.role, token: token });
          }
        } catch (error) {
          set({ user: null, role: null, token: null });
          console.log(handleApiError(error));
        } finally {
          set({ isLoading: false });
        }
      },

      // 로그아웃 액션
      logout: async () => {
        const response = await api.post<unknown>('/logout');

        console.log(response);

        set({ user: null, role: null, token: null });
      },

      // 로딩 상태 설정
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      // localstorage에 저장하여 브라우저 새로고침 시 상태 유지
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        role: state.role,
      }),
    }
  )
);
