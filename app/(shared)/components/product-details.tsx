import Image from 'next/image';
import { CardData } from '../types/card';

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
  const getCarrierImageUrl = (carrier: string): string => {
    switch (carrier) {
      case 'SKT':
        return '/SKT.png';
      case 'KT':
        return '/KT.png';
      case 'LGU+':
      case 'LG':
        return '/LG.png';
      default:
        return '/SKT.png';
    }
  };

  const formatCarrierName = (carrier: string): string =>
    carrier === 'LG' ? 'LGU+' : carrier;

  const formatDataAmount = (amountInGB: number): string => {
    // 소수점이 있는 경우 MB로 변환
    if (amountInGB % 1 !== 0) {
      const amountInMB = Math.round(amountInGB * 1024);
      return `${amountInMB}MB`;
    }
    // 정수인 경우 GB로 표시
    return `${amountInGB}GB`;
  };

  const displayPrice = cardData?.price;
  const displayCarrier = cardData?.carrier;
  const displayDataAmount = cardData?.dataAmount;

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">상품 정보</h2>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="w-[180px] text-left py-3 px-4 font-medium text-gray-700">
                  상품
                </th>
                <th className="w-[97px] text-left py-3 px-4 font-medium text-gray-700">
                  통신사
                </th>
                <th className="w-[140px] text-left py-3 px-4 font-medium text-gray-700">
                  데이터 용량
                </th>
                <th className="w-[118px] text-left py-3 px-4 font-medium text-gray-700">
                  가격
                </th>
              </tr>
            </thead>
            <tbody>
              {cardData ? (
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded flex items-center justify-center overflow-hidden">
                        <Image
                          src={getCarrierImageUrl(displayCarrier!)}
                          alt={formatCarrierName(displayCarrier!)}
                          width={32}
                          height={32}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">
                          {formatCarrierName(displayCarrier!)} 데이터{' '}
                          {formatDataAmount(displayDataAmount!)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900">
                    {formatCarrierName(displayCarrier!)}
                  </td>
                  <td className="py-4 px-4 text-gray-900">
                    {formatDataAmount(displayDataAmount!)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">
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
                    className="h-[65px] py-4 text-center text-gray-500"
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
