'use client';
import React, { useState } from 'react';
import Image from 'next/image';

/**
 * @author 이승우
 * @description 거래 후기 컴포넌트
 */
export default function Accordion() {
  const [open, setOpen] = useState(false);
  return (
    <section className="bg-white border border-gray-200 rounded-lg mb-8 px-8 py-6">
      <button
        className="w-full flex justify-between items-center py-6 text-lg font-bold text-black focus:outline-none hover:bg-gray-50 transition-colors px-0"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        거래 후기
        <span className={`transition-transform ${open ? 'rotate-90' : ''}`}>
          <Image
            src="/chevron-down.svg"
            alt="펼치기/접기"
            width={24}
            height={24}
            className="inline-block -rotate-90"
          />
        </span>
      </button>
      {open && (
        <div className="pt-4 text-base text-gray-700 bg-gray-50 border-t border-gray-100">
          거래 후기가 여기에 표시됩니다.
        </div>
      )}
    </section>
  );
}
