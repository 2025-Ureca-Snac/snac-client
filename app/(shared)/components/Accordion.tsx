'use client';
import React, { useState } from 'react';

export default function Accordion() {
  const [open, setOpen] = useState(false);
  return (
    <section className="bg-white rounded-xl shadow-sm mb-6">
      <button
        className="w-full flex justify-between items-center px-6 py-4 text-base font-semibold text-gray-900 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        거래 후기
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {open && (
        <div className="px-6 pb-4 text-sm text-gray-700">
          거래 후기가 여기에 표시됩니다.
        </div>
      )}
    </section>
  );
}
