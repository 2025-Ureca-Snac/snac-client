import Image from 'next/image';

export interface BlogPost {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  featured: boolean;
}

interface BlogCardProps {
  post: BlogPost;
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
      className="relative rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group aspect-square"
      onClick={onClick}
    >
      {/* 이미지 */}
      <Image
        src={post.image}
        alt={post.title}
        fill
        className="object-cover  transition-transform duration-300 group-hover:scale-105"
        priority
      />
      {/* 텍스트 오버레이 */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/30 to-transparent p-5">
        <h3 className="text-white text-lg font-semibold mb-2 drop-shadow-md line-clamp-2">
          {post.title}
        </h3>
        <p className="text-white text-sm font-medium drop-shadow-md flex items-center gap-1">
          {post.subtitle}
        </p>
      </div>
    </div>
  );
};
