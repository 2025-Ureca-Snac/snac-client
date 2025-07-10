import { useState, useEffect, useRef } from 'react';

export default function SearchModal({
  setIsOpen,
}: {
  setIsOpen: (isOpen: number) => void;
}) {
  const [searchType, setSearchType] = useState<'id' | 'password'>('id');
  const [isVerified, setIsVerified] = useState(false);
  const [canVerify, setCanVerify] = useState(false); // 인증 확인 버튼 활성화 여부
  const [timer, setTimer] = useState(0); // 남은 시간(초)
  const [canResend, setCanResend] = useState(true); // 인증 요청/재전송 버튼 활성화 여부
  const [resendCooldown, setResendCooldown] = useState(0); // 재전송 쿨타임(초)
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  // 타이머 감소
  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timer]);

  // 1분 쿨타임 감소
  useEffect(() => {
    if (resendCooldown > 0) {
      setCanResend(false);
      cooldownRef.current = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, [resendCooldown]);

  // 탭 전환 시 상태 초기화
  const handleTab = (type: 'id' | 'password') => {
    setSearchType(type);
    setIsVerified(false);
    setCanVerify(false);
    setTimer(0);
    setCanResend(true);
    setResendCooldown(0);
  };

  // 인증 요청/재전송 버튼 클릭
  const handleRequest = () => {
    setCanVerify(true);
    setTimer(300); // 5분
    setResendCooldown(60); // 1분 쿨타임
  };

  // 타이머 포맷
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-xl w-[350px] p-6 relative">
        {/* 닫기 버튼 */}
        <button
          className="absolute top-4 right-4 text-2xl"
          onClick={() => setIsOpen(0)}
          aria-label="닫기"
        >
          ×
        </button>

        {/* 탭 */}
        <div className="flex border-b mb-6">
          <button
            className={`flex-1 py-2 text-center text-base font-semibold ${
              searchType === 'id'
                ? 'text-midnight-black border-b-2 border-midnight-black'
                : 'text-gray-400'
            }`}
            onClick={() => handleTab('id')}
          >
            아이디 찾기
          </button>
          <button
            className={`flex-1 py-2 text-center text-base font-semibold ${
              searchType === 'password'
                ? 'text-midnight-black border-b-2 border-midnight-black'
                : 'text-gray-400'
            }`}
            onClick={() => handleTab('password')}
          >
            비밀번호 찾기
          </button>
        </div>

        {/* 폼 */}
        {searchType === 'id' ? (
          <form className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="휴대폰 번호를 입력해주세요"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none"
              />
              <button
                type="button"
                className="w-24 h-12 rounded-lg bg-midnight-black text-white font-semibold"
              >
                인증 요청
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="인증번호"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none"
              />
              <button
                type="button"
                className="w-24 h-12 rounded-lg bg-midnight-black text-white font-semibold"
              >
                인증 확인
              </button>
            </div>
            <div className="text-right text-xs text-red-500 pr-2">5:00</div>
            <button
              type="submit"
              className="w-full h-12 mt-2 rounded-lg bg-midnight-black text-white font-semibold"
            >
              아이디 찾기
            </button>
          </form>
        ) : (
          <form className="space-y-4">
            {!isVerified && (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="이메일 또는 휴대폰 번호를 입력해주세요"
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    className={`w-24 h-12 rounded-lg font-semibold text-white ${canResend ? 'bg-midnight-black' : 'bg-gray-300 text-gray-400'}`}
                    onClick={handleRequest}
                    disabled={!canResend}
                  >
                    {timer > 0 ? '재전송' : '인증 요청'}
                  </button>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="인증번호"
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    className="w-24 h-12 rounded-lg bg-midnight-black text-white font-semibold disabled:bg-gray-300 disabled:text-gray-400"
                    onClick={() => setIsVerified(true)}
                    disabled={!canVerify}
                  >
                    인증 확인
                  </button>
                </div>
                <div className="text-right text-xs text-red-500 pr-2">
                  {timer > 0 ? formatTime(timer) : '5:00'}
                </div>
              </>
            )}
            {isVerified && (
              <>
                <input
                  type="password"
                  placeholder="비밀번호"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="비밀번호 확인"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none"
                />
              </>
            )}
            <button
              type="submit"
              className="w-full h-12 mt-2 rounded-lg bg-midnight-black text-white font-semibold"
            >
              비밀번호 찾기
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
