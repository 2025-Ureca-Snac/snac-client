import Link from 'next/link';

/**
 * @author 이승우
 * @description 회원가입 헤더 컴포넌트
 */
export default function SignUpHeader() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-black mb-4">회원가입</h1>
      <p className="text-gray-600">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="text-blue-600 hover:text-blue-800">
          로그인
        </Link>
      </p>
    </div>
  );
}
