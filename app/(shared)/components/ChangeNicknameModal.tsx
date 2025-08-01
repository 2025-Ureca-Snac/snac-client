import React, { useState, useEffect, useRef, useCallback } from 'react';
import ModalPortal from './modal-portal';
import type { ChangeNicknameModalProps } from '../types/change-nickname-modal';
import { api } from '../utils/api';
import {
  getRemainingTimeForNicknameChange,
  formatRemainingTime,
} from '../utils';
import { useUserStore } from '../stores/user-store';

/**
 * @author 이승우
 * @description 닉네임 변경 모달 컴포넌트{@link ChangeNicknameModalProps(open, onClose, onSubmit, currentNickname)}
 * @param {boolean} open 모달 열림 상태
 * @param {Function} onClose 모달 닫기 함수
 * @param {Function} onSubmit 닉네임 변경 함수
 * @param {string} currentNickname 현재 닉네임
 */
export default function ChangeNicknameModal({
  open,
  onClose,
  onSubmit,
  currentNickname = '',
}: ChangeNicknameModalProps) {
  const [nickname, setNickname] = useState(currentNickname);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [remainingTime, setRemainingTime] = useState(0);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [duplicateCheckResult, setDuplicateCheckResult] = useState<{
    isDuplicate: boolean;
    message: string;
  } | null>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const duplicateCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { profile, updateNickname } = useUserStore();

  // 실시간 타이머 업데이트
  useEffect(() => {
    if (!open || !profile?.nicknameUpdatedAt) return;

    const updateTimer = () => {
      const remaining = getRemainingTimeForNicknameChange(
        profile.nicknameUpdatedAt
      );
      setRemainingTime(remaining);
    };

    // 초기 실행
    updateTimer();

    // 1초마다 업데이트
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [open, profile?.nicknameUpdatedAt]);

  // 모달이 열릴 때 자동 포커스
  useEffect(() => {
    if (open) {
      setNickname(currentNickname);
      setDuplicateCheckResult(null);
      setTimeout(() => {
        nicknameRef.current?.focus();
      }, 100);
    }
  }, [open, currentNickname]);

  // 닉네임 변경 가능 여부 확인
  const canChangeNickname = remainingTime <= 0;

  // 닉네임 중복 체크 함수
  const checkNicknameDuplicate = useCallback(
    async (nicknameToCheck: string) => {
      if (
        !nicknameToCheck.trim() ||
        nicknameToCheck.trim() === currentNickname
      ) {
        setDuplicateCheckResult(null);
        return;
      }

      if (nicknameToCheck.trim().length < 2) {
        setDuplicateCheckResult({
          isDuplicate: false,
          message: '닉네임은 2자 이상 입력해주세요.',
        });
        return;
      }

      setIsCheckingDuplicate(true);
      setDuplicateCheckResult(null);

      try {
        const response = await api.post<{
          data: { isDuplicate: boolean };
        }>(`/member/check-nickname`, {
          nickname: nicknameToCheck.trim(),
        });

        console.log(response);

        if (response.status === 200) {
          const isDuplicate = response.data.data?.isDuplicate || false;
          setDuplicateCheckResult({
            isDuplicate,
            message: isDuplicate
              ? '이미 사용 중인 닉네임입니다.'
              : '사용 가능한 닉네임입니다.',
          });
        }
      } catch (error: unknown) {
        console.error('닉네임 중복 체크 오류:', error);

        // API 엔드포인트가 없는 경우를 대비한 fallback
        if (error && typeof error === 'object' && 'response' in error) {
          const apiError = error as { response?: { status?: number } };
          if (apiError.response?.status === 404) {
            // API 엔드포인트가 없는 경우, 중복 체크를 건너뛰고 변경 시에만 체크
            setDuplicateCheckResult(null);
          } else {
            setDuplicateCheckResult({
              isDuplicate: false,
              message: '중복 체크 중 오류가 발생했습니다.',
            });
          }
        } else {
          setDuplicateCheckResult({
            isDuplicate: false,
            message: '중복 체크 중 오류가 발생했습니다.',
          });
        }
      } finally {
        setIsCheckingDuplicate(false);
      }
    },
    [currentNickname]
  );

  // 디바운싱된 중복 체크
  useEffect(() => {
    if (duplicateCheckTimeoutRef.current) {
      clearTimeout(duplicateCheckTimeoutRef.current);
    }

    // 닉네임 변경이 제한된 시간 동안에는 중복 체크하지 않음
    if (!canChangeNickname) {
      setDuplicateCheckResult(null);
      return;
    }

    if (nickname.trim() && nickname.trim() !== currentNickname) {
      duplicateCheckTimeoutRef.current = setTimeout(() => {
        checkNicknameDuplicate(nickname);
      }, 500); // 500ms 디바운싱
    } else {
      setDuplicateCheckResult(null);
    }

    return () => {
      if (duplicateCheckTimeoutRef.current) {
        clearTimeout(duplicateCheckTimeoutRef.current);
      }
    };
  }, [nickname, currentNickname, canChangeNickname, checkNicknameDuplicate]);

  // 닉네임 변경 처리
  const handleNicknameChange = useCallback(async () => {
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    if (nickname.trim() === currentNickname) {
      setError('현재 닉네임과 동일합니다.');
      return;
    }

    // 중복 체크 결과가 있고 중복인 경우
    if (duplicateCheckResult?.isDuplicate) {
      setError('이미 사용 중인 닉네임입니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/member/change-nickname', {
        nickname: nickname.trim(),
      });

      if (response.status === 200) {
        // 스토어 업데이트
        updateNickname(nickname.trim());
        // 성공 시 콜백 호출
        if (onSubmit) {
          onSubmit(nickname.trim());
        }
      } else {
        setError('닉네임 변경에 실패했습니다.');
      }
    } catch (error: unknown) {
      console.error('닉네임 변경 오류:', error);

      // 에러 메시지 처리
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as {
          response?: { data?: { message?: string }; status?: number };
        };
        if (apiError.response?.data?.message) {
          setError(apiError.response.data.message);
        } else if (apiError.response?.status === 409) {
          setError('이미 사용 중인 닉네임입니다.');
        } else {
          setError('닉네임 변경 중 오류가 발생했습니다.');
        }
      } else {
        setError('닉네임 변경 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    nickname,
    currentNickname,
    duplicateCheckResult,
    onSubmit,
    updateNickname,
  ]);

  // 초기화
  const handleReset = () => {
    setNickname('');
    setError(null);
    setIsLoading(false);
    setDuplicateCheckResult(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNicknameChange();
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // 닉네임 입력 후 Enter 키 처리
  const handleNicknameKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && nickname.trim()) {
        e.preventDefault();
        handleNicknameChange();
      }
    },
    [nickname, handleNicknameChange]
  );

  // 중복 체크 결과에 따른 버튼 비활성화 조건
  const isButtonDisabled =
    !nickname.trim() ||
    nickname.trim() === currentNickname ||
    isLoading ||
    !canChangeNickname ||
    isCheckingDuplicate ||
    duplicateCheckResult?.isDuplicate === true;

  return (
    <ModalPortal isOpen={open} onClose={handleClose}>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
        onClick={handleClose}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
      >
        <form
          className="bg-white rounded-2xl shadow-xl w-[370px] max-w-full pt-6 pb-8 px-6 relative flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
        >
          {/* 상단 아이콘 */}
          <div className="flex flex-col items-center -mt-12 mb-2">
            <div
              className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2 border-4 border-white shadow"
              style={{ marginTop: '-32px' }}
            >
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#DBEAFE" />
                <path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="7" r="4" stroke="#2563EB" strokeWidth="2" />
              </svg>
            </div>
            <div className="text-xl font-extrabold text-black text-center">
              닉네임 변경
            </div>
            <button
              onClick={handleClose}
              type="button"
              className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-gray-600"
              aria-label="닫기"
              tabIndex={0}
            >
              ×
            </button>
          </div>
          <div className="w-full text-center text-gray-600 mb-4 text-sm">
            현재 닉네임을 수정해주세요.
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="w-full mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-center">{error}</p>
            </div>
          )}

          <div className="w-full flex flex-col gap-3 mb-4">
            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-semibold mb-1"
              >
                닉네임
              </label>
              <div className="relative">
                <input
                  ref={nicknameRef}
                  type="text"
                  id="nickname"
                  name="nickname"
                  className={`w-full border rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500 pr-10 ${
                    duplicateCheckResult?.isDuplicate === true
                      ? 'border-red-300 focus:ring-red-200'
                      : duplicateCheckResult?.isDuplicate === false
                        ? 'border-green-300 focus:ring-green-200'
                        : 'border-gray-200'
                  }`}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                  maxLength={10}
                  required
                  onKeyDown={handleNicknameKeyDown}
                  tabIndex={0}
                />
                {/* 중복 체크 로딩 아이콘 */}
                {isCheckingDuplicate && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  </div>
                )}
                {/* 중복 체크 결과 아이콘 */}
                {!isCheckingDuplicate && duplicateCheckResult && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {duplicateCheckResult.isDuplicate ? (
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                최대 10자까지 입력 가능합니다.
              </div>
              {/* 중복 체크 결과 메시지 */}
              {duplicateCheckResult && (
                <div
                  className={`text-xs mt-1 ${
                    duplicateCheckResult.isDuplicate
                      ? 'text-red-500'
                      : 'text-green-500'
                  }`}
                >
                  {duplicateCheckResult.message}
                </div>
              )}
            </div>
          </div>

          <div className="w-full flex gap-2 mb-2">
            <button
              type="submit"
              disabled={isButtonDisabled}
              className="w-2/3 py-3 rounded-lg bg-blue-200 text-black font-bold text-lg hover:bg-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
              tabIndex={0}
            >
              {isLoading
                ? '처리중...'
                : isCheckingDuplicate
                  ? '확인중...'
                  : !canChangeNickname
                    ? formatRemainingTime(remainingTime)
                    : '변경하기'}
            </button>
            <button
              type="button"
              className="w-1/3 py-3 rounded-lg bg-gray-100 text-gray-700 font-bold text-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={onClose}
              tabIndex={0}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
}
