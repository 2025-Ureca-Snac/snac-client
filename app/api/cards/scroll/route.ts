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
  const priceRanges = params.get('priceRanges');
  const sortBy = params.get('sortBy');
  const size = parseInt(params.get('size') ?? '10', 10);
  const page = parseInt(params.get('page') ?? '1', 10);

  let list = [...mockCards];

  if (cardCategory === 'BUY' || cardCategory === 'SELL') {
    list = list.filter((c) => c.cardCategory === cardCategory);
  }

  if (sellStatusFilter === 'SELLING' || sellStatusFilter === 'SOLD_OUT') {
    list = list.filter((c) => c.sellStatus === sellStatusFilter);
  }

  if (priceRanges) {
    const parsedRanges = priceRanges.split(',').map((range) => {
      const [minStr, maxStr] = range.split('-');
      const min = Number(minStr);
      const max = maxStr ? Number(maxStr) : Infinity;
      return { min, max };
    });

    list = list.filter((item) =>
      parsedRanges.some(
        ({ min, max }) => item.price >= min && item.price <= max
      )
    );
  }

  if (sortBy === 'priceDesc') {
    list = list.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'priceAsc') {
    list = list.sort((a, b) => a.price - b.price);
  }

  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const pageList = list.slice(startIndex, endIndex);
  const totalCount = list.length;
  const hasNext = endIndex < totalCount;

  return NextResponse.json({
    code: 'CARD_READ_SUCCESS_200',
    status: 'OK',
    message: '카드를 페이지 방식으로 조회했습니다.',
    data: {
      cardResponseList: pageList,
      page,
      size,
      hasNext,
      totalCount,
    },
    timestamp: new Date().toISOString(),
  });
}
