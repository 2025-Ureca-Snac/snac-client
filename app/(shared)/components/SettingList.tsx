import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { settings } from '../constants/settings-data';
import type { SettingListProps } from '../types/setting-list';

/**
 * @author 이승우
 * @description 설정 목록 컴포넌트{@link SettingListProps(onItemClick)}
 * @param {Function} onItemClick 아이템 클릭 함수
 */
export default function SettingList({ onItemClick }: SettingListProps) {
  return (
    <ul className="bg-card border border-border rounded-lg divide-y divide-border overflow-hidden px-0 py-0">
      {settings.map((item) => (
        <li key={item}>
          <button
            className="w-full flex justify-between items-center py-6 px-8 text-lg font-bold text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:bg-muted"
            onClick={() => onItemClick?.(item)}
            aria-label={`${item} 설정으로 이동`}
          >
            {item}
            <Image
              src="/chevron-down.svg"
              alt="오른쪽 화살표"
              width={24}
              height={24}
              className="inline-block -rotate-90 text-muted-foreground"
            />
          </button>
        </li>
      ))}
    </ul>
  );
}
