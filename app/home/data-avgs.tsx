'use client';

import React, { useEffect, useMemo, useState } from 'react';
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

export function DataAvg() {
  const [index, setIndex] = useState(0);
  const [dataList, setDataList] = useState<DisplayData[]>([]);

  const fallbackMap = useMemo<Record<string, DisplayData>>(
    () => ({
      SKT: { displayCarrier: 'SKT', averagePrice: 1200 },
      KT: { displayCarrier: 'KT', averagePrice: 1100 },
      LG: { displayCarrier: 'LG U+', averagePrice: 950 },
    }),
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const carriers = ['SKT', 'KT', 'LG'];
      const results: DisplayData[] = [];

      for (const carrier of carriers) {
        try {
          const response = await axios.get<{ data: TradeStat }>(
            `https://api.snac-app.com/api/trade-statistics?carrier=${carrier}`
          );

          const { data } = response.data;
          const displayCarrier = data.carrier === 'LG' ? 'LG U+' : data.carrier;

          results.push({
            displayCarrier,
            averagePrice: data.avgPricePerGb,
          });
        } catch (error) {
          console.warn(`${carrier} 불러오기 실패 → fallback 사용`, error);
          results.push(fallbackMap[carrier]);
        }
      }

      if (results.length > 0) {
        setDataList(results);
      }
    };

    fetchData();
  }, [fallbackMap]);

  useEffect(() => {
    if (dataList.length === 0) return;

    const intervalId = setInterval(() => {
      setIndex((i) => (i + 1) % dataList.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [dataList]);

  if (dataList.length === 0) return null;

  const current = dataList[index];

  return (
    <div className="text-center h-[161px] md:h-[288px] py-[40px] md:py-[80px]">
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

      <p className="text-regular-lg md:text-medium-3xl font-bold pt-[28px]">
        평균{' '}
        <span className="inline-block w-[50px] md:w-[80px] text-teal-green text-right">
          <AnimatePresence mode="wait">
            <motion.span
              key={current.averagePrice}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ ease: 'easeInOut', duration: 0.3 }}
              className="inline-block"
            >
              {current.averagePrice.toLocaleString()}
            </motion.span>
          </AnimatePresence>
        </span>
        원에 거래되고 있어요
      </p>
    </div>
  );
}

export default DataAvg;
