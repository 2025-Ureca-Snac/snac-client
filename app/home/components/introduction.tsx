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
      price: 2100,
      ratingScore: 300,
    },
    {
      imageUrl: '/KT.svg',
      title: 'KT 데이터 2GB',
      price: 2000,
      ratingScore: 280,
    },
    {
      imageUrl: '/LGU+.png',
      title: 'LGU+ 데이터 1GB',
      price: 1900,
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
                className="mb-10 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
              >
                SNAC의 등장
              </motion.h2>
              <motion.p
                variants={{
                  offscreen: { y: 20, opacity: 0 },
                  onscreen: { y: 0, opacity: 1 },
                }}
                className="mt-4 text-lg text-gray-600 dark:text-gray-400"
              >
                중고나라, 당근마켓, 네이버쇼핑 등 주요 거래 플랫폼의 문제점을
                조사했습니다.
                <br />
                실제 300개의 데이터 중 불편사항 20개를 분석한 결과,
                <br />
                <b>18건이 &apos;데이터가 너무 늦게 온다&apos;</b>는 점,{' '}
                <b>2건이 &apos;개인정보 노출이 싫다&apos;</b>는 점이었습니다.
                <br />
                <br />
                SNAC은 이러한 문제를 해결하기 위해 <b>
                  개인정보 보호 거래
                </b>와 <b>실시간 매칭 거래</b>를 핵심 기능으로 삼았습니다.
              </motion.p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
              {[
                {
                  icon: <ShieldCheck className="w-12 h-12 text-teal-green" />,
                  title: '개인정보 보호 거래',
                  desc: '채팅방이 없어 개인정보가 남지않습니다.',
                },
                {
                  icon: <Users className="w-12 h-12 text-teal-green" />,
                  title: '실시간 매칭 거래',
                  desc: '지금 접속 중인 거래 상대와 즉시 안전하게 거래할 수 있습니다.',
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
                SNAC이 해결한 불편함
              </motion.h2>
              <motion.p
                variants={{
                  offscreen: { y: 20, opacity: 0 },
                  onscreen: { y: 0, opacity: 1, transition: { delay: 0.1 } },
                }}
                className="mt-4 text-lg text-gray-600 dark:text-gray-400"
              >
                기존 플랫폼의 <b>계좌번호 노출</b>과 <b>복잡한 결제 과정</b>을
                해결하기 위해
                <br />
                <b>포인트 충전제도</b>와 <b>간편 결제 시스템</b>을 도입했습니다.
                <br />
                또한, 거래에 서툴거나 걱정이 많은 분들을 위해
                <br />
                <b>통신사별 거래 방법과 안전한 거래 팁</b>을 블로그에서
                안내합니다.
              </motion.p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FeatureCard
                className="md:col-span-2"
                icon={<Newspaper size={32} />}
                title="거래 가이드 및 다양한 정보 글"
                description="각 통신사별 거래 방법과 안전하게 거래하는 팁 및 정보를 제공합니다."
              />
              <FeatureCard
                className="md:col-span-2"
                icon={<CreditCard size={32} />}
                title="포인트 충전 & 간편결제"
                description="토스페이먼츠로 간편하게 결제하고, 포인트로 빠르게 거래할 수 있습니다."
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
                급할 땐 즉시 매칭되는 <b>실시간 거래</b>,<br />
                여유가 필요하다면 <b>일반 거래</b>!<br />
                상황에 맞게 원하는 거래 방식을 선택해보세요.
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
                  <b>바로 거래하고 싶을 때,</b> 지금 접속 중인 상대와 즉시
                  매칭하고
                  <br />
                  실시간 알림과 생생한 화면 변화로 거래의 짜릿함을 경험해보세요!
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
                  <b>여유롭게 거래하고 싶을 땐,</b> 거래글을 남기고
                  <br />
                  원하는 시간에 상대를 찾아 안전하게 거래할 수 있어요.
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
                회원가입만 해도 <b>1,000포인트</b> 즉시 지급!
                <br />
                거래할 때마다 <b>10포인트씩</b> 쌓이고,
                <br />
                <b>별도의 거래 수수료 없이</b> 포인트로만 간편하게 거래하세요.
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
                      거래할 때마다 포인트 적립!
                    </h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      거래가 완료될 때마다 <b>10포인트</b>씩 자동으로
                      적립됩니다.
                      <br />
                      SNAC은 <b>거래 수수료가 전혀 없습니다</b>.
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
