'use client';

import Image from 'next/image';
import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SearchModalProps } from '../(shared)/types';
import { useTimer } from '../(shared)/hooks/useTimer';
import FindEmailSection from '../(shared)/components/find-email-section';
import FindPasswordSection from '../(shared)/components/find-password-section';
import ModalPortal from '../(shared)/components/modal-portal';
import TabNavigation from '../(shared)/components/TabNavigation';
import { api } from '../(shared)/utils/api';

/**
 * @author 이승우
 * @description 아이디 비밀번호 찾기 모달 컴포넌트
 * @params {@link SearchModalProps}
 */
export default function SearchModal({ isOpen, setIsOpen }: SearchModalProps) {
  // 아이디 찾기 상태
  const [showIdVerification, setShowIdVerification] = useState(false);
  const [isIdSent, setIsIdSent] = useState(false);
  const [isIdVerified, setIsIdVerified] = useState(false);
  const idTimer = useTimer();
  const [foundEmail, setFoundEmail] = useState<string | null>(null);
  const [formHeight, setFormHeight] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const idVerificationRef = useRef<HTMLInputElement>(null);
  const passwordVerificationRef = useRef<HTMLInputElement>(null);
  const newPasswordInputRef = useRef<HTMLInputElement>(null);

  // 비밀번호 찾기 상태
  const [showPasswordVerification, setShowPasswordVerification] =
    useState(false);
  const [isPasswordSent, setIsPasswordSent] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const passwordTimer = useTimer();
  // 이메일/휴대폰 토글 상태 추가
  const [passwordAuthType, setPasswordAuthType] = useState<'email' | 'phone'>(
    'email'
  );

  // 인증 요청 중복 방지 상태
  const [isIdVerifying, setIsIdVerifying] = useState(false);
  const [isPasswordVerifying, setIsPasswordVerifying] = useState(false);

  // 폼 데이터
  const [idFormData, setIdFormData] = useState({
    phone: '',
    verificationCode: '',
  });
  const [passwordFormData, setPasswordFormData] = useState({
    email: '',
    phone: '',
    verificationCode: '',
    password: '',
    passwordConfirm: '',
  });

  // Escape 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(null);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, setIsOpen]);

  // 모달 완전 초기화 함수
  const resetModal = () => {
    setIsVerified(false);
    setShowIdVerification(false);
    setIsIdSent(false);
    setIsIdVerified(false);
    setShowPasswordVerification(false);
    setIsPasswordSent(false);
    setIsPasswordVerified(false);
    setPasswordAuthType('email');
    setIsIdVerifying(false); // 인증 중 상태 초기화
    setIsPasswordVerifying(false); // 인증 중 상태 초기화
    idTimer.stop();
    passwordTimer.stop();
    setIdFormData({ phone: '', verificationCode: '' });
    setPasswordFormData({
      email: '',
      phone: '',
      verificationCode: '',
      password: '',
      passwordConfirm: '',
    });
    setFoundEmail(null);
    setFormHeight(null);
    setIsOpen(null);
  };

  // 탭 정의
  const tabs = [
    { id: 'id', label: '이메일 찾기' },
    { id: 'password', label: '비밀번호 찾기' },
  ];

  // 탭 전환 시 상태 초기화
  const handleTab = (type: SearchModalProps['isOpen']) => {
    // 모든 상태 초기화 (모달 닫기는 것만 제외)
    setIsVerified(false);
    setShowIdVerification(false);
    setIsIdSent(false);
    setIsIdVerified(false);
    setShowPasswordVerification(false);
    setIsPasswordSent(false);
    setIsPasswordVerified(false);
    setPasswordAuthType('email');
    setIsIdVerifying(false); // 인증 중 상태 초기화
    setIsPasswordVerifying(false); // 인증 중 상태 초기화
    idTimer.stop();
    passwordTimer.stop();
    setIdFormData({ phone: '', verificationCode: '' });
    setPasswordFormData({
      email: '',
      phone: '',
      verificationCode: '',
      password: '',
      passwordConfirm: '',
    });
    setFoundEmail(null);
    setFormHeight(null);
    // 새로운 탭으로 설정
    setIsOpen(type);
  };

  // 탭 변경 핸들러
  const handleTabChange = (tabId: string) => {
    handleTab(tabId as SearchModalProps['isOpen']);
  };

  // 이메일 찾기 인증 요청
  const handleIdVerification = useCallback(async () => {
    if (isIdVerifying) return; // 이미 인증 요청 중이면 무시

    if (!idFormData.phone) {
      alert('휴대폰 번호를 입력해주세요.');
      return;
    }

    console.log('이메일 찾기 인증 요청', idFormData.phone);

    try {
      setIsIdVerifying(true); // 인증 요청 시작
      const response = await api.post('/sns/send-verification-code', {
        phone: idFormData.phone,
      });

      console.log('아이디 찾기 인증 요청 응답', response);

      if ((response.data as { status?: string })?.status === 'OK') {
        setShowIdVerification(true);
        setIsIdSent(true);
        idTimer.start(300); // 5분 = 300초
        // 인증코드 입력 필드에 포커스
        setTimeout(() => {
          idVerificationRef.current?.focus();
        }, 100);
      } else {
        alert('인증코드 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('이메일 찾기 인증 요청 오류', error);
      alert('인증코드 전송에 실패했습니다.');
    } finally {
      setIsIdVerifying(false); // 인증 요청 완료
    }
  }, [idFormData.phone, idTimer, isIdVerifying]);

  // 비밀번호 찾기 인증 요청
  const handlePasswordVerification = useCallback(async () => {
    if (isPasswordVerifying) return; // 이미 인증 요청 중이면 무시

    const email = passwordFormData.email;
    const phone = passwordFormData.phone;

    if (passwordAuthType === 'email') {
      if (!email) {
        alert('이메일을 입력해주세요.');
        return;
      }
      try {
        setIsPasswordVerifying(true); // 인증 요청 시작
        const response = await api.post('/email/send-verification-code', {
          email,
        });
        console.log('비밀번호 찾기 이메일 인증 요청 응답', response);
        if ((response.data as { status?: string })?.status === 'OK') {
          setShowPasswordVerification(true);
          setIsPasswordSent(true);
          passwordTimer.start(300); // 5분 = 300초
          // 인증코드 입력 필드에 포커스
          setTimeout(() => {
            passwordVerificationRef.current?.focus();
          }, 100);
        } else {
          alert('인증코드 전송에 실패했습니다.');
        }
      } catch (error) {
        console.error('비밀번호 찾기 이메일 인증 요청 오류', error);
        alert(`인증코드 전송에 실패했습니다. ${error}`);
      } finally {
        setIsPasswordVerifying(false); // 인증 요청 완료
      }
    } else {
      if (!phone) {
        alert('휴대폰 번호를 입력해주세요.');
        return;
      }

      try {
        setIsPasswordVerifying(true); // 인증 요청 시작
        const response = await api.post('/sns/send-verification-code', {
          phone,
        });
        console.log('비밀번호 찾기 휴대폰 인증 요청 응답', response);
        if ((response.data as { status?: string })?.status === 'OK') {
          setShowPasswordVerification(true);
          setIsPasswordSent(true);
          passwordTimer.start(300); // 5분 = 300초
          // 인증코드 입력 필드에 포커스
          setTimeout(() => {
            passwordVerificationRef.current?.focus();
          }, 100);
        } else {
          alert('인증코드 전송에 실패했습니다.');
        }
      } catch (error) {
        console.error('비밀번호 찾기 휴대폰 인증 요청 오류', error);
        alert(`인증코드 전송에 실패했습니다. ${error}`);
      } finally {
        setIsPasswordVerifying(false); // 인증 요청 완료
      }
    }
  }, [
    passwordFormData.email,
    passwordFormData.phone,
    passwordAuthType,
    passwordTimer,
    isPasswordVerifying,
  ]);

  // 이메일 찾기 인증코드 확인
  const handleIdVerificationCheck = useCallback(async () => {
    console.log('이메일 찾기 인증코드 확인', idFormData.verificationCode);
    try {
      const response = await api.post<unknown>('/sns/verify-code', {
        phone: idFormData.phone,
        code: idFormData.verificationCode,
      });

      console.log('이메일 찾기 인증코드 확인 응답', response);
      if ((response.data as { status?: string })?.status === 'OK') {
        console.log('이메일 찾기 인증코드 확인 성공');
        setIsIdVerified(true);
        setShowIdVerification(false);
        // 아이디 찾기 버튼에 포커스
        setTimeout(() => {
          const findIdButton = document.querySelector(
            '[data-find-id-button]'
          ) as HTMLButtonElement;
          findIdButton?.focus();
        }, 100);
      } else {
        alert('인증코드가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('이메일 찾기 인증코드 확인 오류', error);
    }
  }, [idFormData.verificationCode, idFormData.phone]);

  // 비밀번호 찾기 인증코드 확인
  const handlePasswordVerificationCheck = useCallback(async () => {
    const email = passwordFormData.email;
    const phone = passwordFormData.phone;
    const verificationCode = passwordFormData.verificationCode;

    try {
      if (passwordAuthType === 'email') {
        const response = await api.post('/email/verify-code', {
          email,
          code: verificationCode,
        });
        if ((response.data as { status?: string })?.status === 'OK') {
          console.log('비밀번호 찾기 이메일 인증코드 확인 성공');
          setIsPasswordVerified(true);
          setShowPasswordVerification(false);
          setIsVerified(true);
          // 새 비밀번호 입력 필드에 포커스
          setTimeout(() => {
            if (newPasswordInputRef.current) {
              newPasswordInputRef.current.focus();
            } else {
              // fallback: data 속성으로 찾기
              const newPasswordInput = document.querySelector(
                '[data-new-password-input]'
              ) as HTMLInputElement;
              newPasswordInput?.focus();
            }
          }, 300);
        } else {
          alert('인증코드가 일치하지 않습니다.');
        }
      } else {
        const response = await api.post('/sns/verify-code', {
          phone,
          code: verificationCode,
        });
        if ((response.data as { status?: string })?.status === 'OK') {
          console.log('비밀번호 찾기 휴대폰 인증코드 확인 성공');
          setIsPasswordVerified(true);
          setShowPasswordVerification(false);
          setIsVerified(true);
          // 새 비밀번호 입력 필드에 포커스
          setTimeout(() => {
            if (newPasswordInputRef.current) {
              newPasswordInputRef.current.focus();
            } else {
              // fallback: data 속성으로 찾기
              const newPasswordInput = document.querySelector(
                '[data-new-password-input]'
              ) as HTMLInputElement;
              newPasswordInput?.focus();
            }
          }, 300);
        } else {
          alert('인증코드가 일치하지 않습니다.');
        }
      }
    } catch (error) {
      console.error('비밀번호 찾기 인증코드 확인 오류', error);
      alert(`인증코드 확인에 실패했습니다. ${error}`);
    }
  }, [
    passwordFormData.email,
    passwordFormData.phone,
    passwordFormData.verificationCode,
    passwordAuthType,
  ]);

  // 입력 필드 변경 핸들러
  const handleIdFormChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setIdFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handlePasswordFormChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  // 아이디 찾기 버튼 클릭 시
  const handleFindId = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isIdVerified) return;
      if (formRef.current) {
        setFormHeight(formRef.current.offsetHeight);
      }
      try {
        const response = await api.post<{ data: string }>('member/find-email', {
          phone: idFormData.phone,
        });
        console.log(response);
        setFoundEmail(response.data.data);
      } catch (error) {
        alert(`이메일을 찾을 수 없습니다. ${error}`);
      }
    },
    [isIdVerified, idFormData.phone]
  );

  // 로그인하러 가기
  const goToLogin = () => {
    resetModal();
  };

  // 이메일 찾기 초기화
  const handleIdReset = () => {
    setShowIdVerification(false);
    setIsIdSent(false);
    setIsIdVerified(false);
    idTimer.stop();
    setIdFormData({ phone: '', verificationCode: '' });
    setFoundEmail(null);
    setFormHeight(null);
  };

  // 비밀번호 찾기 초기화
  const handlePasswordReset = () => {
    setShowPasswordVerification(false);
    setIsPasswordSent(false);
    setIsPasswordVerified(false);
    setIsVerified(false);
    passwordTimer.stop();
    setPasswordFormData({
      email: '',
      phone: '',
      verificationCode: '',
      password: '',
      passwordConfirm: '',
    });
  };

  // 비밀번호 변경
  const handlePasswordChange = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const { password, passwordConfirm } = passwordFormData;

      // 비밀번호 유효성 검사
      if (!password || !passwordConfirm) {
        alert('비밀번호를 입력해주세요.');
        return;
      }

      if (password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      try {
        // 비밀번호 변경 API 호출
        const response =
          passwordAuthType === 'email'
            ? await api.post('/member/find-pwd/email', {
                email: passwordFormData.email,
                newPwd: password,
              })
            : await api.post('/member/find-pwd/phone', {
                phone: passwordFormData.phone,
                newPwd: password,
              });

        if ((response.data as { status?: string })?.status === 'OK') {
          alert('비밀번호가 성공적으로 변경되었습니다.');
          resetModal(); // 모달 닫기
        } else {
          alert('비밀번호 변경에 실패했습니다.');
        }
      } catch (error) {
        console.error('비밀번호 변경 오류:', error);
        alert('비밀번호 변경 중 오류가 발생했습니다.');
      }
    },
    [passwordFormData, passwordAuthType, resetModal]
  );

  // 비밀번호 찾기 토글 변경 핸들러
  const handlePasswordAuthTypeChange = useCallback(
    (newAuthType: 'email' | 'phone') => {
      setPasswordAuthType(newAuthType);
      // 관련 상태들 초기화
      setPasswordFormData((prev) => ({
        ...prev,
        email: '', // 이메일 입력 필드 초기화
        phone: '', // 휴대폰 번호 입력 필드 초기화
        verificationCode: '',
      }));
      setIsPasswordSent(false);
      setIsPasswordVerified(false);
      setShowPasswordVerification(false);
      setIsVerified(false);
      passwordTimer.stop();
    },
    [passwordTimer]
  );

  return (
    <ModalPortal isOpen={!!isOpen} onClose={resetModal}>
      <div className="flex items-center justify-center bg-black bg-opacity-30 h-full">
        <div className="bg-white rounded-xl w-[90%] max-w-[450px] p-6 md:p-8 relative">
          {/* 닫기 버튼 */}
          <button
            className="absolute top-4 right-4 text-2xl"
            onClick={resetModal}
            aria-label="닫기"
          >
            <Image src="/close.png" alt="close" width={24} height={24} />
          </button>

          {/* 탭 */}
          <TabNavigation
            tabs={tabs}
            activeTab={isOpen || 'id'}
            onTabChange={handleTabChange}
            activeTextColor="text-midnight-black"
            inactiveTextColor="text-gray-500"
            underlineColor="bg-midnight-black"
          />

          {/* 폼 */}
          <AnimatePresence mode="wait">
            {isOpen === 'id' ? (
              <FindEmailSection
                foundEmail={foundEmail}
                formHeight={formHeight}
                formRef={formRef}
                idFormData={idFormData}
                isIdVerified={isIdVerified}
                showIdVerification={showIdVerification}
                isIdSent={isIdSent}
                idTimer={idTimer}
                handleIdFormChange={handleIdFormChange}
                handleIdVerification={handleIdVerification}
                handleIdVerificationCheck={handleIdVerificationCheck}
                handleFindId={handleFindId}
                goToLogin={goToLogin}
                onReset={handleIdReset}
                idVerificationRef={idVerificationRef}
                isIdVerifying={isIdVerifying}
              />
            ) : (
              <FindPasswordSection
                isVerified={isVerified}
                passwordFormData={passwordFormData}
                isPasswordVerified={isPasswordVerified}
                showPasswordVerification={showPasswordVerification}
                isPasswordSent={isPasswordSent}
                passwordTimer={passwordTimer}
                handlePasswordFormChange={handlePasswordFormChange}
                handlePasswordVerification={handlePasswordVerification}
                handlePasswordVerificationCheck={
                  handlePasswordVerificationCheck
                }
                passwordAuthType={passwordAuthType}
                handlePasswordAuthTypeChange={handlePasswordAuthTypeChange}
                onReset={handlePasswordReset}
                onSubmit={handlePasswordChange}
                passwordVerificationRef={passwordVerificationRef}
                newPasswordInputRef={newPasswordInputRef}
                isPasswordVerifying={isPasswordVerifying}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </ModalPortal>
  );
}
