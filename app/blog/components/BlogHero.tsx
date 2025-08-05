interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BlogHeroProps {
  title?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}

/**
 * 블로그 페이지 히어로 섹션 컴포넌트
 *
 * @param props - BlogHero 컴포넌트 props
 * @returns 히어로 섹션 JSX 엘리먼트
 */
export const BlogHero = ({
  title = 'snac 읽을거리',
  subtitle = '간식처럼 가볍게 읽어보세요',
  breadcrumbs = [{ name: 'Home', href: '/' }, { name: 'Blog' }],
}: BlogHeroProps) => {
  return (
    <div className="relative bg-gradient-to-r from-gray-100 to-gray-200 py-20">
      <div className="absolute inset-0 bg-[url('/blog-bg-pattern.png')] bg-repeat opacity-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <nav className="flex justify-center space-x-2 text-sm text-gray-500 mb-8">
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              {index > 0 && <span>→</span>}
              {item.href ? (
                <a
                  href={item.href}
                  className="text-gray-500 hover:text-gray-700 dark:text-white transition-colors"
                >
                  {item.name}
                </a>
              ) : (
                <span className="text-gray-700 dark:text-white">
                  {item.name}
                </span>
              )}
            </div>
          ))}
        </nav>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 dark:text-white">
          {title}
        </h1>
        <p className="text-xl text-gray-600 dark:text-white max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    </div>
  );
};
