'use client';

import { useUserStore } from '../stores/user-store';
import { useAuthStore } from '../stores/auth-store';

/**
 * @author 이승우
 * @description 사용자 프로필 컴포넌트
 */
export default function UserProfile() {
  const { profile, updateProfile, updatePreferences } = useUserStore();
  const { logout } = useAuthStore();

  if (!profile) {
    return (
      <div className="p-4 text-center">
        <p>로그인이 필요합니다.</p>
      </div>
    );
  }

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    updatePreferences({ theme });
  };

  const handleNotificationChange = (
    type: 'email' | 'push' | 'sms',
    enabled: boolean
  ) => {
    updatePreferences({
      notifications: {
        ...profile.preferences.notifications,
        [type]: enabled,
      },
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">사용자 프로필</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">이름</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => updateProfile({ name: e.target.value })}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">닉네임</label>
          <input
            type="text"
            value={profile.nickname}
            onChange={(e) => updateProfile({ nickname: e.target.value })}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">테마</label>
          <select
            value={profile.preferences.theme}
            onChange={(e) =>
              handleThemeChange(e.target.value as 'light' | 'dark' | 'auto')
            }
            className="w-full p-2 border rounded-md"
          >
            <option value="light">라이트</option>
            <option value="dark">다크</option>
            <option value="auto">자동</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">알림 설정</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={profile.preferences.notifications.email}
                onChange={(e) =>
                  handleNotificationChange('email', e.target.checked)
                }
                className="mr-2"
              />
              이메일 알림
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={profile.preferences.notifications.push}
                onChange={(e) =>
                  handleNotificationChange('push', e.target.checked)
                }
                className="mr-2"
              />
              푸시 알림
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={profile.preferences.notifications.sms}
                onChange={(e) =>
                  handleNotificationChange('sms', e.target.checked)
                }
                className="mr-2"
              />
              SMS 알림
            </label>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
