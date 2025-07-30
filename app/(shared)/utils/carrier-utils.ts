/**
 * @author 김현훈
 * @description 통신사 관련 유틸리티 함수들
 */

/**
 * 통신사별 이미지 URL을 반환합니다.
 * @param carrier 통신사명
 * @returns 이미지 URL
 */
export const getCarrierImageUrl = (carrier: string): string => {
  switch (carrier) {
    case 'SKT':
      return '/SKT.png';
    case 'KT':
      return '/KT.png';
    case 'LGU+':
    case 'LG':
      return '/LG.png';
    default:
      return '/SKT.png';
  }
};

/**
 * 통신사명을 포맷팅합니다.
 * @param carrier 통신사명
 * @returns 포맷팅된 통신사명
 */
export const formatCarrierName = (carrier: string): string =>
  carrier === 'LG' ? 'LGU+' : carrier;
