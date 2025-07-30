import ModalPortal from './modal-portal';
import React from 'react';
import type { FavoriteListModalProps } from '../types/favorite-list-modal';

/**
 * @author 이승우
 * @description 단골 목록 모달 컴포넌트{@link FavoriteListModalProps(open, onClose, favorites)}
 * @param {boolean} open 모달 열림 상태
 * @param {Function} onClose 모달 닫기 함수
 * @param {string[]} favorites 단골 목록
 */
export default function FavoriteListModal({
  open,
  onClose,
  favorites,
  onDelete,
}: FavoriteListModalProps) {
  return (
    <ModalPortal isOpen={open} onClose={onClose}>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
        onClick={onClose}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
      >
        <div
          className="bg-white rounded-2xl shadow-xl w-[370px] max-w-full pt-6 pb-8 px-6 relative flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 상단 아이콘 */}
          <div className="flex flex-col items-center -mt-12 mb-2">
            <div
              className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2 border-4 border-white shadow"
              style={{ marginTop: '-32px' }}
            >
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#D1FADF" />
                <path
                  d="M12 7v4l2 2"
                  stroke="#16B364"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#16B364"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="text-xl font-extrabold text-black text-center">
              단골 목록
            </div>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-gray-600"
              aria-label="닫기"
            >
              ×
            </button>
          </div>
          <div className="w-full text-left mb-2 text-gray-700">
            <span className="font-semibold">
              사람 <span className="font-bold">{favorites.length}</span>명
            </span>
          </div>
          <div className="w-full max-h-64 overflow-y-auto flex flex-col gap-1">
            {favorites.length > 0 ? (
              favorites.map((favorite) => (
                <div
                  key={favorite.memberId}
                  className="w-full text-gray-800 text-base py-3 rounded-lg border border-gray-200 hover:bg-green-50 transition-colors px-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm">
                        {favorite.nickname.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium">{favorite.nickname}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">
                      #{favorite.memberId}
                    </span>
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(favorite.memberId, favorite.nickname);
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors p-1 rounded"
                        aria-label={`${favorite.nickname} 삭제`}
                      >
                        <svg
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                          <path
                            fillRule="evenodd"
                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full py-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                      fill="#9CA3AF"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  단골이 없습니다
                </h3>
                <p className="text-gray-600">
                  자주 거래하는 사용자를 단골로 등록해보세요!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
