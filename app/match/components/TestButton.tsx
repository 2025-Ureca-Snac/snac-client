'use client';

import { User } from '../types/match';

interface TestButtonProps {
  onTestModal: (seller: User) => void;
}

export default function TestButton({ onTestModal }: TestButtonProps) {
  const handleTestModal = () => {
    // 임시 테스트 판매자 데이터 생성
    const testSeller: User = {
      tradeId: 999,
      type: 'seller',
      cardId: 999,
      name: 'Test Seller',
      carrier: 'SKT',
      data: 1,
      price: 1500,
      rating: 4.5,
      transactionCount: 0,
    };
    onTestModal(testSeller);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={handleTestModal}
        className="bg-blue-600 text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
      >
        🔧 모달 테스트
      </button>
    </div>
  );
}
