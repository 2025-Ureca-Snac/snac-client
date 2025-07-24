import { ProgressStepsProps } from '../types/progress-steps';

/**
 * @author 이승우
 * @description 결제 진행 단계 표시 컴포넌트
 * @params {@link ProgressStepsProps showSnackPayment}: 스낵머니 결제 여부
 */
export default function ProgressSteps({
  showSnackPayment,
}: ProgressStepsProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              showSnackPayment
                ? 'bg-green-500 text-white'
                : 'bg-gray-900 text-white'
            }`}
          >
            {showSnackPayment ? '✓' : '1'}
          </div>
          <span
            className={`ml-2 text-sm font-medium ${
              showSnackPayment ? 'text-green-600' : 'text-gray-900'
            }`}
          >
            구매 정보 확인
          </span>
        </div>
        <div
          className={`w-8 h-0.5 ${showSnackPayment ? 'bg-green-500' : 'bg-gray-300'}`}
        ></div>
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              showSnackPayment
                ? 'bg-gray-900 text-white'
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            2
          </div>
          <span
            className={`ml-2 text-sm font-medium ${
              showSnackPayment ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            결제 하기
          </span>
        </div>
        <div className="w-8 h-0.5 bg-gray-300"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
            3
          </div>
          <span className="ml-2 text-sm font-medium text-gray-500">
            결제 정보 확인
          </span>
        </div>
      </div>
    </div>
  );
}
