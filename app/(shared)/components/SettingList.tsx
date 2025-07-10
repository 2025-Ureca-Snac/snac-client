import React from 'react';

const settings = [
  '비밀번호 변경',
  '닉네임 변경',
  '화면 테마',
  '서비스 가이드',
  '개인정보 처리방침',
];

export default function SettingList() {
  return (
    <ul className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
      {settings.map((item) => (
        <li key={item}>
          <button className="w-full flex justify-between items-center px-6 py-4 text-base text-gray-800 hover:bg-gray-50">
            {item}
            <span className="text-gray-400">▶</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
