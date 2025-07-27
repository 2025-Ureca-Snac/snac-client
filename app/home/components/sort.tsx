'use client';

import { useHomeStore } from '@/app/(shared)/stores/home-store';
import {
  SortDropdown,
  SortOption,
} from '@/app/(shared)/components/SortDropdown';

type SortBy = 'LATEST' | 'RATING';

const sortOptions: SortOption[] = [
  { value: 'LATEST', label: '최신순' },
  { value: 'RATING', label: '인기순' },
];

export const Sort = () => {
  const { sortBy, actions } = useHomeStore();

  return (
    <SortDropdown
      options={sortOptions}
      defaultValue={sortBy || 'LATEST'}
      onChange={(value) => actions.setSortBy(value as SortBy)}
    />
  );
};
