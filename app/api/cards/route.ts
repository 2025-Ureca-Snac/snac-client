import { NextResponse } from 'next/server';

// 임시 데이터
const CARD_DATA = [
  {
    id: 1,
    name: 'ijud4282@gmail.com',
    sellStatus: 'SELLING',
    cardCategory: 'SELL',
    carrier: 'SKT',
    dataAmount: 10,
    price: 1500,
    updatedAt: '2025-07-14T16:12:17',
  },
  {
    id: 27,
    name: 'ijud4282@gmail.com',
    sellStatus: 'SOLD_OUT',
    cardCategory: 'SELL',
    carrier: 'SKT',
    dataAmount: 1500,
    price: 11500,
    updatedAt: '2025-07-14T10:00:00',
  },
  {
    id: 21,
    name: 'ijud4282@gmail.com',
    sellStatus: 'SOLD_OUT',
    cardCategory: 'SELL',
    carrier: 'SKT',
    dataAmount: 500,
    price: 6500,
    updatedAt: '2025-07-14T10:00:00',
  },
  {
    id: 15,
    name: 'ijud4282@gmail.com',
    sellStatus: 'SOLD_OUT',
    cardCategory: 'SELL',
    carrier: 'SKT',
    dataAmount: 2000,
    price: 18000,
    updatedAt: '2025-07-14T10:00:00',
  },
  {
    id: 9,
    name: 'ijud4282@gmail.com',
    sellStatus: 'SOLD_OUT',
    cardCategory: 'SELL',
    carrier: 'SKT',
    dataAmount: 500,
    price: 6000,
    updatedAt: '2025-07-14T10:00:00',
  },
  {
    id: 3,
    name: 'ijud4282@gmail.com',
    sellStatus: 'SELLING',
    cardCategory: 'SELL',
    carrier: 'SKT',
    dataAmount: 1000,
    price: 12000,
    updatedAt: '2025-07-14T10:00:00',
  },
];

export async function GET() {
  const response = {
    data: {
      cardResponseList: CARD_DATA,
      hasNext: false,
    },
    code: 'CARD_READ_SUCCESS_200',
    status: 'OK',
    message: '카드 정보를 성공적으로 조회했습니다.',
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
