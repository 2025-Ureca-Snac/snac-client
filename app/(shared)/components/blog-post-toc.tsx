// 내부 라이브러리/유틸리티 임포트 (절대 경로)
import { BlogPostTOCProps } from '../types/blog-post';

export default function BlogPostTOC({ tableOfContents }: BlogPostTOCProps) {
  if (tableOfContents.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white  mb-4">
        목차
      </h3>
      <nav className="space-y-2">
        {tableOfContents.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block text-blue-600 hover:text-blue-800 transition-colors ${
              item.level === 1
                ? 'font-semibold'
                : item.level === 2
                  ? 'ml-4'
                  : item.level === 3
                    ? 'ml-8'
                    : item.level === 4
                      ? 'ml-12'
                      : item.level === 5
                        ? 'ml-16'
                        : 'ml-20'
            }`}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
