'use client';

import React from 'react';
import FilterSection, { SellerRegistrationInfo } from './FilterSection';
import BuyerMatchingStatus from './buyer/BuyerMatchingStatus';
import IncomingRequestsPanel from './IncomingRequestsPanel';
import ResultSection from './ResultSection';
import { Filters } from '../types';
import { User, TradeRequest } from '../types/match';

interface MatchContentProps {
  // 상태들
  userRole: 'buyer' | 'seller' | null;
  hasStartedSearch: boolean;
  matchingStatus: string;
  pendingFilters: Filters;
  appliedFilters: Filters;
  filteredUsers: User[];
  incomingRequests: TradeRequest[];
  sellerInfo: SellerRegistrationInfo;

  // 핸들러들
  onFilterChange: (filters: Filters) => void;
  onApply: () => void;
  onReset: () => void;
  onSellerInfoChange: (info: SellerRegistrationInfo) => void;
  onToggleSellerStatus: () => void;
  onGoBackToSearch: () => void;
  onUserClick: ((user: User) => void) | undefined;
  onRequestResponse: (requestId: number, accept: boolean) => void;
}

export default function MatchContent({
  userRole,
  hasStartedSearch,
  matchingStatus,
  pendingFilters,
  appliedFilters,
  filteredUsers,
  incomingRequests,
  sellerInfo,
  onFilterChange,
  onApply,
  onReset,
  onSellerInfoChange,
  onToggleSellerStatus,
  onGoBackToSearch,
  onUserClick,
  onRequestResponse,
}: MatchContentProps) {
  return (
    <main className="flex-1">
      {/* 필터 섹션 (검색을 시작하지 않았을 때만 표시) */}
      {(userRole === 'seller' ||
        (userRole === 'buyer' && !hasStartedSearch) ||
        appliedFilters.transactionType.length === 0) && (
        <FilterSection
          onFilterChange={onFilterChange}
          onApply={onApply}
          onReset={onReset}
          currentFilters={pendingFilters}
          onSellerInfoChange={onSellerInfoChange}
          onToggleSellerStatus={onToggleSellerStatus}
          sellerInfo={sellerInfo}
        />
      )}

      {/* 구매자 매칭 상태 (검색을 시작한 후에만 표시) */}
      {userRole === 'buyer' &&
        appliedFilters.transactionType.includes('구매자') &&
        hasStartedSearch && (
          <BuyerMatchingStatus
            appliedFilters={appliedFilters}
            isSearching={matchingStatus === 'searching'}
            foundUsersCount={filteredUsers.length}
            onGoBack={onGoBackToSearch}
          />
        )}

      {/* 판매자 모드: 들어온 거래 요청 */}
      {userRole === 'seller' && (
        <IncomingRequestsPanel
          requests={incomingRequests}
          sellerInfo={sellerInfo}
          onRequestResponse={onRequestResponse}
        />
      )}

      {/* 결과 섹션 */}
      <ResultSection users={filteredUsers} onUserClick={onUserClick} />
    </main>
  );
}
