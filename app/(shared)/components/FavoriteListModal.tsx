import ModalPortal from './modal-portal';
import React from 'react';

interface FavoriteListModalProps {
  open: boolean;
  onClose: () => void;
  favorites: string[];
}

export default function FavoriteListModal({
  open,
  onClose,
  favorites,
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
            {favorites.map((name, idx) => (
              <button
                key={idx}
                className="w-full text-gray-800 text-base py-2 rounded-lg border border-gray-200 hover:bg-green-50 transition-colors text-left px-3"
                onClick={() => alert(`${name} 클릭!`)}
                type="button"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
