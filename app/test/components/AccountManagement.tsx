'use client';

import React, { useState } from 'react';
import { api, handleApiError, ApiResponse } from '../../(shared)/utils/api';
import { AccountData, AccountUpdateData, CommonProps } from '../types';

export default function AccountManagement({
  loading,
  setResponse,
}: CommonProps) {
  const [activeTab, setActiveTab] = useState<
    'create' | 'list' | 'update' | 'delete'
  >('create');

  const [accountCreateData, setAccountCreateData] = useState<AccountData>({
    bankId: 0,
    accountNumber: '',
  });

  const [accountUpdateData, setAccountUpdateData] = useState<AccountUpdateData>(
    {
      accountId: 0,
      bankId: 0,
      accountNumber: '',
    }
  );

  const [accountDeleteId, setAccountDeleteId] = useState<number>(0);

  // 계좌 등록 API 호출
  const createAccount = async () => {
    try {
      const result = await api.post<ApiResponse>(
        '/accounts',
        accountCreateData
      );
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setResponse(`Error: ${handleApiError(error)}`);
    }
  };

  // 계좌 목록 조회 API 호출
  const getAccountList = async () => {
    try {
      const result = await api.get<ApiResponse>('/accounts');
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setResponse(`Error: ${handleApiError(error)}`);
    }
  };

  // 계좌 수정 API 호출
  const updateAccount = async () => {
    try {
      const { accountId, ...updatePayload } = accountUpdateData;
      const result = await api.put<ApiResponse>(
        `/accounts/${accountId}`,
        updatePayload
      );
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setResponse(`Error: ${handleApiError(error)}`);
    }
  };

  // 계좌 삭제 API 호출
  const deleteAccount = async () => {
    try {
      const result = await api.delete<ApiResponse>(
        `/accounts/${accountDeleteId}`
      );
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (error) {
      setResponse(`Error: ${handleApiError(error)}`);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">계좌 관리</h2>

      {/* 계좌 관리 서브 탭 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'create', label: '등록' },
            { key: 'list', label: '조회' },
            { key: 'update', label: '수정' },
            { key: 'delete', label: '삭제' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                setActiveTab(tab.key as 'create' | 'list' | 'update' | 'delete')
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

      {/* 계좌 등록 */}
      {activeTab === 'create' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">계좌 등록</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                은행 ID *
              </label>
              <input
                type="number"
                value={accountCreateData.bankId}
                onChange={(e) =>
                  setAccountCreateData({
                    ...accountCreateData,
                    bankId: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                placeholder="은행 ID 입력"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                계좌번호 *
              </label>
              <input
                type="text"
                value={accountCreateData.accountNumber}
                onChange={(e) =>
                  setAccountCreateData({
                    ...accountCreateData,
                    accountNumber: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="계좌번호 입력"
              />
            </div>
          </div>
          <button
            onClick={createAccount}
            disabled={
              loading ||
              !accountCreateData.bankId ||
              !accountCreateData.accountNumber
            }
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '등록 중...' : '계좌 등록'}
          </button>
        </div>
      )}

      {/* 계좌 목록 조회 */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">계좌 목록 조회</h3>
          <p className="text-sm text-gray-600">
            로그인한 사용자의 모든 계좌 정보를 조회합니다.
          </p>
          <button
            onClick={getAccountList}
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '조회 중...' : '계좌 목록 조회'}
          </button>
        </div>
      )}

      {/* 계좌 수정 */}
      {activeTab === 'update' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">계좌 수정</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                계좌 ID *
              </label>
              <input
                type="number"
                value={accountUpdateData.accountId}
                onChange={(e) =>
                  setAccountUpdateData({
                    ...accountUpdateData,
                    accountId: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                placeholder="수정할 계좌 ID 입력"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                은행 ID *
              </label>
              <input
                type="number"
                value={accountUpdateData.bankId}
                onChange={(e) =>
                  setAccountUpdateData({
                    ...accountUpdateData,
                    bankId: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                placeholder="은행 ID 입력"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                계좌번호 *
              </label>
              <input
                type="text"
                value={accountUpdateData.accountNumber}
                onChange={(e) =>
                  setAccountUpdateData({
                    ...accountUpdateData,
                    accountNumber: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="계좌번호 입력"
              />
            </div>
          </div>
          <button
            onClick={updateAccount}
            disabled={
              loading ||
              !accountUpdateData.accountId ||
              !accountUpdateData.bankId ||
              !accountUpdateData.accountNumber
            }
            className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '수정 중...' : '계좌 수정'}
          </button>
        </div>
      )}

      {/* 계좌 삭제 */}
      {activeTab === 'delete' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">계좌 삭제</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              계좌 ID *
            </label>
            <input
              type="number"
              value={accountDeleteId}
              onChange={(e) =>
                setAccountDeleteId(parseInt(e.target.value) || 0)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
              placeholder="삭제할 계좌 ID 입력"
            />
          </div>
          <button
            onClick={deleteAccount}
            disabled={loading || !accountDeleteId}
            className="w-full bg-red text-white py-2 px-4 rounded-md hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '삭제 중...' : '계좌 삭제'}
          </button>
        </div>
      )}
    </div>
  );
}
