'use client';

import React, { useState, useEffect } from 'react';
import { api, handleApiError } from '../utils/api';
import { ApiResponse } from '../types/api';
import { MIN_SETTLEMENT_AMOUNT, DEFAULT_BANKS } from '../constants/settlement';
import {
  SettlementModalProps,
  SettlementRequest,
  Bank,
  BankAccount,
  BankAccountRequest,
} from '../types/settlement-modal';

/**
 * @author 이승우
 * @description 스낵머니 정산 모달 컴포넌트 (계좌 등록/수정 기능 포함)
 * @params {@link SettlementModalProps}: 정산 모달 컴포넌트 타입
 */
export default function SettlementModal({
  open,
  onClose,
  currentMoney,
  onSettlementSuccess,
}: SettlementModalProps) {
  const [formData, setFormData] = useState<SettlementRequest>({
    amount: 0,
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 계좌 관련 상태
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [accountForm, setAccountForm] = useState<BankAccountRequest>({
    bankId: 0,
    accountNumber: '',
    accountHolder: '',
  });

  // 은행 목록 상태
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);

  // 모달이 열릴 때마다 초기화 및 계좌 목록 조회
  useEffect(() => {
    if (open) {
      setFormData({
        amount: 0,
        message: '',
      });
      setError(null);
      setIsAddingAccount(false);
      fetchAccounts();
      fetchBanks();
    }
  }, [open]);

  // 은행 목록 조회
  const fetchBanks = async () => {
    try {
      setIsLoadingBanks(true);
      console.log('은행 목록 조회 시작...');
      const response = await api.get<ApiResponse<Bank[]>>('/banks');
      const bankList = response.data.data;
      console.log('은행 목록 조회 성공:', bankList);
      setBanks(bankList);
    } catch (err) {
      console.error('은행 목록 조회 실패:', err);
      // 에러가 발생하면 기본 은행 목록으로 설정
      setBanks(DEFAULT_BANKS);
    } finally {
      setIsLoadingBanks(false);
    }
  };

  // 계좌 목록 조회
  const fetchAccounts = async () => {
    try {
      console.log('계좌 목록 조회 시작...');
      const response = await api.get<ApiResponse<BankAccount[]>>('/accounts');
      const accountList = response.data.data;
      console.log('계좌 목록 조회 성공:', accountList);
      setAccounts(accountList);

      // 계좌가 없으면 바로 계좌 등록 화면으로
      if (accountList.length === 0) {
        console.log('계좌가 없음 - 계좌 등록 화면으로 자동 이동');
        setIsAddingAccount(true);
        return;
      }

      // 기본 계좌가 있으면 선택
      const defaultAccount = accountList.find(
        (acc: BankAccount) => acc.isDefault
      );
      if (defaultAccount) {
        setSelectedAccountId(defaultAccount.id);
      } else if (accountList.length > 0) {
        setSelectedAccountId(accountList[0].id);
      }
    } catch (err) {
      console.error('계좌 목록 조회 실패:', err);
      // 에러가 발생해도 빈 배열로 설정하여 계좌가 없다고 인식하도록 함
      setAccounts([]);
      setSelectedAccountId('');
      // 에러 발생 시에도 계좌 등록 화면으로 이동
      setIsAddingAccount(true);
    }
  };

  const handleInputChange = (
    field: keyof SettlementRequest,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleAccountInputChange = (
    field: keyof BankAccountRequest,
    value: string | number
  ) => {
    setAccountForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  // 계좌 등록/수정
  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (accountForm.bankId === 0) {
      setError('은행을 선택해주세요.');
      return;
    }

    if (!accountForm.accountNumber.trim()) {
      setError('계좌번호를 입력해주세요.');
      return;
    }

    if (!accountForm.accountHolder.trim()) {
      setError('예금주명을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/accounts', accountForm);
      console.log('계좌 등록 성공:', response.data);

      // 계좌 목록 새로고침
      await fetchAccounts();

      // 등록 모드 해제
      setIsAddingAccount(false);
      setAccountForm({
        bankId: 0,
        accountNumber: '',
        accountHolder: '',
      });

      alert('계좌가 성공적으로 등록되었습니다!');
    } catch (err) {
      console.error('계좌 등록 실패:', err);
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('정산 버튼 클릭 - 현재 계좌 목록:', accounts);
    console.log('계좌 개수:', accounts.length);

    // 계좌가 선택되지 않았으면
    if (!selectedAccountId) {
      setError('정산받을 계좌를 선택해주세요.');
      return;
    }

    if (formData.amount <= 0) {
      setError('정산할 금액을 입력해주세요.');
      return;
    }

    if (formData.amount > currentMoney) {
      setError('보유한 머니보다 많은 금액을 정산할 수 없습니다.');
      return;
    }

    if (formData.amount < MIN_SETTLEMENT_AMOUNT) {
      setError(
        `최소 정산 금액은 ${MIN_SETTLEMENT_AMOUNT.toLocaleString()}S입니다.`
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 정산 API 호출
      const response = await api.post('/money/settle', {
        amount: formData.amount,
        accountId: selectedAccountId,
        message: formData.message || '',
      });

      console.log('정산 성공:', response.data);

      // 성공 콜백 호출
      if (onSettlementSuccess) {
        onSettlementSuccess(formData.amount, '정산');
      }

      alert('정산이 성공적으로 완료되었습니다!');
      onClose();
    } catch (err) {
      console.error('정산 실패:', err);
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">스낵머니 정산</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 현재 잔액 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="text-sm text-blue-600 mb-1">현재 잔액</div>
          <div className="text-2xl font-bold text-blue-900">
            {currentMoney.toLocaleString()}S
          </div>
        </div>

        {/* 계좌 등록 모드 */}
        {isAddingAccount ? (
          <form onSubmit={handleAccountSubmit} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">계좌 등록</h3>
              <button
                type="button"
                onClick={() => setIsAddingAccount(false)}
                className="text-sm text-blue-600 hover:text-blue-800"
                disabled={isLoading}
              >
                취소
              </button>
            </div>

            {/* 은행 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                은행 선택
              </label>
              <select
                value={accountForm.bankId || ''}
                onChange={(e) =>
                  handleAccountInputChange(
                    'bankId',
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading || isLoadingBanks}
              >
                <option value="">
                  {isLoadingBanks
                    ? '은행 목록 로딩 중...'
                    : '은행을 선택하세요'}
                </option>
                {banks.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 계좌번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                계좌번호
              </label>
              <input
                type="text"
                value={accountForm.accountNumber}
                onChange={(e) =>
                  handleAccountInputChange('accountNumber', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="계좌번호를 입력하세요"
                disabled={isLoading}
              />
            </div>

            {/* 예금주명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                예금주명
              </label>
              <input
                type="text"
                value={accountForm.accountHolder}
                onChange={(e) =>
                  handleAccountInputChange('accountHolder', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예금주명을 입력하세요"
                disabled={isLoading}
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            {/* 버튼 */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsAddingAccount(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? '등록 중...' : '계좌 등록'}
              </button>
            </div>
          </form>
        ) : (
          /* 정산 폼 */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 계좌 선택 */}
            {accounts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    정산받을 계좌
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAddingAccount(true)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                    disabled={isLoading}
                  >
                    + 계좌 추가
                  </button>
                </div>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                >
                  <option value="">계좌를 선택하세요</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.bankName} - {account.accountNumber}
                      {account.accountHolder && ` (${account.accountHolder})`}
                      {account.isDefault ? ' (기본)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 정산 금액 */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                정산 금액 (S)
              </label>
              <input
                type="number"
                id="amount"
                value={formData.amount || ''}
                onChange={(e) =>
                  handleInputChange('amount', parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="정산할 금액을 입력하세요"
                min="1000"
                max={currentMoney}
                disabled={isLoading}
              />
              <div className="text-xs text-gray-500 mt-1">
                최소 1,000S, 최대 {currentMoney.toLocaleString()}S
              </div>
            </div>

            {/* 정산 메시지 */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                메모 (선택사항)
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="정산과 관련된 메모를 입력하세요"
                rows={3}
                maxLength={100}
                disabled={isLoading}
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.message?.length || 0}/100자
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            {/* 버튼 */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading
                  ? '정산 중...'
                  : accounts.length === 0
                    ? '계좌 등록하기'
                    : '정산하기'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
