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
            className={`h-5 w-5 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              showSnackPayment
                ? 'bg-green-500 text-white'
                : 'bg-gray-900 dark:bg-gray-600 text-white'
            }`}
          >
            {showSnackPayment ? '✓' : '1'}
          </div>
          <span
            className={`ml-2 text-xs md:text-sm font-medium whitespace-nowrap ${
              showSnackPayment
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-900 dark:text-white'
            }`}
          >
            구매 정보 확인
          </span>
        </div>
        <div
          className={`w-2 md:w-8 h-0.5 ${showSnackPayment ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
        ></div>
        <div className="flex items-center">
          <div
            className={`h-5 w-5 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              showSnackPayment
                ? 'bg-gray-900 dark:bg-gray-600 text-white'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            2
          </div>
          <span
            className={`ml-2 text-xs md:text-sm font-medium whitespace-nowrap ${
              showSnackPayment
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            결제 하기
          </span>
        </div>
        <div className="w-2 md:w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
        <div className="flex items-center">
          <div className="h-5 w-5 md:w-8 md:h-8 bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full flex items-center justify-center text-sm font-medium">
            3
          </div>
          <span className="ml-2 text-xs md:text-sm font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
            결제 정보 확인
          </span>
        </div>
      </div>
    </div>
  );
}
