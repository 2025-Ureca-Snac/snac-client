'use client';

import React from 'react';
import PlusIcon from '@/public/plus.svg';

interface CreateButtonProps {
  onClick: () => void;
}

export function CreateButton({ onClick }: CreateButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex items-center  rounded-full bg-gradient-to-br from-burst-lime to-[#38CB89] px-3 py-2 text-sm font-bold text-white shadow-lg transition-opacity duration-300 ease-in-out hover:brightness-95 focus:outline-none md:hidden"
      aria-label="거래 등록"
    >
      <PlusIcon />
      <span>거래 등록</span>
    </button>
  );
}
