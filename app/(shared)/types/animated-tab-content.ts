/**
 * @author 이승우
 * @description 애니메이션 탭 콘텐츠 컴포넌트 속성
 * @interface AnimatedTabContentProps
 * @property {React.ReactNode} children 자식 컴포넌트
 * @property {string} key 탭 식별자
 */
export interface AnimatedTabContentProps {
  children: React.ReactNode;
  key: string;
}
