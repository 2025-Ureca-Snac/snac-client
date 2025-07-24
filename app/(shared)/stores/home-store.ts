import { create } from 'zustand';

type Category = 'SKT' | 'KT' | 'LGU+' | null;
export type Carrier = 'SKT' | 'KT' | 'LGU+' | '--';
export type SortBy = 'LATEST' | 'RATING';
type TransactionStatus = 'ALL' | 'SELLING' | 'SOLD_OUT' | null;
type PriceRange =
  | 'ALL'
  | 'P0_999'
  | 'P1000_1499'
  | 'P1500_1999'
  | 'P2000_2499'
  | 'P2500_PLUS';
type CardCategory = 'SELL' | 'BUY' | null;

interface HomeState {
  cardCategory: CardCategory;
  isFilterOpen: boolean;
  isCreateModalOpen: boolean;
  refetchTrigger: number;
  category: Category;
  carrier: Carrier;
  sortBy: SortBy;
  transactionStatus: TransactionStatus;
  priceRanges: PriceRange[];
  showRegularsOnly: boolean;
  actions: {
    setCardCategory: (category: CardCategory) => void;
    toggleFilter: () => void;
    toggleCreateModal: () => void;
    triggerRefetch: () => void;
    setCategory: (category: Category) => void;
    setCarrier: (carrier: Carrier) => void;
    setSortBy: (sortBy: SortBy) => void;
    setTransactionStatus: (status: TransactionStatus) => void;
    togglePriceRange: (price: PriceRange) => void;
    toggleShowRegularsOnly: () => void;
    resetFilters: () => void;
    resetAll: () => void;
  };
}

export const homeInitialState = {
  cardCategory: 'SELL' as CardCategory,
  isFilterOpen: false,
  isCreateModalOpen: false,
  refetchTrigger: 0,
  category: null,
  carrier: '--' as Carrier,
  sortBy: 'LATEST' as SortBy,
  transactionStatus: 'ALL' as TransactionStatus,
  priceRanges: ['ALL'] as PriceRange[],
  showRegularsOnly: false,
};

export const useHomeStore = create<HomeState>((set) => ({
  ...homeInitialState,
  actions: {
    setCardCategory: (category) =>
      set((state) => ({
        cardCategory: category,
        refetchTrigger: state.refetchTrigger + 1,
      })),
    toggleFilter: () => set((state) => ({ isFilterOpen: !state.isFilterOpen })),
    toggleCreateModal: () =>
      set((state) => ({ isCreateModalOpen: !state.isCreateModalOpen })),
    setCategory: (category) => set({ category }),
    setCarrier: (carrier) => set({ carrier }),
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
    triggerRefetch: () =>
      set((state) => ({ refetchTrigger: state.refetchTrigger + 1 })),
    resetFilters: () =>
      set((state) => ({
        ...state,
        category: homeInitialState.category,
        transactionStatus: homeInitialState.transactionStatus,
        priceRanges: homeInitialState.priceRanges,
        showRegularsOnly: homeInitialState.showRegularsOnly,
        carrier: homeInitialState.carrier,
      })),

    resetAll: () => set(() => ({ ...homeInitialState })),
  },
}));
