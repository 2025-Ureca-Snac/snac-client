import Image from 'next/image';
import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchModalProps } from '../(shared)/types';
import { useTimer } from '../(shared)/hooks/useTimer';
import FindEmailSection from '../(shared)/components/find-email-section';
import FindPasswordSection from '../(shared)/components/find-password-section';
import ModalPortal from '../(shared)/components/modal-portal';
import { api } from '../(shared)/utils/api';

/**
 * @author 이승우
 * @description 아이디 비밀번호 찾기 모달 컴포넌트
 * @param isOpen 모달 열림 여부
 * @param setIsOpen 모달 열림 여부 설정 함수
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

  // 비밀번호 찾기 상태
  const [showPasswordVerification, setShowPasswordVerification] =
    useState(false);
  const [isPasswordSent, setIsPasswordSent] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const passwordTimer = useTimer();

  // 폼 데이터
  const [idFormData, setIdFormData] = useState({
    phone: '',
    verificationCode: '',
  });
  const [passwordFormData, setPasswordFormData] = useState({
    emailOrPhone: '',
    verificationCode: '',
    password: '',
    passwordConfirm: '',
  });

  // 탭 전환 시 상태 초기화
  const handleTab = (type: SearchModalProps['isOpen']) => {
    setIsOpen(type);
    setIsVerified(false);
    setShowIdVerification(false);
    setIsIdSent(false);
    setIsIdVerified(false);
    setShowPasswordVerification(false);
    setIsPasswordSent(false);
    setIsPasswordVerified(false);
    idTimer.stop();
    passwordTimer.stop();
    setIdFormData({ phone: '', verificationCode: '' });
    setPasswordFormData({
      emailOrPhone: '',
      verificationCode: '',
      password: '',
      passwordConfirm: '',
    });
    setFoundEmail(null);
    setFormHeight(null);
  };

  // 아이디 찾기 인증 요청
  const handleIdVerification = useCallback(async () => {
    if (!idFormData.phone) {
      alert('휴대폰 번호를 입력해주세요.');
      return;
    }

    console.log('아이디 찾기 인증 요청', idFormData.phone);

    try {
      const response = await api.post('/send-verification-code', {
        phone: idFormData.phone,
      });

      console.log('아이디 찾기 인증 요청 응답', response);
      setShowIdVerification(true);
      setIsIdSent(true);
      idTimer.start(300); // 5분 = 300초
    } catch (error) {
      console.error('아이디 찾기 인증 요청 오류', error);
    }
  }, [idFormData.phone, idTimer]);

  // 비밀번호 찾기 인증 요청
  const handlePasswordVerification = useCallback(async () => {
    if (!passwordFormData.emailOrPhone) {
      alert('이메일 또는 휴대폰 번호를 입력해주세요.');
      return;
    }

    console.log('비밀번호 찾기 인증 요청', passwordFormData.emailOrPhone);

    try {
      const response = await api.post('/auth/send-verification-code', {
        phone: passwordFormData.emailOrPhone,
      });

      console.log('비밀번호 찾기 인증 요청 응답', response);
      setShowPasswordVerification(true);
      setIsPasswordSent(true);
      passwordTimer.start(300); // 5분 = 300초
    } catch (error) {
      console.error('비밀번호 찾기 인증 요청 오류', error);
    }
  }, [passwordFormData.emailOrPhone, passwordTimer]);

  // 아이디 찾기 인증코드 확인
  const handleIdVerificationCheck = useCallback(() => {
    console.log('아이디 찾기 인증코드 확인', idFormData.verificationCode);
    setIsIdVerified(true);
    setShowIdVerification(false);
  }, [idFormData.verificationCode]);

  // 비밀번호 찾기 인증코드 확인
  const handlePasswordVerificationCheck = useCallback(() => {
    console.log(
      '비밀번호 찾기 인증코드 확인',
      passwordFormData.verificationCode
    );
    setIsPasswordVerified(true);
    setShowPasswordVerification(false);
    setIsVerified(true);
  }, [passwordFormData.verificationCode]);

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
        // const response = await axios.post<any>('/api/find-email', { phone: idFormData.phone });
        // setFoundEmail(response.data.email);
        setFoundEmail('seungwoo');
      } catch (error) {
        alert(`이메일을 찾을 수 없습니다. ${error}`);
      }
    },
    [isIdVerified, idFormData.phone]
  );

  // 로그인하러 가기
  const goToLogin = () => {
    setIsOpen(null);
  };

  return (
    <ModalPortal isOpen={!!isOpen} onClose={() => setIsOpen(null)}>
      <div className="flex items-center justify-center bg-black bg-opacity-30 h-full">
        <div className="bg-white rounded-xl w-[90%] max-w-[450px] p-6 md:p-8 relative">
          {/* 닫기 버튼 */}
          <button
            className="absolute top-4 right-4 text-2xl"
            onClick={() => setIsOpen(null)}
            aria-label="닫기"
          >
            <Image src="/close.png" alt="close" width={24} height={24} />
          </button>

          {/* 탭 */}
          <div className="flex border-b mb-6 relative">
            <button
              className={`flex-1 py-2 text-center text-base font-semibold relative z-10 ${
                isOpen === 'id' ? 'text-midnight-black' : 'text-gray-400'
              }`}
              onClick={() => handleTab('id')}
            >
              이메일 찾기
            </button>
            <button
              className={`flex-1 py-2 text-center text-base font-semibold relative z-10 ${
                isOpen === 'password' ? 'text-midnight-black' : 'text-gray-400'
              }`}
              onClick={() => handleTab('password')}
            >
              비밀번호 찾기
            </button>
            <motion.div
              className="absolute bottom-0 h-0.5 bg-midnight-black"
              initial={false}
              animate={{
                left: isOpen === 'id' ? '0%' : '50%',
                width: '50%',
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
          </div>

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
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </ModalPortal>
  );
}
