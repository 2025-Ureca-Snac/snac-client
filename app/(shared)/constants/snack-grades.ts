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
    range: '스낵 점수 0 ~ 199',
    min: 0,
    max: 199,
  },
  {
    icon: '/beginner.svg',
    name: '초급 스낵이',
    range: '스낵 점수 200 ~ 399',
    min: 200,
    max: 399,
  },
  {
    icon: '/skill.svg',
    name: '숙련 스낵이',
    range: '스낵 점수 400 ~ 599',
    min: 400,
    max: 599,
  },
  {
    icon: '/proficient.svg',
    name: '능숙 스낵이',
    range: '스낵 점수 600 ~ 799',
    min: 600,
    max: 799,
  },
  {
    icon: '/advanced.svg',
    name: '고급 스낵이',
    range: '스낵 점수 800 ~ 1000',
    min: 800,
    max: 1000,
  },
];
