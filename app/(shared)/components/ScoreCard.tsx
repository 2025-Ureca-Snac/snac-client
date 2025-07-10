'use client';
import React, { useState } from 'react';

export default function ScoreCard() {
  const [open, setOpen] = useState(false);
  const score = 185;
  const maxScore = 500;
  return (
    <section className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-base">바삭 스코어</span>
        <span className="font-bold text-lg text-yellow-600 flex items-center gap-1">
          <span className="inline-block w-5 h-5 bg-yellow-400 rounded-full" />
          {score}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full mb-2">
        <div
          className="h-2 bg-yellow-400 rounded-full transition-all"
          style={{ width: `${(score / maxScore) * 100}%` }}
        />
      </div>
      <button
        className="flex items-center gap-2 text-sm text-gray-700 mt-2"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <span className="inline-block w-5 h-5 bg-yellow-400 rounded-full" />
        세부 스낵이
        <span
          className={`transform transition-transform ${open ? 'rotate-180' : ''}`}
        >
          ▼
        </span>
      </button>
      {open && (
        <div className="mt-2 text-sm text-gray-600 bg-gray-50 rounded p-3">
          세부 스낵이 내용이 들어갑니다.
        </div>
      )}
    </section>
  );
}
