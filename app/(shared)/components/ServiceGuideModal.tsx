import React from 'react';
import ModalPortal from './modal-portal';

interface ServiceGuideModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ServiceGuideModal({
  open,
  onClose,
}: ServiceGuideModalProps) {
  return (
    <ModalPortal isOpen={open} onClose={onClose}>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
        onClick={onClose}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
      >
        <div
          className="bg-white rounded-2xl shadow-xl w-[420px] max-w-full pt-6 pb-8 px-6 relative flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 타이틀 및 닫기 */}
          <div className="w-full flex items-center justify-center mb-2 relative">
            <div className="text-2xl font-bold text-black text-center w-full">
              서비스 가이드
            </div>
            <button
              onClick={onClose}
              type="button"
              className="absolute right-0 top-1 text-2xl text-gray-400 hover:text-gray-600"
              aria-label="닫기"
            >
              ×
            </button>
          </div>
          <div className="w-full text-center text-gray-700 mb-4 text-base">
            통신사별 데이터 쿠폰 거래 시 꼭 알아두세요
          </div>
          <div className="w-full text-left text-gray-900 text-[15px] flex flex-col gap-5 max-h-[500px] overflow-y-auto pr-2">
            <div>
              <div className="font-bold text-lg mb-1">SKT (SK텔레콤)</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  유효기간: 쿠폰 발행일로부터 2년 이내 등록, 등록 후 1년까지
                  사용 가능
                </li>
                <li>
                  양도/환불: 등록(PIN 입력) 전까지만 타인에게 양도 가능, 등록
                  후에는 양도·환불·교환 불가
                </li>
                <li>
                  사용 불가 요금제: 데이터 무제한, 선불, 일부 특수 요금제 등
                </li>
                <li>
                  기타 주의사항: 명의변경, 번호이동, 해지 시 잔여 데이터 소멸,
                  최대 30개까지 등록 가능
                </li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-lg mb-1">LG U+ (엘지유플러스)</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  유효기간: 구매일로 또는 지급일로부터 1년, 등록 후 1년 이내
                  사용
                </li>
                <li>
                  양도/환불: 등록 전까지만 양도 가능, 등록 후에는 환불·교환·양도
                  불가
                </li>
                <li>
                  사용 불가 요금제: 무제한, 선불, 알뜰폰(MVNO), 일부 특수 요금제
                  등
                </li>
                <li>
                  기타 주의사항: 해지, 번호이동, 명의변경 시 잔여 데이터 소멸,
                  최대 10개까지 등록 가능
                </li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-lg mb-1">KT</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  유효기간: 구매일 또는 지급일로부터 1년, 등록 후 1년 이내 사용
                </li>
                <li>
                  양도/환불: 등록 전까지만 양도 가능, 등록 후에는
                  취소·재등록·변경 불가
                </li>
                <li>사용 불가 요금제: 무제한, 선불, 특수 단말 요금제 등</li>
                <li>
                  기타 주의사항: 일부 직영/고객 직판 등은 양도 자체가 불가, 등록
                  후에는 변경 불가
                </li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-base mb-1 mt-2">
                데이터 쿠폰 거래 시 꼭 알아두세요
              </div>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  쿠폰 거래는 통신사와 무관함을 절대 잊지 마십시오. 거래 전
                  약관을 꼭 확인해 주세요.
                </li>
                <li>쿠폰은 등록(PIN 입력) 전까지만 양도가 가능합니다.</li>
                <li>
                  구매/거래한 요금제 제한을 반드시 확인해 주세요. 구매자/등록자
                  요금제에서 사용 가능한지, 잔여기간이 얼마가 있는지 꼭
                  확인하세요.
                </li>
                <li>
                  스낵은 신뢰와 안전한 거래소로 생각하며, 열 수 있는 플랫폼으로
                  계속해서 개선하고 있습니다.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
