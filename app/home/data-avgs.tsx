'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import axios from 'axios';

interface TradeStat {
  carrier: string;
  avgPricePerGb: number;
}

interface DisplayData {
  displayCarrier: string;
  averagePrice: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const CARRIERS = ['SKT', 'KT', 'LG'] as const;

const FALLBACK_MAP: Record<string, DisplayData> = {
  SKT: { displayCarrier: 'SKT', averagePrice: 1200 },
  KT: { displayCarrier: 'KT', averagePrice: 1100 },
  LG: { displayCarrier: 'LG U+', averagePrice: 950 },
};

export function DataAvg() {
  const [index, setIndex] = useState(0);
  const [dataList, setDataList] = useState<DisplayData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const promises = CARRIERS.map(async (carrier) => {
        try {
          const response = await axios.get<{ data: TradeStat }>(
            `${API_BASE_URL}/trade-statistics?carrier=${carrier}`
          );
          const { data } = response.data;
          const displayCarrier = data.carrier === 'LG' ? 'LG U+' : data.carrier;

          return {
            displayCarrier,
            averagePrice: data.avgPricePerGb,
          };
        } catch (error) {
          console.warn(`${carrier} 불러오기 실패 → fallback 사용`, error);
          return FALLBACK_MAP[carrier];
        }
      });

      const results = await Promise.all(promises);
      setDataList(results);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (dataList.length === 0) return;

    const intervalId = setInterval(() => {
      setIndex((i) => (i + 1) % dataList.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [dataList]);

  const current = dataList[index] || FALLBACK_MAP.SKT;

  return (
    <div className="text-center h-[120px] md:h-[240px] py-[20px] md:py-[60px]">
      <h2 className="flex items-center justify-center gap-2">
        <div className="relative w-[24px] h-[24px] md:w-[44px] md:h-[44px]">
          <Image
            src="/telecom.svg"
            alt="통신사 아이콘"
            fill
            className="object-contain"
          />
        </div>

        <div className="w-[60px] md:w-[105px] text-right">
          <AnimatePresence mode="wait">
            <motion.span
              key={current.displayCarrier}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ ease: 'easeInOut' }}
              className="text-teal-green text-regular-xl md:text-medium-4xl font-bold inline-block"
            >
              {current.displayCarrier}
            </motion.span>
          </AnimatePresence>
        </div>

        <span className="text-regular-xl md:text-medium-4xl font-bold">
          데이터를 찾고 계신가요?
        </span>
      </h2>

      <p className="text-regular-lg md:text-medium-3xl font-bold pt-[10px]">
        평균{' '}
        <span className="inline-block min-w-[80px] md:min-w-[100px] text-teal-green text-right">
          <AnimatePresence mode="wait">
            <motion.span
              key={current.averagePrice}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ ease: 'easeInOut', duration: 0.3 }}
              className="inline-block"
            >
              {Math.floor(current.averagePrice).toLocaleString()}
            </motion.span>
          </AnimatePresence>
        </span>
        원에 거래되고 있어요
      </p>
    </div>
  );
}

export default DataAvg;
