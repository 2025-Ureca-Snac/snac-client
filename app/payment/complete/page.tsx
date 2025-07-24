'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { PAYMENT_TYPES } from '../../(shared)/constants/payment';

/**
 * @author 이승우
 * @description 결제 완료 페이지
 * @params pay: 결제 유형 (buy: 구매, sell: 판매)
 * @params orderId: 주문 번호
 * @params amount: 결제 금액
 * @params snackMoneyUsed: 사용된 스낵 머니
 * @params snackPointsUsed: 사용된 스낵 포인트
 */
export default function PaymentCompletePage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const pay = searchParams.get('pay');
    const snackMoneyUsed = parseInt(searchParams.get('snackMoneyUsed') || '0');
    const snackPointsUsed = parseInt(
      searchParams.get('snackPointsUsed') || '0'
    );

    console.log('결제 완료 페이지 파라미터:', {
      orderId,
      amount,
      pay,
      snackMoneyUsed,
      snackPointsUsed,
    });

    if (orderId && amount) {
      // 결제 완료 확인 API 호출
      const verifyPayment = async () => {
        try {
          // 실제 결제 성공 여부를 확인하는 API 호출
          // const response = await api.get(`/payment/verify?orderId=${orderId}`);
          // const responseData = response.data as Record<string, unknown>;

          // 임시로 성공으로 가정 (실제로는 API 응답에 따라 처리)
          const isPaymentSuccess = true; // responseData.status === 'OK'

          if (isPaymentSuccess) {
            // 결제 성공이 확인된 경우에만 차감
            console.log('결제 성공 확인됨, 차감 처리:', {
              snackMoneyUsed,
              snackPointsUsed,
            });
            // setSnackMoney((prev) => prev - snackMoneyUsed);
            // setSnackPoints((prev) => prev - snackPointsUsed);
          } else {
            console.error('결제 실패 확인됨');
            // 결제 실패 시 처리 (예: 에러 페이지로 리다이렉트)
          }
        } catch (error) {
          console.error('결제 확인 중 오류:', error);
          // 오류 시 처리
        }
      };

      verifyPayment();
    }
  }, [searchParams]);

  const orderId = searchParams.get('orderId') || '#0123_45678';
  const amount = searchParams.get('amount') || '2,000';
  const pay = searchParams.get('pay') || 'sell';
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}년, ${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">결제 완료!</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">
                구매 정보 확인
              </span>
            </div>
            <div className="w-8 h-0.5 bg-green-500"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">
                결제 하기
              </span>
            </div>
            <div className="w-8 h-0.5 bg-gray-900"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900 underline">
                결제 정보 확인
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Box */}
        <div className="bg-white rounded-lg shadow-sm border p-8 max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {pay === PAYMENT_TYPES.BUY
                ? '구매 글이 등록되었습니다!'
                : '구매요청이 전송되었습니다!'}
            </h2>
            <p className="text-gray-600 flex items-center justify-center">
              {pay === PAYMENT_TYPES.BUY
                ? '판매자가 구매요청을 보낼 때까지 기다려주세요.'
                : '판매자가 빠른 시일 내에 데이터를 보내줄 예정입니다.'}
              <span className="ml-2 text-2xl">🎉</span>
            </p>
          </div>

          {/* Product Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">주문 번호:</span>
              <span className="font-medium text-gray-900">{orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">날짜:</span>
              <span className="font-medium text-gray-900">{formattedDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">결제 금액:</span>
              <div className="flex items-center">
                <span className="font-medium text-gray-900">{amount}</span>
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
              <span className="text-gray-600">결제 방법:</span>
              <span className="font-medium text-gray-900">스낵머니</span>
            </div>
          </div>

          {/* History Button */}
          <div className="text-center">
            <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              {pay === PAYMENT_TYPES.BUY ? '구매 내역' : '판매 내역'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
