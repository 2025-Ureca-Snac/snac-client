import Image from 'next/image';

import { CardData } from '../types/card';
import { getCarrierImageUrl, formatCarrierName } from '../utils/carrier-utils';

/**
 * @author 이승우
 * @description 상품 상세 컴포넌트
 * @params {@link ProductDetailsProps}: 상품 상세 컴포넌트 타입
 */
export default function ProductDetails({
  cardData,
}: {
  cardData?: CardData | null;
}) {
  const formatDataAmount = (amountInGB: number): string => {
    return `${amountInGB}GB`;
  };

  const displayPrice = cardData?.price;
  const displayCarrier = cardData?.carrier;
  const displayDataAmount = cardData?.dataAmount;

  return (
    <div className="lg:col-span-2">
      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <h2 className="text-sm md:text-lg font-semibold text-card-foreground mb-4">
          상품 정보
        </h2>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-sm md:text-base">
                <th className="max-w-[180px] text-left py-3 whitespace-nowrap px-4 font-medium text-foreground">
                  상품
                </th>
                <th className="w-[97px] text-left py-3 px-4 whitespace-nowrap font-medium text-foreground">
                  통신사
                </th>
                <th className="w-[140px] text-left py-3 px-4 whitespace-nowrap font-medium text-foreground">
                  데이터 용량
                </th>
                <th className="w-[118px] text-left py-3 px-4 whitespace-nowrap font-medium text-foreground">
                  가격
                </th>
              </tr>
            </thead>
            <tbody>
              {cardData ? (
                <tr className="border-b border-border text-sm md:text-base">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="h-6 w-6 md:w-8 md:h-8 rounded flex items-center justify-center overflow-hidden">
                        <Image
                          src={getCarrierImageUrl(cardData.carrier)}
                          alt={formatCarrierName(cardData.carrier)}
                          width={32}
                          height={32}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="ml-3 hidden md:block">
                        <div className="font-medium text-card-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                          {formatCarrierName(displayCarrier!)} 데이터{' '}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-card-foreground">
                    {formatCarrierName(displayCarrier!)}
                  </td>
                  <td className="py-4 px-4 text-card-foreground">
                    {formatDataAmount(displayDataAmount!)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className="font-medium text-card-foreground">
                        {displayPrice!.toLocaleString()}
                      </span>
                      <Image
                        src="/snac-price.svg"
                        alt="스낵"
                        width={16}
                        height={16}
                        className="ml-1"
                      />
                    </div>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="h-[65px] py-4 text-center text-muted-foreground"
                  >
                    상품 정보를 불러오는 중...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
