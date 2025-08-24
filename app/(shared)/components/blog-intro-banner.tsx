import Image from 'next/image';

export default function BlogIntroBanner() {
  return (
    <section className="bg-card  h-full md:h-[532px] justify-center flex w-full md:full  ">
      <div className=" w-full gap-8 md:gap-0 flex-col-reverse flex flex-col md:flex-row items-center px-6 md:px-20 lg:pl-44 py-10">
        {/* 왼쪽 텍스트 설명 */}
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <h2 className="dary:text-card-foreground text-2xl md:text-3xl font-bold mb-2">
            스낵 블로그에서 데이터 거래 노하우
          </h2>
          <p className="text-foreground text-base md:text-lg">
            <span className="font-semibold text-blue-600">SKT, KT, LGU+</span>
            데이터 거래에 관한 유용한 정보들을 확인해보세요.
            <br />
            실시간 매칭 시스템 활용법부터 데이터 활용 팁까지 모든 꿀팁을
            공유합니다.
          </p>
          <p className="text-muted-foreground text-sm md:text-base">
            <span className="font-semibold">아래 읽을거리</span>에서
            <br />
            데이터 거래의 모든 것을 배워보세요.
          </p>
          <button
            onClick={() => {
              const articleSection = document.getElementById('articles');
              if (articleSection) {
                articleSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="mt-6 w-full md:w-[430px] border-2 border-gray-500 inline-block rounded-xl bg-background text-primary-foreground font-semibold text-center py-3 px-8 shadow hover:bg-card transition flex items-center justify-center gap-2"
          >
            아래 읽을거리 확인하기
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>
        {/* 오른쪽 이미지 영역 */}
        <div className="md:ml-5 w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
          {/* 원하는 이미지를 아래에 넣으면 됨 */}
          <Image
            src="/blog1-non.png"
            alt="블로그를 읽는 감자 캐릭터"
            width={200}
            height={200}
            className="w-48 h-48 md:w-56 md:h-56 object-contain"
            style={{ filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.04))' }}
          />
        </div>
      </div>
    </section>
  );
}
