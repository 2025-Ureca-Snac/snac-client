'use client';

import Link from 'next/link';

export default function TradingInformationSection() {
  return (
    <section className="bg-white  h-full md:h-[532px] justify-center flex w-full md:full  ">
      <div className=" w-full gap-8 md:gap-0 flex-col-reverse flex flex-col md:flex-row items-center px-6 md:px-20 lg:pl-44 py-10">
        {/* 왼쪽 텍스트 설명 */}
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <h2 className="dary:text-gray-900 text-2xl md:text-3xl font-bold mb-2">
            천천히, 안전하게 데이터 거래
          </h2>
          <p className="text-gray-700 text-base md:text-lg">
            <span className="font-semibold text-blue-600">24~48시간 이내</span>
            에 여유롭게 거래가 완료됩니다.
            <br />
            판매자가 직접 신청을 확인한 뒤, 데이터 발송까지 모든 과정을 꼼꼼히
            관리합니다.
          </p>
          <p className="text-gray-600 text-sm md:text-base">
            거래 대금은{' '}
            <span className="font-semibold">중간에서 안전하게 보호</span>됩니다.
            <br />
            데이터가 제대로 전달될 때까지 안심하고 이용하세요.
          </p>
          <Link
            href="/cards"
            className="mt-6 w-full md:w-[430px] border-2 border-gray-500 inline-block rounded-xl bg-gray-900 text-white font-semibold text-center py-3 px-8 shadow hover:bg-gray-800 transition"
          >
            일반거래 시작하기
          </Link>
        </div>
        {/* 오른쪽 이미지 영역 */}
        <div className="md:ml-5 w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
          {/* 원하는 이미지를 아래에 넣으면 됨 */}
          <img
            src="/potato-lay.png"
            alt="여유롭게 거래하는 감자 캐릭터"
            className="w-40 h-40 object-contain"
            style={{ filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.04))' }}
          />
        </div>
      </div>
    </section>
  );
}
