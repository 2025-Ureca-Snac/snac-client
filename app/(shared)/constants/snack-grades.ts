/**
 * @author 이승우
 * @description 스낵 등급 인터페이스(아이콘, 이름, 범위, 최소값, 최대값)
 */
export interface SnackGrade {
  icon: string;
  name: string;
  range: string;
  min: number;
  max: number;
}

/**
 * @author 이승우
 * @description 스낵 등급 목록 (새싹 ~ 고급 스낵이)
 */
export const SNACK_GRADES: SnackGrade[] = [
  {
    icon: '/sprout.svg',
    name: '새싹 스낵이',
    range: '스낵 점수 0 ~ 49',
    min: 0,
    max: 49,
  },
  {
    icon: '/beginner.svg',
    name: '초급 스낵이',
    range: '스낵 점수 50 ~ 99',
    min: 50,
    max: 99,
  },
  {
    icon: '/skill.svg',
    name: '숙련 스낵이',
    range: '스낵 점수 100 ~ 299',
    min: 100,
    max: 299,
  },
  {
    icon: '/proficient.svg',
    name: '능숙 스낵이',
    range: '스낵 점수 300 ~ 499',
    min: 300,
    max: 499,
  },
  {
    icon: '/advanced.svg',
    name: '고급 스낵이',
    range: '스낵 점수 500 ~ 799',
    min: 500,
    max: 799,
  },
];
