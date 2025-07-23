interface GenerateQueryParamsOptions {
  category?: string | null;
  transactionStatus?: string | null;
  priceRanges: string[];
  sortBy?: string;
  page?: number;
  size?: number;
}

export function generateQueryParams({
  category,
  transactionStatus,
  priceRanges,
  sortBy,
  page = 1,
  size = 54,
}: GenerateQueryParamsOptions): string {
  const params = new URLSearchParams();

  if (category) params.append('cardCategory', category);
  if (transactionStatus) params.append('sellStatusFilter', transactionStatus);
  if (sortBy) params.append('sortBy', sortBy);
  if (page) params.append('page', page.toString());
  if (size) params.append('size', size.toString());

  if (priceRanges.length > 0 && !priceRanges.includes('모든 가격')) {
    const parsedRanges = priceRanges
      .map((range) => {
        if (range === '₩ 0 - 999') return '0-999';
        if (range === '₩ 1,000 - 1,499') return '1000-1499';
        if (range === '₩ 1,500 - 1,999') return '1500-1999';
        if (range === '₩ 2,000 - 2,499') return '2000-2499';
        if (range === '₩ 2,500+') return '2500-';
        return '';
      })
      .filter(Boolean)
      .join(',');

    params.append('priceRanges', parsedRanges);
  }

  return params.toString();
}
