'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Lock,
  Newspaper,
  Zap,
  Clock,
  CreditCard,
  ShieldCheck,
  Users,
  ArrowLeft,
  ArrowRight,
  LogIn, // LogIn 아이콘 import
} from 'lucide-react';

// --- 타입 정의 ---
interface BaseSlide {
  title: string;
}

interface HeroSlide extends BaseSlide {
  type: 'hero';
  description: string;
}

interface CoreValue {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface CoreValuesSlide extends BaseSlide {
  type: 'coreValues';
  values: CoreValue[];
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesSlide extends BaseSlide {
  type: 'features';
  features: Feature[];
}

interface TradeStyle {
  icon: React.ReactNode;
  title: string;
  description: string;
  visual: string;
}

interface TradeStylesSlide extends BaseSlide {
  type: 'tradeStyles';
  styles: TradeStyle[];
}

type Slide = HeroSlide | CoreValuesSlide | FeaturesSlide | TradeStylesSlide;

// --- 슬라이드 데이터 ---
const slides: Slide[] = [
  {
    type: 'hero',
    title: '데이터 거래의\n새로운 차원, SNAC',
    description:
      '개인정보 걱정 없이 통신사 데이터를 가장 쉽고 안전하게 거래하는 방법.',
  },
  {
    type: 'coreValues',
    title: 'SNAC의 핵심 약속',
    values: [
      {
        icon: <ShieldCheck size={48} className="text-teal-green" />,
        title: '완벽한 익명성 보장',
        description: '개인정보 노출 없이 데이터를 사고팔 수 있습니다.',
      },
      {
        icon: <Users size={48} className="text-teal-green" />,
        title: '신속한 실시간 매칭',
        description: 'AI가 최적의 거래 상대를 즉시 찾아 연결합니다.',
      },
    ],
  },
  {
    type: 'features',
    title: '거래를 위한 모든 기능',
    features: [
      {
        icon: <LogIn size={32} />, // 아이콘 수정
        title: '간편 로그인',
        description: 'SNS 계정으로 1초 만에 시작',
      },
      {
        icon: <Newspaper size={32} />,
        title: '블로그',
        description: ' 최신 리포트 제공',
      },
      {
        icon: <CreditCard size={32} />,
        title: '안전 결제 & 포인트',
        description: '토스페이먼츠로 안전하게',
      },
    ],
  },
  {
    type: 'tradeStyles',
    title: '당신에게 맞는 거래 방식',
    styles: [
      {
        icon: <Zap size={32} className="text-yellow-400" />,
        title: '실시간 거래',
        description: '게임처럼 빠르고 짜릿하게',
        visual: '/potato-look.png',
      },
      {
        icon: <Clock size={32} className="text-emerald-400" />,
        title: '일반 거래',
        description: '게시판처럼 익숙하고 안정적으로',
        visual: '/LGU+.svg',
      },
    ],
  },
];

// --- 메인 배너 컴포넌트 ---
export default function Banner() {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = useCallback((newDirection: number) => {
    setPage((current) => [current[0] + newDirection, newDirection]);
  }, []);

  // 자동 슬라이드 기능
  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [page, paginate]);

  const slideIndex = ((page % slides.length) + slides.length) % slides.length;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="relative flex h-[70vh] min-h-[500px] w-full flex-col items-center justify-center overflow-hidden bg-gray-100 p-4 dark:bg-gray-900 shadow-light">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = Math.abs(offset.x) * velocity.x;
            if (swipe < -10000) {
              paginate(1);
            } else if (swipe > 10000) {
              paginate(-1);
            }
          }}
          className="absolute flex h-full w-full items-center justify-center"
        >
          <SlideContent slide={slides[slideIndex]} />
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-1/2 z-20 flex w-full justify-between px-4 md:px-10">
        <button
          onClick={() => paginate(-1)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/50 text-gray-800 backdrop-blur-sm hover:bg-white/80 dark:bg-black/30 dark:text-white dark:hover:bg-black/50"
          aria-label="Previous slide"
        >
          <ArrowLeft />
        </button>
        <button
          onClick={() => paginate(1)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/50 text-gray-800 backdrop-blur-sm hover:bg-white/80 dark:bg-black/30 dark:text-white dark:hover:bg-black/50"
          aria-label="Next slide"
        >
          <ArrowRight />
        </button>
      </div>

      <div className="absolute bottom-8 z-20 flex space-x-2">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setPage([i, i > slideIndex ? 1 : -1])}
            className={`h-2 w-2 rounded-full cursor-pointer transition-all duration-300 ${
              slideIndex === i ? 'w-6 bg-teal-green' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

interface SlideContentProps {
  slide: Slide;
}

// --- 슬라이드 내용 컴포넌트 ---
const SlideContent = ({ slide }: SlideContentProps) => {
  switch (slide.type) {
    case 'hero':
      return (
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            {slide.title.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-lg leading-8 text-gray-600 dark:text-gray-300">
            {slide.description}
          </p>
        </div>
      );
    case 'coreValues':
      return (
        <div className="w-full max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-12">
            {slide.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {slide.values.map((value) => (
              <div
                key={value.title}
                className="flex flex-col items-center p-8 bg-white/50 dark:bg-gray-800/50 rounded-2xl shadow-light"
              >
                {value.icon}
                <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                  {value.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    case 'features':
      return (
        <div className="w-full max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-12">
            {slide.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {slide.features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl shadow-light"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-green to-emerald-600 text-white shadow-light">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    case 'tradeStyles':
      return (
        <div className="w-full max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-12">
            {slide.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {slide.styles.map((style) => (
              <div
                key={style.title}
                className="flex flex-col items-center p-8 bg-white/50 dark:bg-gray-800/50 rounded-2xl shadow-light"
              >
                {style.icon}
                <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                  {style.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {style.description}
                </p>
                <div className="mt-4 relative h-24 w-24">
                  <Image
                    src={style.visual}
                    alt={style.title}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
};
