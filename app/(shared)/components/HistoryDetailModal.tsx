'use client';

import type { HistoryDetailModalProps } from '../types/history-detail-modal';

/**
 * @author 이승우
 * @description 거래 내역 상세 모달 컴포넌트{@link HistoryDetailModalProps(open, onClose, item, type)}
 * @param {boolean} open 모달 열림 상태
 * @param {Function} onClose 모달 닫기 함수
 * @param {HistoryItem} item 거래 내역 데이터
 * @param {string} type 거래 유형 (구매/판매)
 */
export default function HistoryDetailModal({
  open,
  onClose,
  item,
  type,
}: HistoryDetailModalProps) {
  if (!open || !item) return null;

  const isCompleted = item.status === 'completed';
  const isInProgress =
    type === 'purchase'
      ? item.status === 'purchasing'
      : item.status === 'selling';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {type === 'purchase' ? '구매' : '판매'} 상세 정보
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 내용 */}
        <div className="p-4 space-y-4">
          {/* 기본 정보 */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold text-lg">T</span>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">{item.date}</div>
              <div className="font-semibold text-gray-900 mb-1">
                {item.title}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-white text-xs px-2 py-1 rounded ${
                    isCompleted
                      ? 'bg-black'
                      : type === 'purchase'
                        ? 'bg-red-500'
                        : 'bg-green-500'
                  }`}
                >
                  {isCompleted
                    ? '거래완료'
                    : type === 'purchase'
                      ? '구매요청'
                      : '판매중'}
                </span>
                <span className="text-gray-900">
                  {item.price.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>

          {/* 거래 정보 */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="text-sm text-gray-600">
              거래번호: {item.transactionNumber || '#0123_45678'}
            </div>
            <div className="text-sm text-gray-600">
              거래금액: {item.price.toLocaleString()}원
            </div>
          </div>

          {/* 진행 단계 */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">진행 단계</h3>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    isInProgress
                      ? 'bg-black text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  1
                </div>
                <div
                  className={`text-xs mt-1 ${
                    isInProgress
                      ? 'text-black font-medium underline'
                      : 'text-gray-500'
                  }`}
                >
                  {type === 'purchase' ? '구매요청' : '판매요청'}
                </div>
              </div>
              <div className="w-full h-0.5 bg-gray-300" />
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs font-medium">
                  2
                </div>
                <div className="text-xs mt-1 text-gray-500">
                  {type === 'purchase' ? '송신완료' : '수신완료'}
                </div>
              </div>
              <div className="w-full h-0.5 bg-gray-300" />
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs font-medium">
                  3
                </div>
                <div className="text-xs mt-1 text-gray-500">
                  {type === 'purchase' ? '수신완료' : '송신완료'}
                </div>
              </div>
              <div className="w-full h-0.5 bg-gray-300" />
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    isCompleted
                      ? 'bg-black text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  4
                </div>
                <div
                  className={`text-xs mt-1 ${
                    isCompleted
                      ? 'text-black font-medium underline'
                      : 'text-gray-500'
                  }`}
                >
                  거래완료
                </div>
              </div>
            </div>
          </div>

          {/* 진행 중인 거래인 경우에만 추가 정보 표시 */}
          {isInProgress && (
            <div className="space-y-3">
              <div className="text-green-600 text-sm">
                {type === 'purchase' ? '구매' : '판매'}요청이 접수되었습니다.
              </div>
              <div className="text-gray-700 text-sm">
                아래 번호로{' '}
                <a
                  href={
                    item.carrier === 'SKT'
                      ? 'https://www.tworld.co.kr/web/myt-data/giftdata?menuNm=T+끼리+데이터+선물'
                      : item.carrier === 'KT'
                        ? 'https://www.kt.com/mypage/benefit/data-gift'
                        : item.carrier === 'LGU+'
                          ? 'https://www.lguplus.co.kr/mypage/benefit/data-gift'
                          : 'https://www.tworld.co.kr/web/myt-data/giftdata?menuNm=T+끼리+데이터+선물'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {item.carrier || 'SKT'}
                </a>
                통신사의 데이터{item.dataAmount || '2GB'}를 전송해주세요
              </div>

              {/* 전화번호 표시 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  전화번호
                </label>
                <div className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-base font-semibold text-gray-900">
                  {item.phoneNumber || '010-0000-0000'}
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-2">
                <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                  전송완료
                </button>
                <button className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                  전송실패
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
