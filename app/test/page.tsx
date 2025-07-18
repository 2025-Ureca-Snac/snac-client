'use client';

import React, { useState } from 'react';
import CardManagement from './components/CardManagement';
import AccountManagement from './components/AccountManagement';
import BankManagement from './components/BankManagement';
import TradeManagement from './components/TradeManagement';

export default function TestPage() {
  const [activeTab, setActiveTab] = useState<
    'cards' | 'accounts' | 'banks' | 'trades'
  >('cards');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // 카드 관리 서브 탭
  const [cardActiveTab, setCardActiveTab] = useState<
    'create' | 'list' | 'update' | 'delete'
  >('create');

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          백엔드 API 테스트 페이지
        </h1>

        {/* 메인 탭 네비게이션 */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            {[
              { key: 'cards', label: '카드 관리' },
              { key: 'accounts', label: '계좌 관리' },
              { key: 'banks', label: '은행 관리' },
              { key: 'trades', label: '거래 관리' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() =>
                  setActiveTab(
                    tab.key as 'cards' | 'accounts' | 'banks' | 'trades'
                  )
                }
                className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* 카드 관리 */}
            {activeTab === 'cards' && (
              <div className="space-y-4">
                {/* 카드 관리 서브 탭 */}
                <div className="border-b border-gray-200 mb-4">
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
                          setCardActiveTab(
                            tab.key as 'create' | 'list' | 'update' | 'delete'
                          )
                        }
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          cardActiveTab === tab.key
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <CardManagement
                  activeTab={cardActiveTab}
                  loading={loading}
                  setResponse={(res) => {
                    setResponse(res);
                    setLoading(false);
                  }}
                />
              </div>
            )}

            {/* 계좌 관리 */}
            {activeTab === 'accounts' && (
              <AccountManagement
                loading={loading}
                setResponse={(res) => {
                  setResponse(res);
                  setLoading(false);
                }}
              />
            )}

            {/* 은행 관리 */}
            {activeTab === 'banks' && (
              <BankManagement
                loading={loading}
                setResponse={(res) => {
                  setResponse(res);
                  setLoading(false);
                }}
              />
            )}

            {/* 거래 관리 */}
            {activeTab === 'trades' && (
              <TradeManagement
                loading={loading}
                setResponse={(res) => {
                  setResponse(res);
                  setLoading(false);
                }}
              />
            )}
          </div>
        </div>

        {/* 응답 결과 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">API 응답 결과</h2>
          <div className="bg-gray-50 rounded-md p-4 min-h-[200px]">
            <pre className="text-sm whitespace-pre-wrap text-gray-800">
              {response ||
                'API 테스트를 실행하면 여기에 응답 결과가 표시됩니다.'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
