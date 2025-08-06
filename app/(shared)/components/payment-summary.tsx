import Image from 'next/image';
import { PaymentSummaryProps } from '../types/payment-summary';
import {
  getMaxUsableSnackPoints,
  getRemainingSnackMoney,
  getRemainingSnackPoints,
} from '../utils/payment-calculations';

/**
 * @author 이승우
 * @description 결제 요약 컴포넌트
 * @params {@link PaymentSummaryProps}: 결제 요약 컴포넌트 타입
 */
export default function PaymentSummary({
  productPrice,
  snackMoney,
  snackPoints,
  snackPointsToUse,
  finalAmount,
  showSnackPayment,
  onSnackPointsChange,
}: PaymentSummaryProps) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">주문 금액</span>
        <div className="flex items-center">
          <span className="font-medium text-gray-900 dark:text-white">
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
      </div>

      {showSnackPayment ? (
        <>
          {/* 스낵 포인트 입력 */}
          <div className="flex justify-between items-center">
            <div>
              <span className="text-gray-600 dark:text-gray-400">
                스낵 포인트
              </span>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                최대{' '}
                {getMaxUsableSnackPoints(
                  snackPoints,
                  productPrice
                ).toLocaleString()}{' '}
                사용 가능
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="number"
                value={snackPointsToUse === 0 ? '' : snackPointsToUse}
                min="0"
                max={getMaxUsableSnackPoints(snackPoints, productPrice)}
                onChange={(e) => {
                  const inputValue = parseInt(e.target.value) || 0;
                  const maxValue = getMaxUsableSnackPoints(
                    snackPoints,
                    productPrice
                  );
                  const clampedValue = Math.min(
                    Math.max(0, inputValue),
                    maxValue
                  );
                  onSnackPointsChange(clampedValue);
                }}
                onBlur={(e) => {
                  const inputValue = parseInt(e.target.value) || 0;
                  const maxValue = getMaxUsableSnackPoints(
                    snackPoints,
                    productPrice
                  );
                  if (inputValue > maxValue) {
                    onSnackPointsChange(maxValue);
                  }
                }}
                className="w-20 text-right border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                placeholder="0"
              />
              <Image
                src="/snac-price.svg"
                alt="스낵"
                width={16}
                height={16}
                className="ml-1"
              />
            </div>
          </div>

          {/* 최종 결제 금액 - 강조 */}
          <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <span className="text-blue-800 dark:text-blue-300 font-semibold">
              최종 결제 금액
            </span>
            <div className="flex items-center">
              <span className="font-bold text-blue-900 dark:text-blue-100 text-lg">
                {finalAmount.toLocaleString()}
              </span>
              <Image
                src="/snac-price.svg"
                alt="스낵"
                width={18}
                height={18}
                className="ml-1"
              />
            </div>
          </div>

          {/* 결제 후 잔액 - 강조 */}
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-green-800 dark:text-green-300 font-semibold">
                결제 후 잔액
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700 dark:text-green-400">
                  스낵 머니
                </span>
                <div className="flex items-center">
                  <span className="font-medium text-green-900 dark:text-green-100">
                    {getRemainingSnackMoney(
                      snackMoney || 0,
                      finalAmount
                    ).toLocaleString()}
                  </span>
                  <Image
                    src="/snac-price.svg"
                    alt="스낵"
                    width={14}
                    height={14}
                    className="ml-1"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700 dark:text-green-400">
                  스낵 포인트
                </span>
                <div className="flex items-center">
                  <span className="font-medium text-green-900 dark:text-green-100">
                    {getRemainingSnackPoints(
                      snackPoints || 0,
                      snackPointsToUse
                    ).toLocaleString()}
                  </span>
                  <Image
                    src="/snac-price.svg"
                    alt="스낵"
                    width={14}
                    height={14}
                    className="ml-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">
              내 스낵머니
            </span>
            <div className="flex items-center">
              <span className="font-medium text-gray-900 dark:text-white">
                {(snackMoney || 0).toLocaleString()}
              </span>
              <Image
                src="/snac-price.svg"
                alt="스낵"
                width={16}
                height={16}
                className="ml-1"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">
              내 스낵포인트
            </span>
            <div className="flex items-center">
              <span className="font-medium text-gray-900 dark:text-white">
                {(snackPoints || 0).toLocaleString()}
              </span>
              <Image
                src="/snac-price.svg"
                alt="스낵"
                width={16}
                height={16}
                className="ml-1"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
