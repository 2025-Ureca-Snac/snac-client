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
    <div className="border-t border-border pt-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground text-muted-foreground">
          주문 금액
        </span>
        <div className="flex items-center">
          <span className="font-medium text-card-foreground">
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
              <span className="text-muted-foreground text-muted-foreground">
                스낵 포인트
              </span>
              <div className="text-xs text-muted-foreground mt-1">
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
                className="w-20 text-right border border-border rounded px-2 py-1 text-sm bg-card text-card-foreground focus:ring-2 focus:ring-primary focus:border-primary"
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
          <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
            <span className="text-primary font-semibold">최종 결제 금액</span>
            <div className="flex items-center">
              <span className="font-bold text-primary text-lg">
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
          <div className="p-3 bg-secondary rounded-lg border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-foreground font-semibold">
                결제 후 잔액
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">스낵 머니</span>
                <div className="flex items-center">
                  <span className="font-medium text-foreground">
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
                <span className="text-sm text-muted-foreground">
                  스낵 포인트
                </span>
                <div className="flex items-center">
                  <span className="font-medium text-foreground">
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
            <span className="text-muted-foreground text-muted-foreground">
              내 스낵머니
            </span>
            <div className="flex items-center">
              <span className="font-medium text-card-foreground">
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
            <span className="text-muted-foreground text-muted-foreground">
              내 스낵포인트
            </span>
            <div className="flex items-center">
              <span className="font-medium text-card-foreground">
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
