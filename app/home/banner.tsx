'use client';

// import { Button } from '@/app/(shared)/components/Button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/app/(shared)/utils/api';
import UserConnectionAnimation from './components/userConnectionAnimation';

interface BannerProps {
  avgMinutes?: number;
  avgSeconds?: number;
}

interface TradeDurationResponse {
  data: {
    durationSeconds: number;
  };
  code: string;
  status: string;
  message: string;
  timestamp: string;
}

const formatTime = (time: number) => time.toString().padStart(2, '0');

const DEFAULT_AVG_MINUTES = 0;
const DEFAULT_AVG_SECONDS = 0;

export default function Banner({
  avgMinutes = DEFAULT_AVG_MINUTES,
  avgSeconds = DEFAULT_AVG_SECONDS,
}: BannerProps) {
  const [displayMinutes, setDisplayMinutes] = useState(avgMinutes);
  const [displaySeconds, setDisplaySeconds] = useState(avgSeconds);

  useEffect(() => {
    const fetchTradeDuration = async () => {
      try {
        const response = await api.get('/trade-duration-statistics');
        const data = response.data as TradeDurationResponse;
        const totalSeconds = data.data.durationSeconds;

        // 초를 분과 초로 변환
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        setDisplayMinutes(minutes);
        setDisplaySeconds(seconds);
      } catch (error) {
        console.error('거래 소요 시간 통계 조회 실패:', error);
        // 에러 시 기본값 사용
        setDisplayMinutes(avgMinutes);
        setDisplaySeconds(avgSeconds);
      }
    };

    fetchTradeDuration();
  }, [avgMinutes, avgSeconds]);

  return (
    <section className="bg-black ">
      <div className="flex flex-col md:flex-row items-start">
        <div className="mt-14 md:mt-0 flex-col w-full md:w-1/2 h-[266px] md:h-[532px] relative flex justify-center items-center">
          <UserConnectionAnimation />
          {/* <Image
            src="/potato-lime.png"
            alt="메인 배너 이미지"
            fill
            className="object-contain"
            priority
          /> */}
          <div className="pt-6 pb-2">
            <p className="text-regular-md text-center text-white pb-2">
              평균 거래 완료 시간
            </p>
            {displayMinutes > 0 || displaySeconds > 0 ? (
              <div
                role="timer"
                aria-label="평균 거래 완료 시간"
                className="flex items-center space-x-2 p-4 rounded-xl  via-transparent to-burst-lime/5 relative overflow-hidden"
              >
                {/* 형광 효과 배경 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent  -translate-x-full animate-glow" />

                <div className="flex flex-col items-center relative z-10">
                  <span className="w-[70px] h-[64px] bg-white text-midnight-black dark:text-white text-regular-3xl md:text-heading-xl font-bold px-4 py-2 rounded-lg shadow-lg border-2 border-burst-lime/50 animate-pulse-glow">
                    {formatTime(displayMinutes)}
                  </span>
                  <span className="mt-1 text-regular-xs text-white">분</span>
                </div>
                <span className="text-white text-regular-3xl font-bold pb-5 relative z-10">
                  :
                </span>
                <div className="flex flex-col items-center relative z-10">
                  <span className="bg-white dark:bg-gray-800 w-[70px] h-[64px] text-midnight-black dark:text-white text-regular-3xl font-bold px-4 py-2 rounded-lg shadow-lg border-2 border-burst-lime/50 animate-pulse-glow">
                    {formatTime(displaySeconds)}
                  </span>
                  <span className="mt-1 text-regular-xs text-white">초</span>
                </div>
              </div>
            ) : (
              <div
                role="timer"
                aria-label="평균 거래 완료 시간"
                className="flex items-center space-x-2 p-4 rounded-xl  via-transparent to-burst-lime/5 relative overflow-hidden"
              >
                {/* 형광 효과 배경 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent  -translate-x-full animate-glow" />

                <div className="flex flex-col items-center relative z-10">
                  <span className="bg-white w-[70px] h-[64px]  text-midnight-black text-regular-3xl md:text-heading-xl font-bold px-4 py-2 rounded-lg shadow-lg border-2 border-burst-lime/50 animate-pulse-glow"></span>
                  <span className="mt-1 text-regular-xs text-white">분</span>
                </div>
                <span className="text-white text-regular-3xl font-bold pb-5 relative z-10">
                  :
                </span>
                <div className="flex flex-col items-center relative z-10">
                  <span className="w-[70px] h-[64px] bg-white text-midnight-black text-regular-3xl font-bold px-4 py-2 rounded-lg shadow-lg border-2 border-burst-lime/50 animate-pulse-glow"></span>
                  <span className="mt-1 text-regular-xs text-white">초</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 py-8 px-6 md:pl-10 md:pr-[106px] mt-6 md:mt-16">
          <div className="pt-4">
            <p className="text-heading-sm text-burst-lime">
              실시간 매칭 진행중
            </p>
            <h1 className="text-heading-lg  md:text-medium-4xl text-white py-4">
              지금 접속중인 유저와 <br />
              바로 거래하세요!
            </h1>
            <p className="text-regular-sm md:text-regular-xl text-white">
              1GB부터, 실시간으로 판매자·구매자와 연결됩니다.
              <br /> 놓치지 마세요 – 타이밍이 곧 기회입니다.
            </p>
          </div>

          <div className="pt-6 flex justify-center">
            <Link
              href="/match"
              className="group relative w-full h-[44px] md:h-[52px] px-4 py-2 rounded-xl border-4 border-burst-lime bg-gradient-to-br from-burst-lime/25 via-black/60 to-black/80 backdrop-blur-xl shadow-[0_4px_12px_rgba(152,255,88,0.12)] hover:shadow-[0_6px_16px_rgba(152,255,88,0.2)] hover:scale-[1.02] hover:border-burst-lime active:scale-105 transition-all duration-500 ease-out overflow-hidden z-10
    flex items-center justify-center"
            >
              {/* 호버시 그라데이션 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-burst-lime/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

              {/* 호버 시 연한 배경 */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-burst-lime/10 via-burst-lime/10 to-burst-lime/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <span className="relative z-10 text-white  font-semibold tracking-wide transition-colors duration-300">
                지금 거래하러 가기
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
