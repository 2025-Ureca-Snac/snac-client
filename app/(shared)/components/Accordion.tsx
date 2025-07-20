'use client';
import React, { useState } from 'react';

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
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          ▼
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
