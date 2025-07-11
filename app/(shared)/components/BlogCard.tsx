import Image from 'next/image';

/**
 * 블로그 포스트 데이터 타입
 */
export interface BlogPost {
  /** 포스트 고유 식별자 */
  id: number;
  /** 포스트 제목 */
  title: string;
  /** 포스트 부제목 또는 설명 */
  subtitle: string;
  /** 포스트 대표 이미지 경로 */
  image: string;
  /** 추천 포스트 여부 */
  featured: boolean;
}

/**
 * BlogCard 컴포넌트 Props
 */
interface BlogCardProps {
  /** 렌더링할 블로그 포스트 데이터 */
  post: BlogPost;
  /** 카드 클릭 시 실행할 콜백 함수 */
  onClick?: () => void;
}

/**
 * 블로그 포스트를 카드 형태로 렌더링하는 컴포넌트
 *
 * @param props - BlogCard 컴포넌트 props
 * @returns 블로그 카드 JSX 엘리먼트
 *
 * @example
 * ```tsx
 * <BlogCard
 *   post={{
 *     id: 1,
 *     title: "포스트 제목",
 *     subtitle: "포스트 설명",
 *     image: "/image.jpg",
 *     featured: true
 *   }}
 *   onClick={() => console.log('카드 클릭됨')}
 * />
 * ```
 */
export const BlogCard = ({ post, onClick }: BlogCardProps) => {
  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48 bg-gray-100">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-gray-600">{post.subtitle}</p>
      </div>
    </div>
  );
};
