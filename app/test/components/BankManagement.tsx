'use client';

import React, { useState } from 'react';
import { api, handleApiError } from '../../(shared)/utils/api';
import { ApiResponse } from '../../(shared)/types/api';
import { BankData, BankUpdateData, CommonProps } from '../types';

export default function BankManagement({ loading, setResponse }: CommonProps) {
  const [activeTab, setActiveTab] = useState<
    'create' | 'list' | 'detail' | 'update' | 'delete'
  >('create');

  const [bankCreateData, setBankCreateData] = useState<BankData>({
    name: '',
  });

  const [bankUpdateData, setBankUpdateData] = useState<BankUpdateData>({
    bankId: 0,
    name: '',
  });

  const [bankDetailId, setBankDetailId] = useState<number>(0);
  const [bankDeleteId, setBankDeleteId] = useState<number>(0);

  // 은행 등록 API 호출
  const createBank = async () => {
    try {
      const result = await api.post<ApiResponse>('/banks', bankCreateData);
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setResponse(`Error: ${handleApiError(error)}`);
    }
  };

  // 은행 목록 조회 API 호출
  const getBankList = async () => {
    try {
      const result = await api.get<ApiResponse>('/banks');
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setResponse(`Error: ${handleApiError(error)}`);
    }
  };

  // 단건 은행 조회 API 호출
  const getBankById = async () => {
    try {
      const result = await api.get<ApiResponse>(`/banks/${bankDetailId}`);
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setResponse(`Error: ${handleApiError(error)}`);
    }
  };

  // 은행 수정 API 호출
  const updateBank = async () => {
    try {
      const { bankId, ...updatePayload } = bankUpdateData;
      const result = await api.patch<ApiResponse>(
        `/banks/${bankId}`,
        updatePayload
      );
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setResponse(`Error: ${handleApiError(error)}`);
    }
  };

  // 은행 삭제 API 호출
  const deleteBank = async () => {
    try {
      const result = await api.delete<ApiResponse>(`/banks/${bankDeleteId}`);
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setResponse(`Error: ${handleApiError(error)}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <p className="text-sm text-yellow-800">
          ⚠️ <strong>관리자 전용 기능</strong>: 은행 관리 기능은 관리자 권한이
          필요합니다.
        </p>
      </div>

      <h2 className="text-xl font-semibold">은행 관리</h2>

      {/* 은행 관리 서브 탭 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'create', label: '등록' },
            { key: 'list', label: '목록 조회' },
            { key: 'detail', label: '단건 조회' },
            { key: 'update', label: '수정' },
            { key: 'delete', label: '삭제' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                setActiveTab(
                  tab.key as 'create' | 'list' | 'detail' | 'update' | 'delete'
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

      {/* 은행 등록 */}
      {activeTab === 'create' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">은행 등록</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              은행명 *
            </label>
            <input
              type="text"
              value={bankCreateData.name}
              onChange={(e) =>
                setBankCreateData({
                  ...bankCreateData,
                  name: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="은행명 입력"
            />
          </div>
          <button
            onClick={createBank}
            disabled={loading || !bankCreateData.name}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '등록 중...' : '은행 등록'}
          </button>
        </div>
      )}

      {/* 은행 목록 조회 */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">은행 목록 조회</h3>
          <p className="text-sm text-gray-600">
            등록된 모든 은행 목록을 조회합니다.
          </p>
          <button
            onClick={getBankList}
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '조회 중...' : '은행 목록 조회'}
          </button>
        </div>
      )}

      {/* 단건 은행 조회 */}
      {activeTab === 'detail' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">단건 은행 조회</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              은행 ID *
            </label>
            <input
              type="number"
              value={bankDetailId}
              onChange={(e) => setBankDetailId(parseInt(e.target.value) || 0)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
              placeholder="조회할 은행 ID 입력"
            />
          </div>
          <button
            onClick={getBankById}
            disabled={loading || !bankDetailId}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '조회 중...' : '은행 조회'}
          </button>
        </div>
      )}

      {/* 은행 수정 */}
      {activeTab === 'update' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">은행 수정</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                은행 ID *
              </label>
              <input
                type="number"
                value={bankUpdateData.bankId}
                onChange={(e) =>
                  setBankUpdateData({
                    ...bankUpdateData,
                    bankId: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                placeholder="수정할 은행 ID 입력"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                은행명 *
              </label>
              <input
                type="text"
                value={bankUpdateData.name}
                onChange={(e) =>
                  setBankUpdateData({
                    ...bankUpdateData,
                    name: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="새로운 은행명 입력"
              />
            </div>
          </div>
          <button
            onClick={updateBank}
            disabled={loading || !bankUpdateData.bankId || !bankUpdateData.name}
            className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '수정 중...' : '은행 수정'}
          </button>
        </div>
      )}

      {/* 은행 삭제 */}
      {activeTab === 'delete' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">은행 삭제</h3>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">
              ⚠️ <strong>주의</strong>: 은행을 삭제하면 복구할 수 없습니다.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              은행 ID *
            </label>
            <input
              type="number"
              value={bankDeleteId}
              onChange={(e) => setBankDeleteId(parseInt(e.target.value) || 0)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
              placeholder="삭제할 은행 ID 입력"
            />
          </div>
          <button
            onClick={deleteBank}
            disabled={loading || !bankDeleteId}
            className="w-full bg-red text-white py-2 px-4 rounded-md hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '삭제 중...' : '은행 삭제'}
          </button>
        </div>
      )}
    </div>
  );
}
