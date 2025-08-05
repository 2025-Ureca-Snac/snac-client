'use client';

import Image from 'next/image';
import React from 'react';
import { useMediaQuery } from '@/app/(shared)/hooks/useMediaQuery';

export default function UserConnectionAnimation({ className = '' }) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // 반응형 크기 설정
  const boxW = isDesktop ? 400 : 320;
  const boxH = 120;

  return (
    <div
      className={`relative bg-transparent rounded-2xl flex items-center justify-between px-3 ${className}`}
      style={{
        width: `${boxW}px`,
        height: `${boxH}px`,
      }}
    >
      {/* 왼쪽 감자 */}
      <div
        className="flex items-center justify-center"
        style={{
          width: 100,
          height: 100,
          borderRadius: 26,
          fontSize: 24,
          zIndex: 3,
        }}
      >
        <Image src="/potato-look.png" alt="potato" width={100} height={100} />
      </div>
      {/* 네온 연결선 */}
      <div
        className="absolute"
        style={{
          top: boxH / 2 - 4,
          left: 38,
          width: boxW - 76,
          height: 8,
          borderRadius: 4,
          background:
            'linear-gradient(90deg, #98FF58 30%, #38CB89 70%, #98FF58 100%)',
          boxShadow: '0 0 20px 6px #38CB8980, 0 0 0 4px #98FF5810',
          zIndex: 1,
        }}
      ></div>
      {/* 데이터 구슬 (좌→우 왕복) */}
      <div
        className="absolute"
        style={{
          top: boxH / 2 - 10,
          left: 38,
          width: 20,
          height: 20,
          borderRadius: 10,
          background: '#98FF58',
          boxShadow: '0 0 12px 4px #98FF5877',
          zIndex: 2,
          animation:
            'dotMove 1.8s infinite alternate cubic-bezier(.44,0,.45,1)',
        }}
      ></div>
      {/* 오른쪽 감자 */}
      <div
        className="flex items-center justify-center"
        style={{
          width: 100,
          height: 100,
          zIndex: 2,
        }}
      >
        <Image src="/potato-look.png" alt="potato" width={100} height={100} />
      </div>
      {/* 애니메이션 키프레임 */}
      <style>
        {`
        @keyframes dotMove {
          0% { transform: translateX(0); opacity:1; }
          10% { opacity:1;}
          90% { opacity:1;}
          100% { transform: translateX(${boxW - 76 - 20}px); opacity:1; }
        }
        `}
      </style>
    </div>
  );
}
