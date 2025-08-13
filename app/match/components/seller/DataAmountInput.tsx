'use client';

import React, { useState, useEffect } from 'react';

interface DataAmountInputProps {
  value: number; // GB 단위로 저장
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function DataAmountInput({
  value,
  onChange,
  disabled = false,
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
    if (disabled) return;
    setIsCustomInput(false);
    onChange(amount);
  };

  // 직접 입력 모드 활성화
  const handleCustomInputToggle = () => {
    if (disabled) return;
    setIsCustomInput(!isCustomInput);
  };

  // 입력 값 변경
  const handleInputChange = (newValue: string) => {
    if (disabled) return;
    setInputValue(newValue);
    const numValue = parseFloat(newValue) || 0;
    const gbValue = unit === 'GB' ? numValue : numValue / 1000;
    onChange(gbValue);
  };

  // 단위 변경
  const handleUnitChange = (newUnit: 'GB' | 'MB') => {
    if (disabled) return;
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
      <h3 className={`text-lg md:text-2xl font-medium text-primary-foreground`}>데이터량</h3>

      {!isCustomInput ? (
        <div className="space-y-3">
          {/* 빠른 선택 버튼들 */}
          <div className="grid grid-cols-2 gap-2">
            {quickOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleQuickSelect(option.value)}
                disabled={disabled}
                className={`px-3 py-3 text-sm rounded-lg border transition-all ${
                  disabled
                    ? 'bg-muted text-muted-foreground border-border cursor-not-allowed'
                    : Math.abs(value - option.value) < 0.01
                      ? 'bg-card text-card-foreground border-white'
                      : 'bg-transparent text-primary-foreground border-gray-400 hover:border-white hover:bg-card hover:bg-opacity-10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {/* 직접 입력 버튼
          <button
            onClick={handleCustomInputToggle}
            className="w-full py-3 text-sm border border-dashed border-gray-400 text-muted-foreground rounded-lg hover:border-white hover:text-primary-foreground transition-all"
          >
            + 직접 입력하기
          </button> */}
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
              disabled={disabled}
              className={`flex-1 px-3 py-3 border rounded-lg transition-all ${
                disabled
                  ? 'bg-muted text-muted-foreground border-border cursor-not-allowed'
                  : 'bg-card text-primary-foreground border-border focus:ring-2 focus:ring-green-500 focus:border-transparent'
              }`}
              placeholder="데이터량 입력"
            />

            {/* 단위 선택 버튼 */}
            <div
              className={`flex rounded-lg overflow-hidden ${disabled ? 'bg-muted' : 'bg-muted'}`}
            >
              <button
                onClick={() => handleUnitChange('GB')}
                disabled={disabled}
                className={`px-4 py-3 text-sm font-medium transition-all ${
                  disabled
                    ? 'text-muted-foreground cursor-not-allowed'
                    : unit === 'GB'
                      ? 'bg-green-600 text-primary-foreground'
                      : 'text-muted-foreground hover:text-primary-foreground hover:bg-muted'
                }`}
              >
                GB
              </button>
              <button
                onClick={() => handleUnitChange('MB')}
                disabled={disabled}
                className={`px-4 py-3 text-sm font-medium transition-all ${
                  disabled
                    ? 'text-muted-foreground cursor-not-allowed'
                    : unit === 'MB'
                      ? 'bg-green-600 text-primary-foreground'
                      : 'text-muted-foreground hover:text-primary-foreground hover:bg-muted'
                }`}
              >
                MB
              </button>
            </div>
          </div>

          {/* 현재 값 표시 */}
          <div
            className={`text-xs text-center ${disabled ? 'text-muted-foreground' : 'text-muted-foreground'}`}
          >
            {unit === 'GB'
              ? `${parseFloat(inputValue) || 0}GB`
              : `${parseFloat(inputValue) || 0}MB (${((parseFloat(inputValue) || 0) / 1000).toFixed(2)}GB)`}
          </div>

          {/* 빠른 선택으로 돌아가기 */}
          <button
            onClick={handleCustomInputToggle}
            disabled={disabled}
            className={`w-full py-2 text-xs transition-colors ${
              disabled
                ? 'text-muted-foreground cursor-not-allowed'
                : 'text-muted-foreground hover:text-muted-foreground'
            }`}
          >
            빠른 선택으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}
