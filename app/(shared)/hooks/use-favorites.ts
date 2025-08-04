import { useState, useCallback, useEffect, useRef } from 'react';
import { api } from '@/app/(shared)/utils/api';
import { ApiResponse } from '@/app/(shared)/types/api';
import { FavoriteItem, FavoriteResponse } from '@/app/(shared)/types/mypage';
import { toast } from 'sonner';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // 중복 호출 방지를 위한 ref
  const isFavoritesLoadedRef = useRef(false);

  /**
   * @author 이승우
   * @description 단골 목록 조회 API 함수
   * @returns 단골 목록 데이터
   */
  const getFavorites = useCallback(async (): Promise<FavoriteResponse> => {
    const response = await api.get<ApiResponse<FavoriteResponse>>('/favorites');
    console.log('단골 목록 조회: ', response.data.data);
    return response.data.data;
  }, []);

  /**
   * @author 이승우
   * @description 단골 삭제 API 함수
   * @param memberId - 삭제할 회원 ID
   */
  const deleteFavorite = useCallback(
    async (memberId: number): Promise<void> => {
      await api.delete(`/favorites/${memberId}`);
      console.log('단골 삭제 완료: ', memberId);
    },
    []
  );

  /**
   * @author 이승우
   * @description 단골 목록 로드 함수
   */
  const loadFavorites = useCallback(async () => {
    try {
      const response = await getFavorites();
      setFavorites(response.contents || []);
    } catch (err) {
      console.error('단골 목록 로드 실패:', err);
      setFavorites([]);
      toast.error('단골 목록을 불러오는데 실패했습니다.');
    }
  }, [getFavorites]);

  /**
   * @author 이승우
   * @description 단골 삭제 핸들러
   * @param memberId - 삭제할 회원 ID
   * @param nickname - 삭제할 회원 닉네임
   */
  const handleDeleteFavorite = useCallback(
    async (memberId: number, nickname: string) => {
      // 사용자 확인을 위한 toast 사용
      toast.error(`${nickname}을(를) 단골에서 삭제하시겠습니까?`, {
        action: {
          label: '삭제',
          onClick: async () => {
            try {
              await deleteFavorite(memberId);
              // 삭제 후 목록 새로고침
              await loadFavorites();
              toast.success(`${nickname}이(가) 단골에서 삭제되었습니다.`);
            } catch (err) {
              console.error('단골 삭제 실패:', err);
              toast.error('단골 삭제에 실패했습니다.');
            }
          },
        },
      });
    },
    [deleteFavorite, loadFavorites]
  );

  // 컴포넌트 마운트 시 단골 목록 가져오기
  useEffect(() => {
    // 이미 로드된 경우 중복 호출 방지
    if (isFavoritesLoadedRef.current) {
      return;
    }

    isFavoritesLoadedRef.current = true;
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    loadFavorites,
    handleDeleteFavorite,
  };
};
