'use client';

import React from 'react';
import { User } from '../../types';

interface UserCardProps {
  user: User;
  onClick?: (user: User) => void;
}

export default function UserCard({ user, onClick }: UserCardProps) {
  const handleClick = () => {
    onClick?.(user);
  };

  return (
    <div
      className="relative flex items-center justify-between p-3 md:p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg hover:border-cyan-400/50 hover:bg-card/70 transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={handleClick}
    >
      {/* 호버 시 글로우 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* 사이드 글로우 라인 */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-green-400 to-transparent opacity-60"></div>

      <div className="relative flex items-center space-x-3 md:space-x-4 z-10">
        <UserTypeButton type={user.type} />
        <UserInfo user={user} />
      </div>
      <ArrowIcon />
    </div>
  );
}

// 유저 타입 버튼 (구매/판매)
function UserTypeButton({ type }: { type: 'buyer' | 'seller' }) {
  return (
    <div
      className={`relative px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium border transition-all duration-300 ${
        type === 'buyer'
          ? 'bg-green-400/20 border-green-400/50 text-green-400'
          : 'bg-pink-400/20 border-pink-400/50 text-pink-400'
      }`}
    >
      {/* 내부 글로우 */}
      <div
        className={`absolute inset-0 rounded-lg opacity-50 ${
          type === 'buyer' ? 'bg-green-400/10' : 'bg-pink-400/10'
        }`}
      ></div>

      <span className="relative z-10">
        {type === 'buyer' ? '구매자' : '판매자'}
      </span>
    </div>
  );
}

// 유저 정보 표시
function UserInfo({ user }: { user: User }) {
  // 데이터 표시 형식 변환
  const formatData = (data: number) => {
    if (data < 1) {
      return `${data * 1000}MB`;
    }
    return `${data}GB`;
  };

  // 가격 표시 형식 변환
  const formatPrice = (price: number) => {
    return `${price.toLocaleString()}원`;
  };

  return (
    <div className="flex items-center space-x-1 md:space-x-2">
      <UserAvatar />
      <span className="text-primary-foreground font-medium text-sm md:text-base">
        {user.name}
      </span>
      <span className="text-muted-foreground text-sm md:text-base">|</span>
      <span className="text-muted-foreground text-sm md:text-base">
        <span className="text-cyan-400">{user.carrier}</span> |
        <span className="text-green-400 ml-1">{formatData(user.data)}</span> |
        <span className="text-yellow-400 ml-1">{formatPrice(user.price)}</span>
      </span>
    </div>
  );
}

// 유저 아바타
function UserAvatar() {
  return (
    <div className="relative w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border border-amber-400/50">
      {/* 내부 글로우 */}
      <div className="absolute inset-0.5 rounded-full bg-amber-400/20 animate-pulse"></div>
    </div>
  );
}

// 화살표 아이콘
function ArrowIcon() {
  return (
    <svg
      className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:text-cyan-400 transition-colors duration-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}
