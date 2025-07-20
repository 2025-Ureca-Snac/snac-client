// app/api/cards/scroll/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const mockCards = [
  {
    id: 1,
    name: 'ijud4282@gmail.com',
    sellStatus: 'SELLING',
    cardCategory: 'SELL',
    carrier: 'SKT',
    dataAmount: 10,
    price: 1500,
    updatedAt: '2025-07-14T16:12:17',
    createdAt: '2025-07-14T16:12:17',
    email: 'ijud4282@gmail.com',
  },
  {
    id: 2,
    name: 'user2@example.com',
    sellStatus: 'SOLD_OUT',
    cardCategory: 'SELL',
    carrier: 'KT',
    dataAmount: 5,
    price: 800,
    updatedAt: '2025-07-15T10:00:00',
    createdAt: '2025-07-15T10:00:00',
    email: 'user2@example.com',
  },
  {
    id: 3,
    name: 'buyer01@example.com',
    sellStatus: 'BUYING',
    cardCategory: 'BUY',
    carrier: 'LGU+',
    dataAmount: 20,
    price: 3000,
    updatedAt: '2025-07-16T09:30:00',
    createdAt: '2025-07-16T09:30:00',
    email: 'buyer01@example.com',
  },
];

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = url.searchParams;
  const cardCategory = params.get('cardCategory');
  const sellStatusFilter = params.get('sellStatusFilter');
  const priceRange = params.get('priceRanges');
  const highRatingFirst = params.get('highRatingFirst') === 'true';
  const size = parseInt(params.get('size') ?? '10', 10);
  const lastId = parseInt(params.get('lastCardId') ?? '0', 10);

  let list = mockCards.filter((c) => c.id > lastId);

  if (cardCategory === 'BUY' || cardCategory === 'SELL') {
    list = list.filter((c) => c.cardCategory === cardCategory);
  }

  if (sellStatusFilter === 'SELLING' || sellStatusFilter === 'SOLD_OUT') {
    list = list.filter((c) => c.sellStatus === sellStatusFilter);
  }

  if (highRatingFirst) {
    list = list.sort((a, b) => b.price - a.price);
  } else {
    list = list.sort((a, b) => a.price - b.price);
  }

  const page = list.slice(0, size);
  const hasNext = list.length > size;

  return NextResponse.json({
    code: 'CARD_READ_SUCCESS_200',
    status: 'OK',
    message: '카드를 스크롤 방식으로 조회했습니다.',
    data: { cardResponseList: page, hasNext },
    timestamp: new Date().toISOString(),
  });
}

//TODO: 스크롤 방식 -> 숫자 표시로 변경했기에 백엔등한테 말해서 다시 수정하기
