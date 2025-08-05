import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, handleApiError } from '../utils/api';
import { jwtDecode } from 'jwt-decode';
import { AuthState, JwtPayload } from '../types/auth-store';

// 에러 코드에 따른 메시지를 생성하는 헬퍼 함수
const getAuthErrorMessage = (
  errorCode: string,
  isUnlink: boolean = false
): string => {
  const defaultMessage = isUnlink
    ? '소셜 로그인 해제 인증에 실패했습니다.'
    : '소셜 로그인 인증에 실패했습니다.';

  switch (errorCode) {
    case 'OAUTH_DB_ACCOUNT_NOT_FOUND_404':
      return isUnlink
        ? '소셜 계정에 연동된 계정이 없습니다.'
        : '소셜 계정에 연동된 계정이 없습니다. 회원가입을 먼저 진행해주세요.';
    case 'MEMBER_NOT_FOUND_404':
      return '존재하지 않는 회원입니다.';
    case 'OAUTH_DB_ALREADY_LINKED_409':
      return '이미 다른 계정에 연동된 소셜 계정입니다.';
    default:
      return defaultMessage;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 초기 상태
      user: null,
      token: null,
      role: null,
      tokenExp: null,
      isLoading: false,
      error: null,

      // 초기화 함수
      resetAuthState: () => {
        set({
          user: null,
          role: null,
          token: null,
          tokenExp: null,
          error: null,
        });
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
              error: null, // 로그인 성공 시 에러 상태 초기화
            });

            // user-store의 에러 상태도 초기화
            const { useUserStore } = await import('./user-store');
            useUserStore.getState().setError(null);
          }
        } catch (error) {
          useAuthStore.getState().resetAuthState();
          console.log(handleApiError(error));

          // 오류 메시지 설정
          let errorMessage = '로그인에 실패했습니다.';
          if (error && typeof error === 'object' && 'response' in error) {
            const apiError = error as {
              response?: { status?: number; data?: { message?: string } };
            };
            if (apiError.response?.data?.message) {
              errorMessage = apiError.response.data.message;
            }
          }
          set({ error: errorMessage });
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
            'socialAuthLink',
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
          );

          if (!authWindow) {
            throw new Error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
          }

          // Promise로 인증 완료 대기
          return new Promise<boolean>((resolve, reject) => {
            const handleAuthMessage = async (event: MessageEvent) => {
              //if (event.origin !== window.location.origin) return;

              // 즉시 이벤트 리스너 제거 (중복 메시지 방지)
              window.removeEventListener('message', handleAuthMessage);

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
                      error: null, // 로그인 성공 시 에러 상태 초기화
                    });

                    // user-store의 에러 상태도 초기화
                    const { useUserStore } = await import('./user-store');
                    useUserStore.getState().setError(null);

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
              } else if (event.data.type === 'AUTH_ERROR') {
                console.log('소셜 로그인 인증 실패:', event.data.data);

                // 헬퍼 함수를 사용하여 에러 메시지 생성
                const errorCode = event.data.data?.error;
                const errorMessage = getAuthErrorMessage(
                  errorCode || '',
                  false
                );
                reject(new Error(errorMessage));
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
            'socialAuthUnlink',
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
          );

          if (!authWindow) {
            throw new Error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
          }

          // Promise로 인증 완료 대기
          return new Promise<boolean>((resolve, reject) => {
            const handleAuthMessage = async (event: MessageEvent) => {
              //if (event.origin !== window.location.origin) return;

              // 즉시 이벤트 리스너 제거 (중복 메시지 방지)
              window.removeEventListener('message', handleAuthMessage);

              if (event.data.type === 'AUTH_SUCCESS') {
                try {
                  // 백엔드로 소셜 로그인 해제 요청
                  await api.post(`/unlink/${providerId}`);

                  // 팝업 창 닫기
                  if (authWindow && !authWindow.closed) {
                    authWindow.close();
                  }

                  resolve(true);
                } catch (error) {
                  console.error('소셜 로그인 해제 실패:', error);

                  // 팝업 창 닫기
                  if (authWindow && !authWindow.closed) {
                    authWindow.close();
                  }

                  reject(new Error('소셜 로그인 해제에 실패했습니다.'));
                }
              } else if (event.data.type === 'AUTH_ERROR') {
                // 팝업 창 닫기
                if (authWindow && !authWindow.closed) {
                  authWindow.close();
                }

                // 헬퍼 함수를 사용하여 에러 메시지 생성
                const errorCode = event.data.data?.error;
                const errorMessage = getAuthErrorMessage(errorCode || '', true);
                reject(new Error(errorMessage));
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
