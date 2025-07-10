import React from 'react';

const actions = [
  { label: '결제 내역', icon: '🧾' },
  { label: '구매 내역', icon: '📦' },
  { label: '신고 내역', icon: '⚠️' },
];

export default function ActionButtons() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex justify-between mb-6">
      {actions.map((action) => (
        <button
          key={action.label}
          className="flex flex-col items-center flex-1 py-2 hover:bg-gray-50 rounded-lg transition"
        >
          <span className="text-2xl mb-1">{action.icon}</span>
          <span className="text-sm font-medium">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
