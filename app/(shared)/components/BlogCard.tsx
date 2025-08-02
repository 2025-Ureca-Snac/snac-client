import Image from 'next/image';
import { Blog } from '@/app/(shared)/stores/use-blog-store';

interface BlogCardProps {
  post: Blog;
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
 * post={{
 * id: 1,
 * title: "포스트 제목",
 * nickname: "작성자 닉네임", // subtitle -> nickname
 * imageUrl: "/image.jpg", // image -> imageUrl
 * }}
 * onClick={() => console.log('카드 클릭됨')}
 * />
 * ```
 */
export const BlogCard = ({
  post,
  onClick,
  variant = 'default',
  // showAuthor = false,
  // showReadTime = false,
  // showCategory = false,
}: BlogCardProps) => {
  const isCompact = variant === 'compact';
  const isDetailed = variant === 'detailed';

  const imageUrl =
    post.imageUrl || 'https://placehold.co/400x300/E2E8F0/4A5568?text=No+Image';
  const author = post.nickname || '';

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
          src={imageUrl}
          alt={post.title}
          width={400}
          height={300}
          className="object-cover transition-transform duration-300 group-hover:scale-105 w-full h-full"
          priority
          // onError={(e) => {
          //   e.currentTarget.src =
          //     'https://placehold.co/400x300/E2E8F0/4A5568?text=Error';
          // }}
        />

        {/* 카테고리 배지 (주석 유지) - API에 category가 없으므로 렌더링되지 않음 */}
        {/* {showCategory && (post as any).category && (
          <div className="absolute top-2 left-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {(post as any).category}
            </span>
          </div>
        )} */}

        {/* 추천 배지 (주석 유지) - API에 featured가 없으므로 렌더링되지 않음 */}
        {/* {(post as any).featured && (
          <div className="absolute top-2 right-2">
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              추천
            </span>
          </div>
        )} */}
      </div>

      {!isDetailed && (
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/30 to-transparent p-5">
          <h3 className="text-white text-regular-lg font-semibold mb-2 drop-shadow-md line-clamp-2">
            {post.title}
          </h3>
          <p className="text-white text-regular-sm font-medium drop-shadow-md flex items-center gap-1">
            {author}
          </p>
        </div>
      )}

      {/* 상세 정보 (상세 모드) */}
      {isDetailed && (
        <div className="p-4 bg-white dark:bg-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 text-regular-lg">
            {post.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {author}
          </p>
        </div>
      )}
    </div>
  );
};
