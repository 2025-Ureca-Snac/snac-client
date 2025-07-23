'use client';

import React, { useState, useEffect } from 'react';

interface DataAmountInputProps {
  value: number; // GB 단위로 저장
  onChange: (value: number) => void;
}

export default function DataAmountInput({
  value,
  onChange,
}: DataAmountInputProps) {
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [inputValue, setInputValue] = useState('1');
  const [unit, setUnit] = useState<'GB' | 'MB'>('GB');

  // value가 변경될 때 내부 상태 업데이트
  useEffect(() => {
    if (value >= 1) {
      setUnit('GB');
      setInputValue(value.toString());
    } else {
      setUnit('MB');
      setInputValue((value * 1000).toString());
    }
  }, [value]);

  // 빠른 선택 버튼 클릭
  const handleQuickSelect = (amount: number) => {
    setIsCustomInput(false);
    onChange(amount);
  };

  // 직접 입력 모드 활성화
  const handleCustomInputToggle = () => {
    setIsCustomInput(!isCustomInput);
  };

  // 입력 값 변경
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    const numValue = parseFloat(newValue) || 0;
    const gbValue = unit === 'GB' ? numValue : numValue / 1000;
    onChange(gbValue);
  };

  // 단위 변경
  const handleUnitChange = (newUnit: 'GB' | 'MB') => {
    setUnit(newUnit);
    const currentValue = parseFloat(inputValue) || 0;

    if (newUnit === 'MB' && unit === 'GB') {
      // GB -> MB
      const mbValue = currentValue * 1000;
      setInputValue(mbValue.toString());
      onChange(currentValue); // GB 값 유지
    } else if (newUnit === 'GB' && unit === 'MB') {
      // MB -> GB
      const gbValue = currentValue / 1000;
      setInputValue(gbValue.toString());
      onChange(gbValue);
    }
  };

  // 빠른 선택 옵션들
  const quickOptions = [
    { value: 1, label: '1GB' },
    { value: 2, label: '2GB' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-white">데이터량</h3>

      {!isCustomInput ? (
        <div className="space-y-3">
          {/* 빠른 선택 버튼들 */}
          <div className="grid grid-cols-2 gap-2">
            {quickOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleQuickSelect(option.value)}
                className={`px-3 py-3 text-sm rounded-lg border transition-all ${
                  Math.abs(value - option.value) < 0.01
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white border-gray-400 hover:border-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* 직접 입력 버튼 */}
          <button
            onClick={handleCustomInputToggle}
            className="w-full py-3 text-sm border border-dashed border-gray-400 text-gray-300 rounded-lg hover:border-white hover:text-white transition-all"
          >
            + 직접 입력하기
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* 직접 입력 필드 */}
          <div className="flex items-center space-x-2">
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="10000"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className="flex-1 px-3 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="데이터량 입력"
            />

            {/* 단위 선택 버튼 */}
            <div className="flex bg-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => handleUnitChange('GB')}
                className={`px-4 py-3 text-sm font-medium transition-all ${
                  unit === 'GB'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                GB
              </button>
              <button
                onClick={() => handleUnitChange('MB')}
                className={`px-4 py-3 text-sm font-medium transition-all ${
                  unit === 'MB'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                MB
              </button>
            </div>
          </div>

          {/* 현재 값 표시 */}
          <div className="text-xs text-gray-400 text-center">
            {unit === 'GB'
              ? `${parseFloat(inputValue) || 0}GB`
              : `${parseFloat(inputValue) || 0}MB (${((parseFloat(inputValue) || 0) / 1000).toFixed(2)}GB)`}
          </div>

          {/* 빠른 선택으로 돌아가기 */}
          <button
            onClick={handleCustomInputToggle}
            className="w-full py-2 text-xs text-gray-400 hover:text-gray-200 transition-colors"
          >
            빠른 선택으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}
