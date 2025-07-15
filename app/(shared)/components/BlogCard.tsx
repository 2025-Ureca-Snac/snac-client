import Image from 'next/image';

export interface BlogPost {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  featured: boolean;
  author?: string;
  readTime?: string;
  category?: string;
}

interface BlogCardProps {
  post: BlogPost;
  onClick?: () => void;
  variant?: 'default' | 'compact' | 'detailed';
  showAuthor?: boolean;
  showReadTime?: boolean;
  showCategory?: boolean;
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
export const BlogCard = ({
  post,
  onClick,
  variant = 'default',
  showAuthor = false,
  showReadTime = false,
  showCategory = false,
}: BlogCardProps) => {
  const isCompact = variant === 'compact';
  const isDetailed = variant === 'detailed';

  return (
    <div
      className={`relative rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group ${
        isCompact ? 'h-48' : isDetailed ? 'h-auto' : 'aspect-square'
      }`}
      onClick={onClick}
    >
      {/* 이미지 */}
      <div
        className={`relative ${isCompact ? 'h-32' : isDetailed ? 'h-48' : 'h-full'}`}
      >
        <Image
          src={post.image}
          alt={post.title}
          width={400}
          height={300}
          className="object-cover transition-transform duration-300 group-hover:scale-105 w-full h-full"
          priority
        />

        {/* 카테고리 배지 */}
        {showCategory && post.category && (
          <div className="absolute top-2 left-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {post.category}
            </span>
          </div>
        )}

        {/* 추천 배지 */}
        {post.featured && (
          <div className="absolute top-2 right-2">
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              추천
            </span>
          </div>
        )}
      </div>

      {/* 텍스트 오버레이 (기본/컴팩트 모드) */}
      {!isDetailed && (
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/30 to-transparent p-5">
          <h3 className="text-white text-lg font-semibold mb-2 drop-shadow-md line-clamp-2">
            {post.title}
          </h3>
          <p className="text-white text-sm font-medium drop-shadow-md flex items-center gap-1">
            {post.subtitle}
          </p>
        </div>
      )}

      {/* 상세 정보 (상세 모드) */}
      {isDetailed && (
        <div className="p-4 bg-white">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-lg">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {post.subtitle}
          </p>

          {/* 메타 정보 */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {showAuthor && post.author && <span>{post.author}</span>}
            {showReadTime && post.readTime && (
              <>
                {showAuthor && post.author && <span>•</span>}
                <span>{post.readTime}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
