'use client';

import { useHomeStore } from '@/app/(shared)/stores/home-store';
import {
  SortDropdown,
  SortOption,
} from '@/app/(shared)/components/SortDropdown';

type SortBy =
  | '최신순'
  | '인기순'
  | '오래된순'
  | '가격 높은 순'
  | '가격 낮은 순';

const sortOptions: SortOption[] = [
  { value: '최신순', label: '최신순' },
  { value: '인기순', label: '인기순' },
  { value: '오래된순', label: '오래된순' },
  { value: '가격 높은 순', label: '가격 높은 순' },
  { value: '가격 낮은 순', label: '가격 낮은 순' },
];

export const Sort = () => {
  const { sortBy, actions } = useHomeStore();

  return (
    <SortDropdown
      options={sortOptions}
      defaultValue={sortBy || '최신순'}
      onChange={(value) => actions.setSortBy(value as SortBy)}
    />
  );
};
