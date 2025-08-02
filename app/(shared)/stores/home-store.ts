import { create } from 'zustand';

type Category = 'SKT' | 'KT' | 'LGU+' | 'ALL' | null;
export type Carrier = 'SKT' | 'KT' | 'LGU+' | '--';
export type SortBy = 'LATEST' | 'RATING';
type TransactionStatus = 'ALL' | 'SELLING' | 'TRADING' | 'SOLD_OUT' | null;
type PriceRange = 'ALL' | 'P0_1000' | 'P0_1500' | 'P0_2000' | 'P0_2500';
type CardCategory = 'SELL' | 'BUY';

interface HomeState {
  cardCategory: CardCategory;
  isFilterOpen: boolean;
  isCreateModalOpen: boolean;
  isEditMode: boolean;
  editingCardId: string | null;
  editingCardData: {
    cardCategory: CardCategory;
    carrier: Carrier;
    dataAmount: number;
    price: number;
  } | null;
  refetchTrigger: number;
  category: Category;
  carrier: Carrier;
  sortBy: SortBy;
  transactionStatus: TransactionStatus;
  priceRange: PriceRange;
  showRegularsOnly: boolean;
  actions: {
    setCardCategory: (category: CardCategory) => void;
    toggleFilter: () => void;
    toggleCreateModal: () => void;
    openEditModal: (
      cardId: string,
      cardData: {
        cardCategory: CardCategory;
        carrier: Carrier;
        dataAmount: number;
        price: number;
      }
    ) => void;
    closeEditModal: () => void;
    triggerRefetch: () => void;
    setCategory: (category: Category) => void;
    setCarrier: (carrier: Carrier) => void;
    setSortBy: (sortBy: SortBy) => void;
    setTransactionStatus: (status: TransactionStatus) => void;
    setPriceRange: (price: PriceRange) => void;
    toggleShowRegularsOnly: () => void;
    resetFilters: () => void;
    resetAll: () => void;
  };
}

export const homeInitialState = {
  cardCategory: 'SELL' as CardCategory,
  isFilterOpen: false,
  isCreateModalOpen: false,
  isEditMode: false,
  editingCardId: null,
  editingCardData: null,
  refetchTrigger: 0,
  category: 'ALL' as Category,
  carrier: '--' as Carrier,
  sortBy: 'LATEST' as SortBy,
  transactionStatus: 'ALL' as TransactionStatus,
  priceRange: 'ALL' as PriceRange,
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
    openEditModal: (cardId, cardData) =>
      set(() => ({
        isEditMode: true,
        editingCardId: cardId,
        editingCardData: cardData,
      })),
    closeEditModal: () =>
      set(() => ({
        isEditMode: false,
        editingCardId: null,
        editingCardData: null,
      })),
    setCategory: (category) => set({ category }),
    setCarrier: (carrier) => set({ carrier }),
    setSortBy: (sortBy) => set({ sortBy }),
    setTransactionStatus: (status) => set({ transactionStatus: status }),
    setPriceRange: (price) => set({ priceRange: price }),
    toggleShowRegularsOnly: () =>
      set((state) => ({ showRegularsOnly: !state.showRegularsOnly })),
    triggerRefetch: () =>
      set((state) => ({ refetchTrigger: state.refetchTrigger + 1 })),
    resetFilters: () =>
      set((state) => ({
        ...state,
        category: 'ALL' as Category,
        transactionStatus: homeInitialState.transactionStatus,
        priceRange: homeInitialState.priceRange,
        showRegularsOnly: homeInitialState.showRegularsOnly,
        carrier: homeInitialState.carrier,
      })),

    resetAll: () => set(() => ({ ...homeInitialState })),
  },
}));
