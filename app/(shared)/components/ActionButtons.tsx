import React from 'react';
import Link from 'next/link';
import { actionButtons } from '../constants/action-buttons';

/**
 * @author 이승우
 * @description 액션 버튼 컴포넌트{@link actionButtons(판매 내역, 구매 내역, 신고 내역)}
 */
export default function ActionButtons() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <div className="flex justify-between gap-4">
        {actionButtons.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex flex-col items-center flex-1 py-4 rounded-lg hover:bg-gray-50 transition-colors relative"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-xl">{action.icon}</span>
              </div>
              {action.hasNotification && (
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white z-10"
                  style={{
                    display: 'block',
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#ef4444',
                    borderRadius: '50%',
                    border: '2px solid white',
                    zIndex: 10,
                  }}
                ></div>
              )}
            </div>
            <span className="text-sm font-medium text-gray-800 text-center">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
