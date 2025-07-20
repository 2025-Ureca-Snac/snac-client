import { create } from 'zustand';

type Category = 'SKT' | 'KT' | 'LGU+' | null;
export type SortBy =
  | '최신순'
  | '인기순'
  | '오래된순'
  | '가격 높은 순'
  | '가격 낮은 순';
type TransactionStatus = 'All' | '거래 전' | '거래 완료' | null;
type PriceRange = string;

interface HomeState {
  isFilterOpen: boolean;
  isCreateModalOpen: boolean;
  category: Category;
  sortBy: SortBy;
  transactionStatus: TransactionStatus;
  priceRanges: PriceRange[];
  showRegularsOnly: boolean;
  actions: {
    toggleFilter: () => void;
    toggleCreateModal: () => void;
    setCategory: (category: Category) => void;
    setSortBy: (sortBy: SortBy) => void;
    setTransactionStatus: (status: TransactionStatus) => void;
    togglePriceRange: (price: PriceRange) => void;
    toggleShowRegularsOnly: () => void;
    resetFilters: () => void;
  };
}

export const homeInitialState = {
  isFilterOpen: false,
  isCreateModalOpen: false,
  category: null,
  sortBy: '최신순' as SortBy,
  transactionStatus: 'All' as TransactionStatus,
  priceRanges: [],
  showRegularsOnly: false,
};

export const useHomeStore = create<HomeState>((set) => ({
  ...homeInitialState,
  actions: {
    toggleFilter: () => set((state) => ({ isFilterOpen: !state.isFilterOpen })),
    toggleCreateModal: () =>
      set((state) => ({ isCreateModalOpen: !state.isCreateModalOpen })),
    setCategory: (category) => set({ category }),
    setSortBy: (sortBy) => set({ sortBy }),
    setTransactionStatus: (status) => set({ transactionStatus: status }),
    togglePriceRange: (price) =>
      set((state) => ({
        priceRanges: state.priceRanges.includes(price)
          ? state.priceRanges.filter((r) => r !== price)
          : [...state.priceRanges, price],
      })),

    toggleShowRegularsOnly: () =>
      set((state) => ({ showRegularsOnly: !state.showRegularsOnly })),
    resetFilters: () =>
      set((state) => ({
        category: null,
        transactionStatus: null,
        priceRanges: [],
        showRegularsOnly: false,
        sortBy: state.sortBy,
        isFilterOpen: state.isFilterOpen,
      })),
  },
}));
