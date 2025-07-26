'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { TabNavigationProps } from '../types';

/**
 * 탭 네비게이션 컴포넌트
 * @author 이승우
 * @description 탭 네비게이션 컴포넌트{@link TabNavigationProps(tabs, activeTab, onTabChange, className, activeTextColor, inactiveTextColor, underlineColor)}
 * @param {Tab[]} tabs - 탭 목록
 * @param {string} activeTab - 현재 활성화된 탭 ID
 * @param {Function} onTabChange - 탭 변경 핸들러
 * @param {string} className - 추가 클래스 이름
 * @param {string} activeTextColor - 활성 탭 텍스트 색상
 * @param {string} inactiveTextColor - 비활성 탭 텍스트 색상
 * @param {string} underlineColor - 밑줄 색상
 */
export default function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  activeTextColor = 'text-midnight-black',
  inactiveTextColor = 'text-gray-400',
  underlineColor = 'bg-midnight-black',
}: TabNavigationProps) {
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const tabWidth = 100 / tabs.length;

  return (
    <div className={`flex border-b mb-6 relative ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex-1 py-3 text-center text-base font-semibold relative z-10 ${
            activeTab === tab.id ? activeTextColor : inactiveTextColor
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
      <motion.div
        className={`absolute bottom-0 h-0.5 ${underlineColor}`}
        initial={false}
        animate={{
          left: `${activeIndex * tabWidth}%`,
          width: `${tabWidth}%`,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
    </div>
  );
}
