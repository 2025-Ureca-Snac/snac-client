'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AnimatedTabContentProps } from '../types/animated-tab-content';

/**
 * @author 이승우
 * @description 애니메이션 탭 콘텐츠 컴포넌트
 * @param {React.ReactNode} children 콘텐츠
 * @param {string} tabKey 탭 키
 */
export default function AnimatedTabContent({
  children,
  tabKey,
  slideDirection,
}: AnimatedTabContentProps) {
  const contentVariants = {
    initial: {
      x:
        slideDirection === 'left'
          ? '50%' // 오른쪽에서 시작 (더 가까이)
          : slideDirection === 'right'
            ? '-50%' // 왼쪽에서 시작 (더 가까이)
            : 30,
    },
    animate: { x: 0 },
    exit: {
      x:
        slideDirection === 'left'
          ? '-50%' // 왼쪽으로 나감 (더 가까이)
          : slideDirection === 'right'
            ? '50%' // 오른쪽으로 나감 (더 가까이)
            : -30,
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tabKey}
        variants={contentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
