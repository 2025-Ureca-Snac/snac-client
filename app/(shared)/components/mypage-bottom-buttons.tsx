'use client';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/(shared)/stores/auth-store';
import { toast } from 'sonner';

/**
 * @author 이승우
 * @description 마이페이지 하단 버튼들 컴포넌트
 */
export default function MyPageBottomButtons() {
  const { logout } = useAuthStore();
  const router = useRouter();

  /**
   * @author 이승우
   * @description 로그아웃 핸들러
   */
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toast.success('로그아웃되었습니다.');
      router.push('/');
    } catch {
      toast.error('로그아웃 중 오류가 발생했습니다.');
    }
  }, [logout, router]);

  return (
    <div className="flex flex-col gap-3 mt-6">
      <button
        onClick={handleLogout}
        className="w-full py-4 rounded-lg bg-yellow-600 text-white font-bold text-lg hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        aria-label="로그아웃"
      >
        로그아웃
      </button>
      {/* 탈퇴하기 버튼 (임시 주석처리)
      <button
        onClick={() => toast.info('탈퇴 기능은 아직 구현되지 않았습니다.')}
        className="w-full py-4 rounded-lg bg-gray-100 text-gray-700 font-bold text-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        aria-label="회원 탈퇴"
      >
        탈퇴하기
      </button>
      */}
    </div>
  );
}
