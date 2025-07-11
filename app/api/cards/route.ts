import { NextResponse } from 'next/server';

// 임시 데이터
const cardData = [
  {
    title: 'SKT 데이터 1GB',
    imageUrl: '/SKT.svg',
    price: 1200,
    isNew: true,
    statusLabel: '현재 접속 중',
    statusIndicator: 'green',
  },
  { title: 'KT 데이터 500MB', imageUrl: '/KT.svg', isNew: true, price: 700 },
  { title: 'LG U+ 데이터 2GB', imageUrl: '/LGU+.svg', price: 2100 },
  {
    title: 'SKT 데이터 1GB',
    imageUrl: '/SKT.svg',
    price: 1200,
    isNew: true,
    statusLabel: '현재 접속 중',
    statusIndicator: 'green',
  },
  { title: 'KT 데이터 500MB', imageUrl: '/KT.svg', isNew: true, price: 700 },
  { title: 'LG U+ 데이터 2GB', imageUrl: '/LGU+.svg', price: 2100 },
  {
    title: 'SKT 데이터 1GB',
    imageUrl: '/SKT.svg',
    price: 1200,
    isNew: true,
    statusLabel: '현재 접속 중',
    statusIndicator: 'green',
  },
  { title: 'KT 데이터 500MB', imageUrl: '/KT.svg', price: 700 },
  { title: 'LG U+ 데이터 2GB', imageUrl: '/LGU+.svg', price: 2100 },
  {
    title: 'SKT 데이터 1GB',
    imageUrl: '/SKT.svg',
    price: 1200,
    isNew: true,
    statusLabel: '현재 접속 중',
    statusIndicator: 'green',
  },
  { title: 'KT 데이터 500MB', imageUrl: '/KT.svg', price: 700 },
  {
    title: 'LG U+ 데이터 2GB',
    imageUrl: '/LGU+.svg',
    price: 2100,
    isNew: true,
    statusLabel: '현재 접속 중',
    statusIndicator: 'green',
  },
];

export async function GET() {
  return NextResponse.json(cardData);
}
