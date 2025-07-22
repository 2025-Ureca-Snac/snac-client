'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AnimatedTabContentProps } from '../types/animated-tab-content';

/**
 * @author 이승우
 * @description 애니메이션 탭 콘텐츠 컴포넌트
 * @param {React.ReactNode} children 콘텐츠
 * @param {string} key 키
 */
export default function AnimatedTabContent({
  children,
  key,
}: AnimatedTabContentProps) {
  const contentVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        variants={contentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
