'use client';

import React, { useRef, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  MotionValue,
} from 'framer-motion';
import Image from 'next/image';
import {
  Newspaper,
  Zap,
  Clock,
  CreditCard,
  ShieldCheck,
  Users,
  TrendingUp,
} from 'lucide-react';

// --- 파티클 컴포넌트 ---
interface ParticleProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  i: number;
}

const Particle = ({ mouseX, mouseY, i }: ParticleProps) => {
  const size = Math.random() * 3 + 1;
  const x = useTransform(
    mouseX,
    [0, typeof window !== 'undefined' ? window.innerWidth : 0],
    [
      Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 0),
      Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 0) -
        50 * (i % 5),
    ]
  );
  const y = useTransform(
    mouseY,
    [0, typeof window !== 'undefined' ? window.innerHeight : 0],
    [
      Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 0),
      Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 0) -
        50 * (i % 5),
    ]
  );
  return (
    <motion.div
      className="absolute rounded-full bg-lime-400/50"
      style={{
        width: size,
        height: size,
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        x,
        y,
      }}
      transition={{ type: 'spring', stiffness: 50, damping: 20 }}
    />
  );
};

// --- 파티클 배경 컴포넌트 ---
const ParticleBackground = () => {
  const mouseX = useMotionValue(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 0
  );
  const mouseY = useMotionValue(
    typeof window !== 'undefined' ? window.innerHeight / 2 : 0
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 z-0">
      {[...Array(30)].map((_, i) => (
        <Particle key={i} mouseX={mouseX} mouseY={mouseY} i={i} />
      ))}
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

// --- 주요 기능 카드 컴포넌트 (Bento 그리드 용) ---
const FeatureCard = ({
  icon,
  title,
  description,
  className = '',
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.5 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03, y: -5 }}
      className={`relative h-full rounded-3xl bg-white/50 p-8 shadow-light dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 backdrop-blur-md overflow-hidden ${className}`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-green to-emerald-600 text-white shadow-light">
        {icon}
      </div>
      <h3 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-4 text-gray-600 dark:text-gray-400">{description}</p>
    </motion.div>
  );
};

// --- 실시간 거래 시각화 컴포넌트 ---
const RealtimeTradeVisual = () => {
  return (
    <div className="relative flex h-80 w-full items-center justify-around rounded-2xl bg-gray-100 p-4 shadow-light dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.1),transparent_70%)]"></div>
      <div className="absolute inset-0 grid-bg"></div>

      <motion.div
        className="z-10"
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image
          src="/potato-look.png"
          alt="Left Potato"
          width={120}
          height={120}
          className="scale-x-[-1] drop-shadow-lg"
        />
      </motion.div>

      <div className="absolute left-0 top-0 z-0 h-full w-full">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 h-3 w-3 rounded-full "
            initial={{ x: '25%', opacity: 0 }}
            animate={{ x: '75%', opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 2.5,
              delay: i * 0.4,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <motion.div
        className="z-10"
        animate={{ y: [5, -5, 5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image
          src="/potato-look.png"
          alt="Right Potato"
          width={120}
          height={120}
          className=" drop-shadow-lg"
        />
      </motion.div>

      <div className="absolute top-6 left-1/2 -translate-x-1/2 rounded-full bg-black/30 px-4 py-2 text-center backdrop-blur-sm">
        <p className="font-bold text-white">실시간 데이터 매칭</p>
      </div>
    </div>
  );
};

// --- DataItemCard 컴포넌트 ---
interface DataItemCardProps {
  imageUrl: string;
  title: string;
  price: number;
  ratingScore: number;
  delay?: number;
}
const DataItemCard = ({
  imageUrl,
  title,
  price,
  ratingScore,
  delay = 0,
}: DataItemCardProps) => {
  const displayPrice = (
    <span className="inline-flex items-center font-bold">
      <Image
        src="/snac-price.svg"
        alt="스낵 단위 아이콘"
        width={14}
        height={14}
        className="mr-1"
      />
      {price.toLocaleString()}
    </span>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.5 }}
      transition={{ duration: 0.5, delay }}
      className="transition-transform duration-300 hover:scale-[1.05] relative bg-white dark:bg-white  rounded-2xl shadow-light flex flex-col p-4 h-full"
    >
      <div className="relative h-20 w-full my-2">
        <Image src={imageUrl} alt={title} layout="fill" objectFit="contain" />
      </div>

      <div className="flex-grow flex flex-col items-start mt-2">
        <h3 className="font-bold text-gray-900  text-left text-sm md:text-base">
          {title}
        </h3>
        <p className="text-sm text-gray-800  h-6 flex items-center">
          {displayPrice}
        </p>
        <p className="text-xs text-gray-500 ">바삭스코어 {ratingScore}</p>
      </div>

      <div className="flex justify-center mt-4">
        <button className="w-full h-10 bg-gray-900 text-white transition text-sm font-bold border rounded-lg flex items-center justify-center">
          구매하기
        </button>
      </div>
    </motion.div>
  );
};

// --- 메인 소개 컴포넌트 ---
export default function Introduction() {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  const text1Scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.5]);
  const text1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1, 0]);
  const text1Y = useTransform(scrollYProgress, [0, 0.3], ['0%', '-100%']);

  const snacScale = useTransform(scrollYProgress, [0.6, 1], [0.7, 20]);
  const snacOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.4, 0.7, 0.9],
    [0, 1, 1, 0]
  );
  const snacY = useTransform(scrollYProgress, [0.1, 0.7], ['50%', '0%']);

  const tradeItems = [
    {
      imageUrl: '/SKT.svg',
      title: 'SKT 데이터 1GB',
      price: 1234,
      ratingScore: 300,
    },
    {
      imageUrl: '/KT.svg',
      title: 'KT 데이터 2GB',
      price: 2400,
      ratingScore: 280,
    },
    {
      imageUrl: '/LGU+.png',
      title: 'LGU+ 데이터 500MB',
      price: 600,
      ratingScore: 320,
    },
  ];

  return (
    <div className="bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <style jsx global>{`
        .grid-bg {
          background-image:
            linear-gradient(
              to right,
              rgba(45, 212, 191, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(45, 212, 191, 0.1) 1px,
              transparent 1px
            );
          background-size: 40px 40px;
        }
      `}</style>

      <div ref={scrollRef} className="relative h-[300vh]">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <ParticleBackground />
          <motion.div className="absolute inset-0 z-0 bg-gradient-to-br from-teal-100/10 via-gray-50/10 to-lime-100/10 dark:from-teal-900/10 dark:via-gray-900/10 dark:to-lime-900/10 backdrop-blur-sm" />

          <motion.div
            style={{ scale: text1Scale, opacity: text1Opacity, y: text1Y }}
            className="text-center absolute"
          >
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl md:text-8xl">
              데이터 거래의 <br />
              <span className="bg-gradient-to-r from-teal-green via-emerald-500 to-lime-400 bg-clip-text text-transparent">
                새로운 차원
              </span>
            </h1>
          </motion.div>

          <motion.div
            style={{ opacity: snacOpacity, scale: snacScale, y: snacY }}
            className="absolute flex flex-col items-center"
          >
            <h2 className="text-8xl md:text-9xl font-extrabold text-teal-green bg-gradient-to-r from-teal-400 to-lime-400 bg-clip-text text-transparent">
              SNAC
            </h2>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 bg-gray-50 dark:bg-gray-900 -mt-[1px]">
        <section className="py-24 sm:py-32 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ amount: 0.5 }}
              transition={{ staggerChildren: 0.2 }}
              className="text-center mb-16"
            >
              <motion.h2
                variants={{
                  offscreen: { y: 20, opacity: 0 },
                  onscreen: { y: 0, opacity: 1 },
                }}
                className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
              >
                SNAC의 약속
              </motion.h2>
              <motion.p
                variants={{
                  offscreen: { y: 20, opacity: 0 },
                  onscreen: { y: 0, opacity: 1 },
                }}
                className="mt-4 text-lg text-gray-600 dark:text-gray-400"
              >
                우리는 거래의 모든 순간에 사용자의 안전과 편의를 최우선으로
                생각합니다.
              </motion.p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
              {[
                {
                  icon: <ShieldCheck className="w-12 h-12 text-teal-green" />,
                  title: '완벽한 익명성 보장',
                  desc: '개인정보를 공개하지 않고 필요한 데이터를 사고팔 수 있습니다.',
                },
                {
                  icon: <Users className="w-12 h-12 text-teal-green" />,
                  title: '신속한 실시간 매칭',
                  desc: '시스템이 최적의 거래 상대를 즉시 찾아 연결합니다.',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.5 }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                  className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-light border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    {item.icon}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-gray-600 dark:text-gray-400">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32 px-4 bg-gray-100 dark:bg-black/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ amount: 0.5 }}
              className="text-center mb-16"
            >
              <motion.h2
                variants={{
                  offscreen: { y: 20, opacity: 0 },
                  onscreen: { y: 0, opacity: 1 },
                }}
                className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
              >
                당신의 거래를 위한 모든 것
              </motion.h2>
              <motion.p
                variants={{
                  offscreen: { y: 20, opacity: 0 },
                  onscreen: { y: 0, opacity: 1, transition: { delay: 0.1 } },
                }}
                className="mt-4 text-lg text-gray-600 dark:text-gray-400"
              >
                SNAC은 데이터 거래에 필요한 모든 기능을 갖추고 있습니다.
              </motion.p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FeatureCard
                className="md:col-span-2"
                icon={<Newspaper size={32} />}
                title="블로그"
                description="최신 트렌드와 팁을 만나보세요."
              />
              <FeatureCard
                className="md:col-span-2"
                icon={<CreditCard size={32} />}
                title="안전 결제 & 포인트"
                description="토스페이먼츠로 안전하게 결제하고, 거래에 사용할 수 있는 포인트로 충전하세요."
              />
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ amount: 0.5 }}
              className="text-center mb-16"
            >
              <motion.h2
                variants={{
                  offscreen: { y: 20, opacity: 0 },
                  onscreen: { y: 0, opacity: 1 },
                }}
                className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
              >
                두 가지 거래 방식, 당신의 선택은?
              </motion.h2>
              <motion.p
                variants={{
                  offscreen: { y: 20, opacity: 0 },
                  onscreen: { y: 0, opacity: 1, transition: { delay: 0.1 } },
                }}
                className="mt-4 text-lg text-gray-600 dark:text-gray-400"
              >
                빠르고 짜릿한 실시간 거래와 안정적인 일반 거래 중 원하는 방식을
                선택하세요.
              </motion.p>
            </motion.div>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ amount: 0.5 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col"
              >
                <div className="flex items-center mb-4">
                  <Zap className="text-yellow-400 mr-3" size={32} />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    실시간 거래
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  게임처럼 직관적인 UI로 거래의 재미를 느껴보세요. 실시간 알림과
                  동적인 화면 변화로 거래에 몰입할 수 있습니다.
                </p>
                <RealtimeTradeVisual />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ amount: 0.5 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col"
              >
                <div className="flex items-center mb-4">
                  <Clock className="text-emerald-400 mr-3" size={32} />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    일반 거래
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  시간적 여유가 있다면, 익숙한 게시판 형태의 거래 페이지에서
                  안정적으로 거래를 진행할 수 있습니다.
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {tradeItems.map((item, i) => (
                    <DataItemCard key={i} {...item} delay={i * 0.1} />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32 px-4 bg-gray-100 dark:bg-black/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ amount: 0.5 }}
              className="text-center mb-16"
            >
              <motion.h2
                variants={{
                  offscreen: { y: 20, opacity: 0 },
                  onscreen: { y: 0, opacity: 1 },
                }}
                className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
              >
                SNAC 포인트만의 특별한 혜택
              </motion.h2>
              <motion.p
                variants={{
                  offscreen: { y: 20, opacity: 0 },
                  onscreen: { y: 0, opacity: 1, transition: { delay: 0.1 } },
                }}
                className="mt-4 text-lg text-gray-600 dark:text-gray-400"
              >
                포인트는 현금으로 환전할 수 없지만, SNAC 생태계 안에서 더 큰
                가치를 가집니다.
              </motion.p>
            </motion.div>
            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.5 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xl bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-light border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <TrendingUp className="w-12 h-12 text-teal-green" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      거래 수수료 할인
                    </h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      포인트를 사용하여 거래 시 발생하는 수수료를 할인받을 수
                      있습니다.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
