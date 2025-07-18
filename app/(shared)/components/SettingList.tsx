import React from 'react';

const settings = [
  '비밀번호 변경',
  '번호 변경',
  '닉네임 변경',
  '소셜 로그인 연동',
  '화면 테마',
  '서비스 가이드',
  '개인정보 처리방침',
];

interface SettingListProps {
  onItemClick?: (item: string) => void;
}

export default function SettingList({ onItemClick }: SettingListProps) {
  return (
    <ul className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-hidden px-0 py-0">
      {settings.map((item) => (
        <li key={item}>
          <button
            className="w-full flex justify-between items-center py-6 px-8 text-lg font-bold text-gray-800 hover:bg-gray-50 transition-colors focus:outline-none"
            onClick={() => onItemClick?.(item)}
          >
            {item}
            <span className="text-gray-300">▶</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
