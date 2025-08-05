'use client';

import React from 'react';

interface CreateButtonProps {
  onClick: () => void;
}

export function CreateButton({ onClick }: CreateButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-br from-burst-lime to-[#38CB89] px-5 py-3 text-sm font-bold text-white shadow-lg transition-opacity duration-300 ease-in-out hover:brightness-95 focus:outline-none md:hidden"
      aria-label="거래 등록"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>

      <span>거래 등록</span>
    </button>
  );
}
