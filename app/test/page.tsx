'use client';

import React, { useState, useEffect } from 'react';
import CardManagement from './components/CardManagement';
import AccountManagement from './components/AccountManagement';
import BankManagement from './components/BankManagement';
import TradeManagement from './components/TradeManagement';
import { api, handleApiError, ApiResponse } from '../(shared)/utils/api';
import { testTokenManager } from './utils/tokenManager';

export default function TestPage() {
  const [activeTab, setActiveTab] = useState<
    'cards' | 'accounts' | 'banks' | 'trades'
  >('cards');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // 로그인 관련 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [showLoginForm, setShowLoginForm] = useState(false);

  // 컴포넌트 마운트 시 토큰 상태 확인
  useEffect(() => {
    const token = testTokenManager.getToken();
    setIsLoggedIn(!!token);
  }, []);

  // 로그인 처리
  const handleLogin = async () => {
    try {
      setLoading(true);
      const result = await api.post<ApiResponse>('/login', loginData);

      console.log('로그인 응답 헤더:', result.headers);
      console.log('로그인 응답 데이터:', result.data);

      // 응답 헤더에서 Access-Token 추출 (다양한 헤더명 시도)
      const accessToken =
        result.headers['access-token'] ||
        result.headers['Access-Token'] ||
        result.headers['authorization'] ||
        result.headers['Authorization'];

      if (accessToken) {
        // Bearer 접두사 제거
        const token = accessToken.replace('Bearer ', '');
        testTokenManager.setToken(token);
        setIsLoggedIn(true);
        setShowLoginForm(false);
        setResponse(`로그인 성공!\n토큰: ${token.slice(0, 50)}...`);

        // 로그인 폼 초기화
        setLoginData({ email: '', password: '' });
      } else {
        setResponse(
          `로그인 성공했지만 토큰을 찾을 수 없습니다.\n사용 가능한 헤더: ${Object.keys(
            result.headers
          ).join(', ')}`
        );
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      setResponse(`로그인 실패: ${handleApiError(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      setLoading(true);
      await api.post<ApiResponse>('/logout');

      testTokenManager.removeToken();
      setIsLoggedIn(false);
      setResponse('로그아웃 성공!');
    } catch (error) {
      // 로그아웃 실패해도 토큰은 제거
      testTokenManager.removeToken();
      setIsLoggedIn(false);
      setResponse(`로그아웃 처리: ${handleApiError(error)}`);
    } finally {
      setLoading(false);
    }
  };

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

        {/* 로그인 상태 및 로그인/로그아웃 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">로그인 상태:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isLoggedIn
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {isLoggedIn ? '로그인됨' : '로그인 필요'}
              </span>
              {isLoggedIn && (
                <span className="text-sm text-gray-600">
                  토큰: {testTokenManager.getToken()?.slice(0, 20)}...
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {!isLoggedIn ? (
                <button
                  onClick={() => setShowLoginForm(!showLoginForm)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  로그인
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="px-4 py-2 bg-red text-white rounded-md hover:bg-red-600 disabled:bg-gray-400"
                >
                  {loading ? '로그아웃 중...' : '로그아웃'}
                </button>
              )}
            </div>
          </div>

          {/* 로그인 폼 */}
          {showLoginForm && !isLoggedIn && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-semibold mb-4">로그인</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="이메일을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="비밀번호를 입력하세요"
                  />
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={handleLogin}
                  disabled={loading || !loginData.email || !loginData.password}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? '로그인 중...' : '로그인'}
                </button>
                <button
                  onClick={() => setShowLoginForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>

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
