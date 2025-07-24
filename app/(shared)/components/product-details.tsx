import Image from 'next/image';
import { ProductDetailsProps } from '../types/product-details';

/**
 * @author 이승우
 * @description 상품 상세 컴포넌트
 * @params {@link ProductDetailsProps}: 상품 상세 컴포넌트 타입
 */
export default function ProductDetails({ productPrice }: ProductDetailsProps) {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">상품 정보</h2>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  상품
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  통신사
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  데이터 용량
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  가격
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">T</span>
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        데이터 1기가
                      </div>
                      <div className="text-sm text-gray-500">
                        최근 접속 시간 5분전
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900">SKT</td>
                <td className="py-4 px-4 text-gray-900">1GB</td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">
                      {productPrice.toLocaleString()}
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
