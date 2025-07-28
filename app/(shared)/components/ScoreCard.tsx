'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ModalPortal from './modal-portal';
import { useUserStore } from '../stores/user-store';
import { useModalStore } from '../stores/modal-store';
import { SNACK_GRADES } from '../constants/snack-grades';

/**
 * @author 이승우
 * @description 스코어 카드 컴포넌트
 */
export default function ScoreCard() {
  const { profile } = useUserStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // 실제 스코어는 API나 store에서 가져와야 함 (현재는 예시)
  const score = profile?.score || 0;
  const maxScore = 500;

  // 현재 등급 계산
  const currentGrade =
    SNACK_GRADES.find((grade) => score >= grade.min && score <= grade.max) ||
    SNACK_GRADES[0];

  // 클릭 외부 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setTooltipOpen(false);
        setIsClicked(false);
      }
    };

    if (isClicked) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isClicked]);

  const handleIconClick = () => {
    setIsClicked(!isClicked);
    setTooltipOpen(!tooltipOpen);
  };

  const handleIconHover = () => {
    setTooltipOpen(true);
  };

  const handleIconLeave = () => {
    if (!isClicked) {
      setTooltipOpen(false);
    }
  };

  return (
    <section className="bg-card border border-border rounded-lg p-8 mb-8">
      {/* User Profile Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <div className="font-bold text-2xl text-foreground">
            {profile?.nickname || '사용자'}
          </div>
          <button
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-2 py-1"
            onClick={() => {
              // 단골 목록 모달 열기
              useModalStore.getState().openModal('favorite-list');
            }}
            aria-label="단골 목록 보기"
          >
            <span className="font-bold text-lg">
              {profile?.favoriteCount || 0}
            </span>
            <span className="text-sm">단골 목록</span>
            <Image
              src="/chevron-down.svg"
              alt="오른쪽 화살표"
              width={20}
              height={20}
              className="inline-block -rotate-90 text-muted-foreground"
            />
          </button>
        </div>
        <div className="text-muted-foreground text-base">
          {profile?.birthDate
            ? new Date(profile.birthDate).toLocaleDateString('ko-KR')
            : '생년월일'}{' '}
          {profile?.phone || '전화번호'}
        </div>
      </div>

      {/* 스낵 포인트 • 머니 Section */}
      <div className="mb-6">
        <button
          className="w-full flex items-center justify-between py-3 border-b border-border hover:bg-muted transition-colors"
          onClick={() => (window.location.href = '/mypage/point')}
        >
          <div className="flex items-center gap-2">
            <span className="text-amber-600 text-lg">🥔</span>
            <span className="text-amber-600 text-sm font-medium">
              스낵 포인트 • 머니
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-foreground text-sm font-medium">
              {/* TODO: 실제 스낵 포인트 API 연동 필요 */}0 포인트
            </span>
            <span className="text-muted-foreground text-sm">
              <Image
                src="/chevron-down.svg"
                alt="오른쪽 화살표"
                width={20}
                height={20}
                className="inline-block -rotate-90 text-muted-foreground"
              />
            </span>
          </div>
        </button>
      </div>

      {/* 바삭 스코어 Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-foreground">
              바삭 스코어
            </span>
            <div className="relative" ref={tooltipRef}>
              <button
                className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                onMouseEnter={handleIconHover}
                onMouseLeave={handleIconLeave}
                onClick={handleIconClick}
                type="button"
              >
                ⓘ
              </button>
              {tooltipOpen && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
                  <div className="bg-card border border-border rounded-lg p-3 shadow-lg w-64">
                    <div className="text-sm text-foreground leading-relaxed">
                      거래 후 후기, 포스팅 횟수 등을 종합해 계산한 스코어입니다.
                    </div>
                    {/* Speech bubble pointer */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-card"></div>
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border absolute top-0 left-1/2 transform -translate-x-1/2 -mt-1"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-6 h-6 bg-yellow-400 rounded-full"></span>
            <span className="font-bold text-xl text-yellow-600">{score}</span>
          </div>
        </div>
        <div className="w-full h-3 bg-muted rounded-full mb-2">
          <div
            className="h-3 bg-yellow-400 rounded-full"
            style={{ width: `${(score / maxScore) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>100</span>
          <span>300</span>
          <span>500</span>
          <span>700</span>
          <span>900</span>
        </div>
      </div>

      {/* 현재 등급 Section */}
      <button
        className="w-full flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-accent transition-colors"
        onClick={() => setModalOpen(true)}
        type="button"
      >
        <div className="flex items-center gap-3">
          <Image
            src={currentGrade.icon}
            alt={currentGrade.name}
            width={24}
            height={24}
          />
          <span className="font-medium text-foreground">
            {currentGrade.name}
          </span>
        </div>
        <span className="text-muted-foreground">
          <Image
            src="/chevron-down.svg"
            alt="오른쪽 화살표"
            width={20}
            height={20}
            className="inline-block -rotate-90 text-muted-foreground"
          />
        </span>
      </button>

      <ModalPortal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={() => setModalOpen(false)}
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-[340px] max-w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-lg">스낵 스코어</span>
              <button
                onClick={() => setModalOpen(false)}
                className="text-2xl text-gray-400 hover:text-gray-600 absolute top-4 right-4"
                aria-label="닫기"
              >
                ×
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {SNACK_GRADES.map((grade) => {
                const isCurrent = score >= grade.min && score <= grade.max;
                return (
                  <div
                    key={grade.name}
                    className={`flex items-center gap-3 rounded-xl px-4 py-2 ${isCurrent ? 'bg-orange-50' : 'bg-white'}`}
                  >
                    <Image
                      src={grade.icon}
                      alt={grade.name}
                      width={24}
                      height={24}
                      className={isCurrent ? 'opacity-100' : 'opacity-60'}
                    />
                    <div>
                      <div
                        className={`font-bold text-base ${isCurrent ? 'text-orange-500' : 'text-gray-900'}`}
                      >
                        {grade.name}
                      </div>
                      <div
                        className={`text-xs ${isCurrent ? 'text-orange-400' : 'text-gray-400'}`}
                      >
                        {grade.range}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ModalPortal>
    </section>
  );
}
