interface BlogHeroProps {
  title?: string;
  subtitle?: string;
}

export const BlogHero = ({
  title = 'snac 읽을거리',
  subtitle = '간식처럼 가볍게 읽어보세요',
}: BlogHeroProps) => {
  return (
    <div className="relative bg-gradient-to-r from-gray-100 to-gray-200 py-20">
      <div className="absolute inset-0 bg-[url('/blog-bg-pattern.svg')] bg-repeat opacity-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <nav className="flex justify-center space-x-2 text-sm text-gray-500 mb-8">
          <span>Home</span>
          <span>→</span>
          <span className="text-gray-700">Blog</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          {title}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
      </div>
    </div>
  );
};
