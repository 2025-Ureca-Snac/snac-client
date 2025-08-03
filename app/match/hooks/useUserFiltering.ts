'use client';

import { useMemo } from 'react';
import { User, Filters } from '../types';

export function useUserFiltering(
  appliedFilters: Filters,
  activeSellers: User[],
  allUsers: User[]
) {
  const filteredUsers = useMemo(() => {
    if (appliedFilters.transactionType.includes('__RESET__')) {
      return [];
    }

    const sourceUsers = activeSellers.length > 0 ? activeSellers : allUsers;

    return sourceUsers.filter((user) => {
      // 거래 방식 필터
      if (appliedFilters.transactionType.length > 0) {
        const userType = user.type === 'buyer' ? '구매자' : '판매자';
        if (!appliedFilters.transactionType.includes(userType)) {
          return false;
        }
      }

      // 통신사 필터
      if (appliedFilters.carrier.length > 0) {
        if (!appliedFilters.carrier.includes(user.carrier)) {
          return false;
        }
      }

      // 데이터량 필터
      if (appliedFilters.dataAmount.length > 0) {
        if (!matchesDataAmountFilter(user.data, appliedFilters.dataAmount)) {
          return false;
        }
      }

      // 가격 필터
      if (appliedFilters.price.length > 0) {
        if (!matchesPriceFilter(user.price, appliedFilters.price)) {
          return false;
        }
      }

      return true;
    });
  }, [appliedFilters, activeSellers, allUsers]);

  return filteredUsers;
}

// 데이터량 필터링 로직 분리
function matchesDataAmountFilter(
  userData: number,
  dataFilters: string[]
): boolean {
  return dataFilters.some((filter) => {
    if (filter === '1GB') return userData >= 1;
    if (filter === '2GB') return userData >= 2;
    return false;
  });
}

// 가격 필터링 로직 분리
function matchesPriceFilter(
  userPrice: number,
  priceFilters: string[]
): boolean {
  return priceFilters.some((filter) => {
    if (filter === '0 - 999') return userPrice >= 0 && userPrice <= 999;
    if (filter === '1,000 - 1,499')
      return userPrice >= 1000 && userPrice <= 1499;
    if (filter === '1,500 - 1,999')
      return userPrice >= 1500 && userPrice <= 1999;
    if (filter === '2,000 - 2,499')
      return userPrice >= 2000 && userPrice <= 2499;
    if (filter === '2,500 이상') return userPrice >= 2500;
    return false;
  });
}
