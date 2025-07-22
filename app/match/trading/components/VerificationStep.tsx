'use client';

import React, { useState } from 'react';

interface VerificationStepProps {
  dataAmount: number;
  timeLeft: number;
  onNext: () => void;
}

export default function VerificationStep({
  dataAmount,
  timeLeft,
  onNext,
}: VerificationStepProps) {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleRatingHover = (value: number) => {
    setHoveredRating(value);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">거래 확인</h2>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">✓</span>
            </div>
            <h3 className="font-semibold text-green-800">전송 완료!</h3>
          </div>
          <p className="text-green-700 text-sm">
            {dataAmount}GB 데이터가 성공적으로 전송되었습니다.
          </p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">전송 내역</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>전송량:</span>
              <span className="font-medium">{dataAmount}GB</span>
            </div>
            <div className="flex justify-between">
              <span>전송 시간:</span>
              <span className="font-medium">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>잔여 시간:</span>
              <span className="font-medium text-orange-600">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">거래 평가</h4>
          <div className="flex items-center space-x-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => handleRatingHover(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="text-3xl transition-colors hover:scale-110 transform"
              >
                <span
                  className={
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }
                >
                  ⭐
                </span>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            {rating === 5 && '매우 만족'}
            {rating === 4 && '만족'}
            {rating === 3 && '보통'}
            {rating === 2 && '불만족'}
            {rating === 1 && '매우 불만족'}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 text-lg">🎉</span>
            <div>
              <div className="font-medium text-blue-800">거래 완료!</div>
              <div className="text-sm text-blue-700 mt-1">
                성공적인 거래를 완료하셨습니다. 포인트와 경험치가 지급됩니다.
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          거래 완료
        </button>
      </div>
    </div>
  );
}
