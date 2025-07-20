'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedTabContentProps {
  children: React.ReactNode;
  key: string;
}

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
