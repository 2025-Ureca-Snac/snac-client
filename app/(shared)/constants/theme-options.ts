export const themeOptions = [
  {
    value: 'light',
    label: '라이트 모드',
    colorClass: 'bg-yellow-50 border-yellow-400 font-bold text-yellow-700',
    checkColorClass: 'text-yellow-500',
  },
  {
    value: 'dark',
    label: '다크 모드',
    colorClass: 'bg-gray-900 border-gray-700 font-bold text-white',
    checkColorClass: 'text-white',
  },
  {
    value: 'auto',
    label: '시스템 설정',
    colorClass: 'bg-blue-50 border-blue-400 font-bold text-blue-700',
    checkColorClass: 'text-blue-500',
  },
] as const;
