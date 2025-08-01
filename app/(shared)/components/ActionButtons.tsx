import React from 'react';
import Link from 'next/link';
import { actionButtons } from '../constants/action-buttons';

/**
 * @author 이승우
 * @description 액션 버튼 컴포넌트{@link actionButtons(판매 내역, 구매 내역, 신고 내역)}
 */
export default function ActionButtons() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      <div className="flex justify-between gap-4">
        {actionButtons.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex flex-col items-center flex-1 py-4 rounded-lg hover:bg-muted transition-colors relative focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:bg-muted"
            aria-label={`${action.label} 페이지로 이동`}
          >
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-2">
              <span className="text-xl">{action.icon}</span>
            </div>
            <span className="text-sm font-medium text-foreground text-center">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
