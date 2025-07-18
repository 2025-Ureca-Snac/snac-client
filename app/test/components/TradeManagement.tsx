'use client';

import React, { useState } from 'react';
import { api, handleApiError, ApiResponse } from '../../(shared)/utils/api';
import { TradeCreateData, TradeScrollParams, CommonProps } from '../types';

export default function TradeManagement({ loading, setResponse }: CommonProps) {
  const [activeTab, setActiveTab] = useState<
    | 'create-sell'
    | 'create-buy'
    | 'data-send'
    | 'confirm'
    | 'cancel'
    | 'list'
    | 'count'
  >('create-sell');

  const [tradeCreateData, setTradeCreateData] = useState<TradeCreateData>({
    cardId: 0,
    money: 0,
    point: 0,
  });

  const [tradeScrollParams, setTradeScrollParams] = useState<TradeScrollParams>(
    {
      side: 'SELL',
      size: 10,
    }
  );

  const [tradeActionId, setTradeActionId] = useState<number>(0);
  const [tradeDataFile, setTradeDataFile] = useState<File | null>(null);

  // 판매 거래 생성 API 호출
  const createSellTrade = async () => {
    try {
      const result = await api.post<ApiResponse>(
        '/trades/sell',
        tradeCreateData
      );
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setResponse(`Error: ${handleApiError(error)}`);
    }
  };

  // 구매 거래 생성 API 호출
  const createBuyTrade = async () => {
    try {
      const result = await api.post<ApiResponse>(
        '/trades/buy',
        tradeCreateData
      );
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setResponse(`Error: ${handleApiError(error)}`);
    }
  };

  // 거래 데이터 전송 API 호출
  const sendTradeData = async () => {
    if (!tradeDataFile) return;

    try {
      const formData = new FormData();
      formData.append('file', tradeDataFile);

      const result = await api.patch<ApiResponse>(
        `/trades/${tradeActionId}/send-data`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setResponse(`Error: ${handleApiError(error)}`);
    }
  };

  // 거래 확정 API 호출
  const confirmTrade = async () => {
    try {
      const result = await api.patch<ApiResponse>(
        `/trades/${tradeActionId}/confirm`
      );
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setResponse(`Error: ${handleApiError(error)}`);
    }
  };

  // 거래 취소 API 호출
  const cancelTrade = async () => {
    try {
      const result = await api.patch<ApiResponse>(
        `/trades/${tradeActionId}/cancel`
      );
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setResponse(`Error: ${handleApiError(error)}`);
    }
  };

  // 거래 내역 조회 API 호출
  const getTradeHistory = async () => {
    try {
      const params = new URLSearchParams();
      params.append('side', tradeScrollParams.side);
      params.append('size', tradeScrollParams.size?.toString() || '10');

      if (tradeScrollParams.cursorId) {
        params.append('cursorId', tradeScrollParams.cursorId.toString());
      }

      const result = await api.get<ApiResponse>(
        `/trades/scroll?${params.toString()}`
      );
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setResponse(`Error: ${handleApiError(error)}`);
    }
  };

  // 진행 중인 판매 거래 수 조회 API 호출
  const getSellTradeCount = async () => {
    try {
      const result = await api.get<ApiResponse>('/trades/count/sell');
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setResponse(`Error: ${handleApiError(error)}`);
    }
  };

  // 진행 중인 구매 거래 수 조회 API 호출
  const getBuyTradeCount = async () => {
    try {
      const result = await api.get<ApiResponse>('/trades/count/buy');
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setResponse(`Error: ${handleApiError(error)}`);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">거래 관리</h2>

      {/* 거래 관리 서브 탭 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 flex-wrap">
          {[
            { key: 'create-sell', label: '판매 거래 생성' },
            { key: 'create-buy', label: '구매 거래 생성' },
            { key: 'data-send', label: '데이터 전송' },
            { key: 'confirm', label: '거래 확정' },
            { key: 'cancel', label: '거래 취소' },
            { key: 'list', label: '거래 내역' },
            { key: 'count', label: '거래 수 조회' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                setActiveTab(
                  tab.key as
                    | 'create-sell'
                    | 'create-buy'
                    | 'data-send'
                    | 'confirm'
                    | 'cancel'
                    | 'list'
                    | 'count'
                )
              }
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 판매 거래 생성 */}
      {activeTab === 'create-sell' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">판매 거래 생성</h3>
          <p className="text-sm text-blue-600">
            💡 로그인한 사용자가 카드에 대해 판매 거래 요청을 생성합니다.
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카드 ID *
              </label>
              <input
                type="number"
                value={tradeCreateData.cardId}
                onChange={(e) =>
                  setTradeCreateData({
                    ...tradeCreateData,
                    cardId: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                placeholder="카드 ID 입력"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                금액 *
              </label>
              <input
                type="number"
                value={tradeCreateData.money}
                onChange={(e) =>
                  setTradeCreateData({
                    ...tradeCreateData,
                    money: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                placeholder="금액 입력"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                포인트 *
              </label>
              <input
                type="number"
                value={tradeCreateData.point}
                onChange={(e) =>
                  setTradeCreateData({
                    ...tradeCreateData,
                    point: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                placeholder="포인트 입력"
              />
            </div>
          </div>
          <button
            onClick={createSellTrade}
            disabled={
              loading ||
              !tradeCreateData.cardId ||
              !tradeCreateData.money ||
              !tradeCreateData.point
            }
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '생성 중...' : '판매 거래 생성'}
          </button>
        </div>
      )}

      {/* 구매 거래 생성 */}
      {activeTab === 'create-buy' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">구매 거래 생성</h3>
          <p className="text-sm text-green-600">
            💡 로그인한 사용자가 카드에 대해 구매 거래 요청을 생성합니다.
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카드 ID *
              </label>
              <input
                type="number"
                value={tradeCreateData.cardId}
                onChange={(e) =>
                  setTradeCreateData({
                    ...tradeCreateData,
                    cardId: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                placeholder="카드 ID 입력"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                금액 *
              </label>
              <input
                type="number"
                value={tradeCreateData.money}
                onChange={(e) =>
                  setTradeCreateData({
                    ...tradeCreateData,
                    money: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                placeholder="금액 입력"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                포인트 *
              </label>
              <input
                type="number"
                value={tradeCreateData.point}
                onChange={(e) =>
                  setTradeCreateData({
                    ...tradeCreateData,
                    point: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                placeholder="포인트 입력"
              />
            </div>
          </div>
          <button
            onClick={createBuyTrade}
            disabled={
              loading ||
              !tradeCreateData.cardId ||
              !tradeCreateData.money ||
              !tradeCreateData.point
            }
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '생성 중...' : '구매 거래 생성'}
          </button>
        </div>
      )}

      {/* 거래 데이터 전송 */}
      {activeTab === 'data-send' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">거래 데이터 전송</h3>
          <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
            <p className="text-sm text-orange-800">
              📁 <strong>판매자 전용</strong>: 판매자가 파일을 업로드하여 거래
              데이터를 전송합니다.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                거래 ID *
              </label>
              <input
                type="number"
                value={tradeActionId}
                onChange={(e) =>
                  setTradeActionId(parseInt(e.target.value) || 0)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                placeholder="거래 ID 입력"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                파일 선택 *
              </label>
              <input
                type="file"
                onChange={(e) => setTradeDataFile(e.target.files?.[0] || null)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                accept="*/*"
              />
            </div>
          </div>
          <button
            onClick={sendTradeData}
            disabled={loading || !tradeActionId || !tradeDataFile}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '전송 중...' : '데이터 전송'}
          </button>
        </div>
      )}

      {/* 거래 확정 */}
      {activeTab === 'confirm' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">거래 확정</h3>
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-green-800">
              ✅ <strong>구매자 전용</strong>: 구매자가 거래를 확정하고 결제를
              완료합니다.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              거래 ID *
            </label>
            <input
              type="number"
              value={tradeActionId}
              onChange={(e) => setTradeActionId(parseInt(e.target.value) || 0)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
              placeholder="확정할 거래 ID 입력"
            />
          </div>
          <button
            onClick={confirmTrade}
            disabled={loading || !tradeActionId}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '확정 중...' : '거래 확정'}
          </button>
        </div>
      )}

      {/* 거래 취소 */}
      {activeTab === 'cancel' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">거래 취소</h3>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">
              ❌ <strong>주의</strong>: 진행 중인 거래를 취소합니다. 취소 후
              복구할 수 없습니다.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              거래 ID *
            </label>
            <input
              type="number"
              value={tradeActionId}
              onChange={(e) => setTradeActionId(parseInt(e.target.value) || 0)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
              placeholder="취소할 거래 ID 입력"
            />
          </div>
          <button
            onClick={cancelTrade}
            disabled={loading || !tradeActionId}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '취소 중...' : '거래 취소'}
          </button>
        </div>
      )}

      {/* 거래 내역 조회 */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">거래 내역 조회</h3>
          <p className="text-sm text-gray-600">
            로그인한 사용자의 거래 내역을 무한 스크롤 방식으로 조회합니다.
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                거래 유형 *
              </label>
              <select
                value={tradeScrollParams.side}
                onChange={(e) =>
                  setTradeScrollParams({
                    ...tradeScrollParams,
                    side: e.target.value as 'SELL' | 'BUY',
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="SELL">판매 (SELL)</option>
                <option value="BUY">구매 (BUY)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                조회 개수
              </label>
              <input
                type="number"
                value={tradeScrollParams.size || 10}
                onChange={(e) =>
                  setTradeScrollParams({
                    ...tradeScrollParams,
                    size: parseInt(e.target.value) || 10,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                커서 ID (페이징용)
              </label>
              <input
                type="number"
                value={tradeScrollParams.cursorId || ''}
                onChange={(e) =>
                  setTradeScrollParams({
                    ...tradeScrollParams,
                    cursorId: parseInt(e.target.value) || undefined,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="추가 조회 시 사용"
              />
            </div>
          </div>
          <button
            onClick={getTradeHistory}
            disabled={loading}
            className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '조회 중...' : '거래 내역 조회'}
          </button>
        </div>
      )}

      {/* 거래 수 조회 */}
      {activeTab === 'count' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">거래 수 조회</h3>
          <p className="text-sm text-gray-600">
            로그인한 사용자의 진행 중인 거래 건수를 조회합니다.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={getSellTradeCount}
              disabled={loading}
              className="bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? '조회 중...' : '진행 중인 판매 거래 수 조회'}
            </button>
            <button
              onClick={getBuyTradeCount}
              disabled={loading}
              className="bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? '조회 중...' : '진행 중인 구매 거래 수 조회'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
