import {
  SortDropdown,
  SortOption,
} from '@/app/(shared)/components/SortDropdown';

interface BlogTabNavigationProps {
  activeTab: 'all' | 'featured';
  onTabChange: (tab: 'all' | 'featured') => void;
  onSortChange?: (sortBy: string) => void;
}

const blogSortOptions: SortOption[] = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
  { value: 'views', label: '조회순' },
];

/**
 * 블로그 탭 네비게이션 및 정렬 컴포넌트
 *
 * @param props - BlogTabNavigation 컴포넌트 props
 * @returns 탭 네비게이션 JSX 엘리먼트
 */
export const BlogTabNavigation = ({
  activeTab,
  onTabChange,
  onSortChange,
}: BlogTabNavigationProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {/* 탭 네비게이션 */}
      <div className="flex space-x-8">
        <button
          onClick={() => onTabChange('all')}
          className={`text-lg font-medium pb-2 border-b-2 transition-colors ${
            activeTab === 'all'
              ? 'text-gray-800 border-gray-800'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          모든글
        </button>
        <button
          onClick={() => onTabChange('featured')}
          className={`text-lg font-medium pb-2 border-b-2 transition-colors ${
            activeTab === 'featured'
              ? 'text-gray-800 border-gray-800'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          Featured
        </button>
      </div>

      {/* 정렬 옵션 */}
      <SortDropdown
        options={blogSortOptions}
        defaultValue="latest"
        onChange={onSortChange}
      />
    </div>
  );
};
