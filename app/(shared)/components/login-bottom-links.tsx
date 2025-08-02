import Link from 'next/link';

/**
 * @author 이승우
 * @description 로그인 하단 링크들 Props
 */
interface LoginBottomLinksProps {
  /** 이메일 찾기 핸들러 */
  onFindEmail: () => void;
  /** 비밀번호 찾기 핸들러 */
  onFindPassword: () => void;
}

/**
 * @author 이승우
 * @description 로그인 하단 링크들 컴포넌트
 */
export default function LoginBottomLinks({
  onFindEmail,
  onFindPassword,
}: LoginBottomLinksProps) {
  return (
    <div className="flex justify-center text-regular-md mb-8">
      <Link
        href="/signUp"
        className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded px-1"
      >
        회원가입
      </Link>
      <span className="mx-4 md:mx-7">|</span>
      <button
        onClick={onFindEmail}
        className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded px-1"
        tabIndex={0}
      >
        이메일 찾기
      </button>
      <span className="mx-4 md:mx-7">|</span>
      <button
        onClick={onFindPassword}
        className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded px-1"
        tabIndex={0}
      >
        비밀번호 찾기
      </button>
    </div>
  );
}
