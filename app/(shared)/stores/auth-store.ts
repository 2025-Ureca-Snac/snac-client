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
      tokenExp: null,
      isLoading: false,

      // 초기화 함수
      resetAuthState: () => {
        set({ user: null, role: null, token: null, tokenExp: null });
      },

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

            set({
              user: decoded?.username,
              role: decoded?.role,
              token: token,
              tokenExp: decoded?.exp, // 토큰 만료 시간 저장
            });
          }
        } catch (error) {
          useAuthStore.getState().resetAuthState();
          console.log(handleApiError(error));
        } finally {
          set({ isLoading: false });
        }
      },

      // 소셜 로그인 연동 액션
      linkSocialAccount: async (providerId: string) => {
        try {
          set({ isLoading: true });

          // 백엔드 인증 페이지를 팝업으로 열기
          const currentToken = useAuthStore.getState().token;
          const authUrl = `${process.env.NEXT_PUBLIC_SOCIAL_API_URL}/oauth2/authorization/${providerId}${currentToken ? `?state=${currentToken}` : ''}`;
          const width = 500;
          const height = 600;
          const left = window.screenX + (window.outerWidth - width) / 2;
          const top = window.screenY + (window.outerHeight - height) / 2;

          const authWindow = window.open(
            authUrl,
            'socialAuth',
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
          );

          if (!authWindow) {
            throw new Error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
          }

          // Promise로 인증 완료 대기
          return new Promise<boolean>((resolve, reject) => {
            const handleAuthMessage = async (event: MessageEvent) => {
              if (event.origin !== window.location.origin) return;

              if (event.data.type === 'AUTH_SUCCESS') {
                console.log('소셜 로그인 인증 성공:', event.data.data);

                try {
                  // 백엔드로 소셜 로그인 연동 요청
                  const response = await api.post(
                    '/social-login',
                    { providerId },
                    {
                      headers: {
                        Authorization: `Bearer ${event.data.data.authorization}`,
                      },
                    }
                  );

                  const token = response.headers
                    .get('Authorization')
                    ?.split(' ')[1];
                  if (token) {
                    const decoded: JwtPayload = jwtDecode(token);
                    set({
                      user: decoded?.username,
                      role: decoded?.role,
                      token: token,
                      tokenExp: decoded?.exp, // 토큰 만료 시간 저장
                    });
                    console.log('소셜 로그인 성공:', response);
                    resolve(true);
                  } else {
                    useAuthStore.getState().resetAuthState();
                    reject(new Error('소셜 로그인에 실패했습니다.'));
                  }
                } catch (error) {
                  console.error('소셜 로그인 실패:', error);
                  reject(new Error('소셜 로그인에 실패했습니다.'));
                }

                // 이벤트 리스너 제거
                window.removeEventListener('message', handleAuthMessage);
              } else if (event.data.type === 'AUTH_ERROR') {
                console.log('소셜 로그인 인증 실패:', event.data.data);
                reject(new Error('소셜 로그인 인증에 실패했습니다.'));

                // 이벤트 리스너 제거
                window.removeEventListener('message', handleAuthMessage);
              }
            };

            window.addEventListener('message', handleAuthMessage);
          });
        } catch (error) {
          console.error('소셜 인증 중 오류:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // 소셜 로그인 해제 액션
      unlinkSocialAccount: async (providerId: string) => {
        try {
          set({ isLoading: true });

          // 백엔드 인증 페이지를 팝업으로 열기
          const authUrl = `${process.env.NEXT_PUBLIC_SOCIAL_API_URL}/oauth2/authorization/${providerId}`;
          const width = 500;
          const height = 600;
          const left = window.screenX + (window.outerWidth - width) / 2;
          const top = window.screenY + (window.outerHeight - height) / 2;

          const authWindow = window.open(
            authUrl,
            'socialAuth',
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
          );

          if (!authWindow) {
            throw new Error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
          }

          // Promise로 인증 완료 대기
          return new Promise<boolean>((resolve, reject) => {
            const handleAuthMessage = async (event: MessageEvent) => {
              if (event.origin !== window.location.origin) return;

              if (event.data.type === 'AUTH_SUCCESS') {
                console.log('소셜 로그인 해제 인증 성공:', event.data.data);

                try {
                  // 백엔드로 소셜 로그인 해제 요청
                  const response = await api.delete(
                    `/oauth2/authorization/unlink/${providerId}`
                  );
                  console.log('소셜 로그인 해제 성공:', response);
                  resolve(true);
                } catch (error) {
                  console.error('소셜 로그인 해제 실패:', error);
                  reject(new Error('소셜 로그인 해제에 실패했습니다.'));
                }

                // 이벤트 리스너 제거
                window.removeEventListener('message', handleAuthMessage);
              } else if (event.data.type === 'AUTH_ERROR') {
                console.log('소셜 로그인 해제 인증 실패:', event.data.data);
                reject(new Error('소셜 로그인 해제 인증에 실패했습니다.'));

                // 이벤트 리스너 제거
                window.removeEventListener('message', handleAuthMessage);
              }
            };

            window.addEventListener('message', handleAuthMessage);
          });
        } catch (error) {
          console.error('소셜 해제 중 오류:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // 로그아웃 액션
      logout: async () => {
        try {
          const response = await api.post<unknown>('/logout');
          console.log(response);
        } catch (error) {
          console.error('로그아웃 중 오류:', error);
        } finally {
          // 로그아웃을 실패했어도 리프래쉬가 없는 것이기 때문에 무조건 상태 초기화
          useAuthStore.getState().resetAuthState();
          const { useUserStore } = await import('../stores/user-store');
          useUserStore.getState().clearProfile();
        }
      },

      // 토큰 갱신
      checkAndRefreshToken: async () => {
        const { token } = useAuthStore.getState();
        if (!token) {
          return false;
        }

        try {
          // 만료시간 상관없이 항상 /reissue 호출
          const response = await api.post('/reissue');

          // 새로운 토큰이 헤더에 포함되어 있는지 확인
          const newToken = response.headers.get('Authorization')?.split(' ')[1];
          if (newToken) {
            // 새로운 토큰이 발급된 경우 저장
            const decoded: JwtPayload = jwtDecode(newToken);
            set({
              token: newToken,
              tokenExp: decoded?.exp,
            });
            return true;
          } else {
            // 새로운 토큰이 없는 경우 기존 토큰 유지
            return true;
          }
        } catch {
          // /reissue 실패 시 로그아웃

          // resetAuthState 대신 직접 상태 초기화 (다른 컴포넌트 리렌더링 방지)
          set({
            user: null,
            role: null,
            token: null,
            tokenExp: null,
            isLoading: false,
          });

          return false;
        }
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
        tokenExp: state.tokenExp,
      }),
    }
  )
);
