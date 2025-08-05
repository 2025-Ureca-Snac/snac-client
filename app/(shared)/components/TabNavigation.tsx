'use client';
import React, { useState, useRef, useCallback } from 'react';
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
  activeTextColor = 'text-midnight-black dark:text-white',
  inactiveTextColor = 'text-gray-400 dark:text-gray-500',
  underlineColor = 'bg-midnight-black dark:bg-white',
  disableDrag = false,
}: TabNavigationProps) {
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const tabWidth = 100 / tabs.length;

  // 스와이프 관련 상태
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 터치/마우스 이벤트 핸들러
  const handleStart = useCallback(
    (clientX: number) => {
      if (disableDrag) return;
      setIsDragging(true);
      setStartX(clientX);
      setCurrentX(clientX);
    },
    [disableDrag]
  );

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || disableDrag) return;
      setCurrentX(clientX);
    },
    [isDragging, disableDrag]
  );

  const handleEnd = useCallback(() => {
    if (!isDragging || disableDrag) return;

    const deltaX = currentX - startX;
    const threshold = 50; // 스와이프 감지 임계값

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && activeIndex > 0) {
        // 오른쪽으로 스와이프 - 이전 탭
        onTabChange(tabs[activeIndex - 1].id);
      } else if (deltaX < 0 && activeIndex < tabs.length - 1) {
        // 왼쪽으로 스와이프 - 다음 탭
        onTabChange(tabs[activeIndex + 1].id);
      }
    }

    setIsDragging(false);
  }, [
    isDragging,
    currentX,
    startX,
    activeIndex,
    tabs,
    onTabChange,
    disableDrag,
  ]);

  // 터치 이벤트 핸들러
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault(); // 스크롤 방지
      handleStart(e.touches[0].clientX);
    },
    [handleStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDragging) {
        e.preventDefault(); // 스크롤 방지
      }
      handleMove(e.touches[0].clientX);
    },
    [handleMove, isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // 마우스 이벤트 핸들러
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handleStart(e.clientX);
    },
    [handleStart]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      handleMove(e.clientX);
    },
    [handleMove]
  );

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      handleEnd();
    }
  }, [isDragging, handleEnd]);

  return (
    <div
      ref={containerRef}
      className={`flex border-b mb-6 relative ${className} select-none`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          tabIndex={0}
          className={`flex-1 py-3 text-center text-base font-semibold relative z-10    ${
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
          left: isDragging
            ? `${Math.max(0, Math.min((tabs.length - 1) * tabWidth, activeIndex * tabWidth + (currentX - startX) / 10))}%`
            : `${activeIndex * tabWidth}%`,
          width: `${tabWidth}%`,
        }}
        transition={{
          duration: isDragging ? 0 : 0.3,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
