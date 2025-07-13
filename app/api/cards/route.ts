import { NextResponse } from 'next/server';

// 임시 데이터
const CARD_DATA = [
  {
    id: 1,
    title: 'SKT 데이터 1GB',
    imageUrl: '/SKT.svg',
    price: 1200,
    isNew: true,
    statusLabel: '현재 접속 중',
    statusIndicator: 'green',
  },
  {
    id: 2,
    title: 'KT 데이터 500MB',
    imageUrl: '/KT.svg',
    isNew: true,
    price: 700,
  },
  {
    id: 3,
    title: 'LG U+ 데이터 2GB',
    imageUrl: '/LGU+.svg',
    price: 2100,
  },
  {
    id: 4,
    title: 'SKT 데이터 1GB',
    imageUrl: '/SKT.svg',
    price: 1200,
    isNew: true,
    statusLabel: '현재 접속 중',
    statusIndicator: 'green',
  },
  {
    id: 5,
    title: 'KT 데이터 500MB',
    imageUrl: '/KT.svg',
    isNew: true,
    price: 700,
  },
  {
    id: 6,
    title: 'LG U+ 데이터 2GB',
    imageUrl: '/LGU+.svg',
    price: 2100,
  },
  {
    id: 7,
    title: 'SKT 데이터 1GB',
    imageUrl: '/SKT.svg',
    price: 1200,
    isNew: true,
    statusLabel: '현재 접속 중',
    statusIndicator: 'green',
  },
  {
    id: 8,
    title: 'KT 데이터 500MB',
    imageUrl: '/KT.svg',
    price: 700,
  },
  {
    id: 9,
    title: 'LG U+ 데이터 2GB',
    imageUrl: '/LGU+.svg',
    price: 2100,
  },
  {
    id: 10,
    title: 'SKT 데이터 1GB',
    imageUrl: '/SKT.svg',
    price: 1200,
    isNew: true,
    statusLabel: '현재 접속 중',
    statusIndicator: 'green',
  },
  {
    id: 11,
    title: 'KT 데이터 500MB',
    imageUrl: '/KT.svg',
    price: 700,
  },
  {
    id: 12,
    title: 'LG U+ 데이터 2GB',
    imageUrl: '/LGU+.svg',
    price: 2100,
    isNew: true,
    statusLabel: '현재 접속 중',
    statusIndicator: 'green',
  },
];

export async function GET() {
  return NextResponse.json(CARD_DATA);
}
