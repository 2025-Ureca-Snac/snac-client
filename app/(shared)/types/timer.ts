/**
 * @author 이승우
 * @description 타이머 훅 반환 타입
 * @interface TimerReturn
 * @property {number} time 현재 타이머 시간 (초 단위)
 * @property {Function} start 타이머 시작 함수 (초 단위로 설정)
 * @property {Function} stop 타이머 정지 함수
 */
export interface TimerReturn {
  time: number;
  start: (seconds: number) => void;
  stop: () => void;
}
