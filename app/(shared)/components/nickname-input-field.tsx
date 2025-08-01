'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
} from 'react';
import { api } from '../utils/api';

interface NicknameInputFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  maxLength?: number;
}

/**
 * @author 이승우
 * @description 닉네임 입력 필드 컴포넌트 (중복 체크 기능 포함)
 */
const NicknameInputField = forwardRef<
  HTMLInputElement,
  NicknameInputFieldProps
>(
  (
    {
      label,
      id,
      name,
      value,
      onChange,
      placeholder = '닉네임을 입력하세요',
      required = false,
      disabled = false,
      className = '',
      maxLength = 10,
    },
    ref
  ) => {
    const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
    const [duplicateCheckResult, setDuplicateCheckResult] = useState<{
      isDuplicate: boolean;
      message: string;
    } | null>(null);
    const duplicateCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // 닉네임 중복 체크 함수
    const checkNicknameDuplicate = useCallback(
      async (nicknameToCheck: string) => {
        if (!nicknameToCheck.trim()) {
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
              // API 엔드포인트가 없는 경우, 중복 체크를 건너뛰고 회원가입 시에만 체크
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
      []
    );

    // 디바운싱된 중복 체크
    useEffect(() => {
      if (duplicateCheckTimeoutRef.current) {
        clearTimeout(duplicateCheckTimeoutRef.current);
      }

      if (value.trim()) {
        duplicateCheckTimeoutRef.current = setTimeout(() => {
          checkNicknameDuplicate(value);
        }, 500); // 500ms 디바운싱
      } else {
        setDuplicateCheckResult(null);
      }

      return () => {
        if (duplicateCheckTimeoutRef.current) {
          clearTimeout(duplicateCheckTimeoutRef.current);
        }
      };
    }, [value, checkNicknameDuplicate]);

    return (
      <div>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type="text"
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            maxLength={maxLength}
            className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed h-[48px] pr-10 ${className} ${
              duplicateCheckResult?.isDuplicate === true
                ? 'border-red-300 focus:ring-red-200'
                : duplicateCheckResult?.isDuplicate === false
                  ? 'border-green-300 focus:ring-green-200'
                  : 'border-gray-300'
            }`}
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
        <div className="min-h-[20px] mt-2">
          {/* 중복 체크 결과 메시지 */}
          {duplicateCheckResult && (
            <div
              className={`text-xs ${
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
    );
  }
);

NicknameInputField.displayName = 'NicknameInputField';
export default NicknameInputField;
