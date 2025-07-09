import { useState } from 'react';
import Image from 'next/image';

export default function SearchModal({
  setIsOpen,
}: {
  setIsOpen: (isOpen: number) => void;
}) {
  const [searchType, setSearchType] = useState<string>('id');

  const handleSearchType = (type: string) => {
    setSearchType(type);
  };
  return (
    <div className="absolute w-1/2 h-screen flex justify-center items-center bg-gray-300/70">
      <div className="flex justify-center items-center flex-col bg-white w-[70%] h-[70%]">
        <div>
          <div>
            <div
              className="flex justify-end w-[300px]"
              onClick={() => setIsOpen(0)}
            >
              <Image
                src="/close.png"
                alt="close"
                width={24}
                height={24}
                className="cursor-pointer"
              />
            </div>
          </div>
          <div className="flex w-[300px] border-b border-gray-200">
            <button
              onClick={() => handleSearchType('id')}
              className={`flex-1 py-3 text-lg font-semibold transition-colors
                ${
                  searchType === 'id'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                    : 'text-gray-400 border-b-2 border-transparent bg-white'
                }`}
            >
              아이디 찾기
            </button>
            <button
              onClick={() => handleSearchType('password')}
              className={`flex-1 py-3 text-lg font-semibold transition-colors
                ${
                  searchType === 'password'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                    : 'text-gray-400 border-b-2 border-transparent bg-white'
                }`}
            >
              비밀번호 찾기
            </button>
          </div>
        </div>
        {
          <div>
            <div>
              <input
                type="text"
                placeholder={`${searchType === 'id' ? '휴대폰 번호를 입력해주세요' : '이메일 또는 휴대폰 번호를 입력해주세요'}`}
              />
              <button>인증 요청</button>
            </div>
            <div>
              <input type="text" placeholder="인증번호" />
              <button>인증 확인</button>
            </div>
            <button>
              {searchType === 'id' ? '아이디 찾기' : '비밀번호 찾기'}
            </button>
          </div>
        }
      </div>
    </div>
  );
}
