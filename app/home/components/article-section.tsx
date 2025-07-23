'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BLOG_POSTS } from '@/app/blog/data/blogPosts';

type ArticleCardProps = {
  title: string;
  link: string;
  imageUrl: string;
};

const ArticleCard = ({ title, link, imageUrl }: ArticleCardProps) => (
  <Link href={link} className="block group">
    <div className="relative w-[311px] md:w-[357px] h-[283px] md:h-[325px] rounded-2xl overflow-hidden">
      <Image
        src={imageUrl}
        alt={title}
        fill
        style={{ objectFit: 'cover' }}
        className="transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      <div className="absolute bottom-4 left-4 text-white">
        <h3 className="font-bold text-base text-heading-md md:text-medium-xl">
          {title}
        </h3>
        <div className="flex items-center mt-2 text-medium-md md:text-regular-sm opacity-80 group-hover:opacity-100 transition-opacity underline">
          <span>더 보기</span>
          <Image
            src="/arrow-right.svg"
            alt="화살표 아이콘"
            width={24}
            height={24}
            priority
          />
        </div>
      </div>
    </div>
  </Link>
);

export const ArticleSection = () => (
  <section className="w-full mx-auto pt-0 md:pt-12 pb-12 px-4">
    <Link href="/blog" className="block text-center mb-8">
      <h2 className="text-heading-2xl font-bold hover:underline cursor-pointer">
        읽을거리
      </h2>
    </Link>

    <div
      className="
        w-full                      
        flex flex-col items-center  
        gap-y-8                     
        md:flex-row                 
        md:justify-between          
      "
    >
      {BLOG_POSTS.slice(0, 3).map((post) => (
        <ArticleCard
          key={post.id}
          title={post.title}
          link={`/blog/${post.id}`}
          imageUrl={post.image}
        />
      ))}
    </div>
  </section>
);
