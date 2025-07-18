'use client';

import Image from 'next/image';
import Link from 'next/link';

const articleData = [
  {
    title: '데이터 거래! 어떻게 이뤄지나요?',
    link: '/articles/1',
    imageUrl: '/blog1.png',
  },
  {
    title: 'KT유저는 와이박스 기록이 필요해요!',
    link: '/articles/2',
    imageUrl: '/blog2.png',
  },
  {
    title: '실시간 매칭? 스낵 매칭을 알아봐요',
    link: '/articles/3',
    imageUrl: '/blog3.png',
  },
];

type ArticleCardProps = {
  title: string;
  link: string;
  imageUrl: string;
};

const ArticleCard = ({ title, link, imageUrl }: ArticleCardProps) => (
  <Link href={link} className="group block">
    {/* 모바일 */}
    <div className="md:hidden flex flex-col items-start">
      <div className="relative w-[311px] h-[283px] rounded-2xl overflow-hidden mx-autounderline ">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="100vw"
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-4 font-bold text-gray-800 text-left">{title}</h3>
      <div className="flex items-center mt-2 text-sm text-gray-500 group-hover:text-bold transition-colors underline">
        <span>더 보기</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
    </div>

    {/* pc */}
    <div className="hidden md:block relative w-full h-48 rounded-2xl overflow-hidden">
      <Image
        src={imageUrl}
        alt={title}
        fill
        sizes="33vw"
        style={{ objectFit: 'cover' }}
        className="transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      <div className="absolute bottom-4 left-4 text-white">
        <h3 className="font-bold text-heading-md md:text-medium-xl ">
          {title}
        </h3>
        <div className="flex items-center mt-2  text-regular-sm md:text-medium-md opacity-80 group-hover:opacity-100 transition-opacity">
          <span>더 보기</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      </div>
    </div>
  </Link>
);

export const ArticleSection = () => (
  <section className="w-full max-w-5xl mx-auto py-12 px-4">
    <h2 className="text-heading-2xl font-bold text-center mb-8">읽을거리</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 justify-items-center">
      {articleData.map((article) => (
        <ArticleCard key={article.link} {...article} />
      ))}
    </div>
  </section>
);
