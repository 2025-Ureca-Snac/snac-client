'use client';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

interface DataAvgProps {
  providers: string[];
  averagePrice: number;
}

export function DataAvg({ providers, averagePrice }: DataAvgProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => setIndex((i) => i + 1), 3000);
    return () => clearInterval(intervalId);
  }, [providers.length]);

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

        <div className="w-[60px] md:w-[105px] ">
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ ease: 'easeInOut' }}
              className="text-teal-green text-regular-xl md:text-medium-4xl font-bold inline-block"
            >
              {providers[index % providers.length]}
            </motion.span>
          </AnimatePresence>
        </div>

        <span className="text-regular-xl md:text-medium-4xl font-bold">
          데이터를 찾고 계신가요?
        </span>
      </h2>
      <p className="text-regular-lg md:text-medium-3xl font-bold pt-[28px]">
        평균
        <span className="text-teal-green ">
          {averagePrice.toLocaleString()}
        </span>
        원에 거래되고 있어요
      </p>
    </div>
  );
}

export default DataAvg;
