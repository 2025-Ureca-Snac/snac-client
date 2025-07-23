import React from 'react';
import Image from 'next/image';
import { settings } from '../constants/settings-data';
import type { SettingListProps } from '../types/setting-list';

/**
 * @author 이승우
 * @description 설정 목록 컴포넌트{@link SettingListProps(onItemClick)}
 * @param {Function} onItemClick 아이템 클릭 함수
 */
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
            <Image
              src="/chevron-down.svg"
              alt="오른쪽 화살표"
              width={24}
              height={24}
              className="inline-block -rotate-90 text-gray-300"
            />
          </button>
        </li>
      ))}
    </ul>
  );
}
