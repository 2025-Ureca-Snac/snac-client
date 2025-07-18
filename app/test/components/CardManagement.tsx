'use client';

import React, { useState } from 'react';
import { api, handleApiError, ApiResponse } from '../../(shared)/utils/api';
import { testTokenManager } from '../utils/tokenManager';
import {
  CardData,
  ScrollParams,
  CommonProps,
  CardCategory,
  Carrier,
  PriceRange,
  SellStatus,
} from '../types';

interface CardManagementProps extends CommonProps {
  activeTab: 'create' | 'list' | 'update' | 'delete';
}

export default function CardManagement({
  activeTab,
  loading,
  setResponse,
}: CardManagementProps) {
  // 카드 등록 데이터 (추가 필드 포함)
  const [createData, setCreateData] = useState<CardData>({
    cardCategory: 'SELL',
    carrier: 'SKT',
    dataAmount: 1,
    price: 1000,
  });

  // 카드 조회 파라미터
  const [listParams, setListParams] = useState<ScrollParams>({
    cardCategory: 'SELL',
    priceRanges: ['ALL'],
    sellStatusFilter: 'ALL',
    carrier: 'SKT',
    highRatingFirst: true,
    size: 54,
  });

  // 카드 수정 데이터
  const [updateData, setUpdateData] = useState<CardData & { cardId: number }>({
    cardId: 0,
    cardCategory: 'SELL',
    carrier: 'SKT',
    dataAmount: 0,
    price: 0,
  });

  // 카드 삭제 ID
  const [deleteId, setDeleteId] = useState<number>(0);

  // 카드 등록 API 호출
  const createCard = async () => {
    // 토큰 확인
    const token = testTokenManager.getToken();
    if (!token) {
      setResponse('❌ 로그인이 필요합니다. 먼저 로그인해 주세요.');
      return;
    }

    try {
      // 요청 전에 데이터 확인
      console.log('전송할 데이터:', createData);
      console.log('API URL:', api.defaults.baseURL);
      console.log('토큰:', token?.slice(0, 20) + '...');

      const result = await api.post<ApiResponse>('/cards', createData);
      console.log('응답 결과:', result);
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      console.error('에러 상세:', error);
      setResponse(`Error: ${handleApiError(error)}`);
    }
  };

  // 카드 목록 조회 API 호출
  const getCardList = async () => {
    // 토큰 확인
    const token = testTokenManager.getToken();
    if (!token) {
      setResponse('❌ 로그인이 필요합니다. 먼저 로그인해 주세요.');
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append('cardCategory', listParams.cardCategory);
      params.append('sellStatusFilter', listParams.sellStatusFilter);
      params.append(
        'highRatingFirst',
        listParams.highRatingFirst?.toString() || 'true'
      );
      params.append('size', listParams.size?.toString() || '54');

      listParams.priceRanges.forEach((range) => {
        params.append('priceRanges', range);
      });

      if (listParams.carrier) {
        params.append('carrier', listParams.carrier);
      }

      if (listParams.lastCardId) {
        params.append('lastCardId', listParams.lastCardId.toString());
      }

      if (listParams.lastUpdatedAt) {
        params.append('lastUpdatedAt', listParams.lastUpdatedAt);
      }

      const result = await api.get<ApiResponse>(
        `/cards/scroll?${params.toString()}`
      );
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setResponse(`Error: ${handleApiError(error)}`);
    }
  };

  // 카드 수정 API 호출
  const updateCard = async () => {
    // 토큰 확인
    const token = testTokenManager.getToken();
    if (!token) {
      setResponse('❌ 로그인이 필요합니다. 먼저 로그인해 주세요.');
      return;
    }

    try {
      const { cardId, ...updatePayload } = updateData;
      const result = await api.put<ApiResponse>(
        `/cards/${cardId}`,
        updatePayload
      );
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setResponse(`Error: ${handleApiError(error)}`);
    }
  };

  // 카드 삭제 API 호출
  const deleteCard = async () => {
    // 토큰 확인
    const token = testTokenManager.getToken();
    if (!token) {
      setResponse('❌ 로그인이 필요합니다. 먼저 로그인해 주세요.');
      return;
    }

    try {
      const result = await api.delete<ApiResponse>(`/cards/${deleteId}`);
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setResponse(`Error: ${handleApiError(error)}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* 카드 등록 */}
      {activeTab === 'create' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">판매글/구매글 등록</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카드 카테고리
              </label>
              <select
                value={createData.cardCategory}
                onChange={(e) =>
                  setCreateData({
                    ...createData,
                    cardCategory: e.target.value as CardCategory,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="SELL">판매글 (SELL)</option>
                <option value="BUY">구매글 (BUY)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                통신사
              </label>
              <select
                value={createData.carrier}
                onChange={(e) =>
                  setCreateData({
                    ...createData,
                    carrier: e.target.value as Carrier,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="SKT">SKT</option>
                <option value="KT">KT</option>
                <option value="LG">LG</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                데이터 용량 (GB)
              </label>
              <input
                type="number"
                value={createData.dataAmount}
                onChange={(e) =>
                  setCreateData({
                    ...createData,
                    dataAmount: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                가격 (원)
              </label>
              <input
                type="number"
                value={createData.price}
                onChange={(e) =>
                  setCreateData({
                    ...createData,
                    price: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>
          </div>
          <button
            onClick={createCard}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '등록 중...' : '판매글/구매글 등록'}
          </button>
        </div>
      )}

      {/* 카드 목록 조회 */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">판매글/구매글 목록 조회</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카드 카테고리 *
              </label>
              <select
                value={listParams.cardCategory}
                onChange={(e) =>
                  setListParams({
                    ...listParams,
                    cardCategory: e.target.value as CardCategory,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="SELL">판매글 (SELL)</option>
                <option value="BUY">구매글 (BUY)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                통신사
              </label>
              <select
                value={listParams.carrier || ''}
                onChange={(e) =>
                  setListParams({
                    ...listParams,
                    carrier: (e.target.value as Carrier) || undefined,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">전체</option>
                <option value="SKT">SKT</option>
                <option value="KT">KT</option>
                <option value="LG">LG</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                판매 상태 *
              </label>
              <select
                value={listParams.sellStatusFilter}
                onChange={(e) =>
                  setListParams({
                    ...listParams,
                    sellStatusFilter: e.target.value as SellStatus,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">전체</option>
                <option value="SELLING">판매중</option>
                <option value="SOLD_OUT">품절</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                조회 개수
              </label>
              <input
                type="number"
                value={listParams.size || 54}
                onChange={(e) =>
                  setListParams({
                    ...listParams,
                    size: parseInt(e.target.value) || 54,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="100"
              />
            </div>
          </div>

          {/* 가격 범위 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              가격 범위 * (복수 선택 가능)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'ALL', label: '전체' },
                { value: 'P0_999', label: '0원 ~ 999원' },
                { value: 'P1000_1499', label: '1,000원 ~ 1,499원' },
                { value: 'P1500_1999', label: '1,500원 ~ 1,999원' },
                { value: 'P2000_2499', label: '2,000원 ~ 2,499원' },
                { value: 'P2500_PLUS', label: '2,500원 이상' },
              ].map((range) => (
                <label
                  key={range.value}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={listParams.priceRanges.includes(
                      range.value as PriceRange
                    )}
                    onChange={(e) => {
                      const newRanges = e.target.checked
                        ? [...listParams.priceRanges, range.value as PriceRange]
                        : listParams.priceRanges.filter(
                            (r) => r !== range.value
                          );
                      setListParams({ ...listParams, priceRanges: newRanges });
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{range.label}</span>
                </label>
              ))}
            </div>
            {listParams.priceRanges.length === 0 && (
              <p className="text-red-500 text-sm mt-1">
                최소 하나 이상의 가격 범위를 선택해주세요.
              </p>
            )}
          </div>

          {/* 페이징 파라미터 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                마지막 카드 ID (페이징용)
              </label>
              <input
                type="number"
                value={listParams.lastCardId || ''}
                onChange={(e) =>
                  setListParams({
                    ...listParams,
                    lastCardId: parseInt(e.target.value) || undefined,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="추가 조회 시 사용"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                마지막 업데이트 시간 (페이징용)
              </label>
              <input
                type="datetime-local"
                value={listParams.lastUpdatedAt || ''}
                onChange={(e) =>
                  setListParams({
                    ...listParams,
                    lastUpdatedAt: e.target.value || undefined,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={listParams.highRatingFirst || false}
                onChange={(e) =>
                  setListParams({
                    ...listParams,
                    highRatingFirst: e.target.checked,
                  })
                }
                className="mr-2"
              />
              높은 평점 우선 조회
            </label>
          </div>
          <button
            onClick={getCardList}
            disabled={loading || listParams.priceRanges.length === 0}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '조회 중...' : '목록 조회'}
          </button>
        </div>
      )}

      {/* 카드 수정 */}
      {activeTab === 'update' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">판매글/구매글 수정</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카드 ID
              </label>
              <input
                type="number"
                value={updateData.cardId}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    cardId: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                placeholder="수정할 카드 ID 입력"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카드 카테고리
              </label>
              <select
                value={updateData.cardCategory}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    cardCategory: e.target.value as CardCategory,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="SELL">판매글 (SELL)</option>
                <option value="BUY">구매글 (BUY)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                통신사
              </label>
              <select
                value={updateData.carrier}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    carrier: e.target.value as Carrier,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="SKT">SKT</option>
                <option value="KT">KT</option>
                <option value="LG">LG</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                데이터 용량 (GB)
              </label>
              <input
                type="number"
                value={updateData.dataAmount}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    dataAmount: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                가격 (원)
              </label>
              <input
                type="number"
                value={updateData.price}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    price: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>
          </div>
          <button
            onClick={updateCard}
            disabled={loading || !updateData.cardId}
            className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '수정 중...' : '판매글/구매글 수정'}
          </button>
        </div>
      )}

      {/* 카드 삭제 */}
      {activeTab === 'delete' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">판매글/구매글 삭제</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              카드 ID
            </label>
            <input
              type="number"
              value={deleteId}
              onChange={(e) => setDeleteId(parseInt(e.target.value) || 0)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
              placeholder="삭제할 카드 ID 입력"
            />
          </div>
          <button
            onClick={deleteCard}
            disabled={loading || !deleteId}
            className="w-full bg-red text-white py-2 px-4 rounded-md hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '삭제 중...' : '판매글/구매글 삭제'}
          </button>
        </div>
      )}
    </div>
  );
}
