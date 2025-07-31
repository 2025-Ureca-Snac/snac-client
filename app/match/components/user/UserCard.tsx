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
      className="flex items-center justify-between p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3 md:space-x-4">
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
    <button
      className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-white text-xs md:text-sm font-medium ${
        type === 'buyer' ? 'bg-green-500' : 'bg-pink-500'
      }`}
    >
      {type === 'buyer' ? '구매자' : '판매자'}
    </button>
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
      <span className="text-midnight-black font-medium text-sm md:text-base">
        {user.name}
      </span>
      <span className="text-gray-500 text-sm md:text-base">|</span>
      <span className="text-midnight-black text-sm md:text-base">
        {user.carrier} | {formatData(user.data)} | {formatPrice(user.price)}
      </span>
    </div>
  );
}

// 유저 아바타
function UserAvatar() {
  return (
    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-amber-600"></div>
  );
}

// 화살표 아이콘
function ArrowIcon() {
  return (
    <svg
      className="w-4 h-4 md:w-5 md:h-5 text-gray-400"
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
