import SideMenu from '@/app/(shared)/components/SideMenu';
import ScoreCard from '@/app/(shared)/components/ScoreCard';
import ActionButtons from '@/app/(shared)/components/ActionButtons';
import MyPageBottomButtons from '@/app/(shared)/components/mypage-bottom-buttons';
import { FavoriteItem } from '@/app/(shared)/types/mypage';
import Link from 'next/link';
import Image from 'next/image';

interface MyPageContentProps {
  favorites: FavoriteItem[];
}

export default function MyPageContent({ favorites }: MyPageContentProps) {
  return (
    <div className="min-h-screen bg-background w-full">
      <div className="flex w-full min-h-screen">
        {/* 좌측 메뉴 (데스크탑만) */}
        <div className="hidden md:block w-64 flex-shrink-0 md:pt-8 md:pl-4">
          <SideMenu />
        </div>
        {/* 메인 컨텐츠 */}
        <main className="flex-1 flex flex-col md:pt-8 pt-4 md:px-6 px-2 mb-12">
          <div className="max-w-4xl mx-auto w-full">
            <section className="w-full max-w-full">
              {/* ScoreCard (User Profile + 바삭 스코어 + 새싹 스낵이) */}
              <ScoreCard favoriteCount={favorites.length} />
              {/* ActionButtons (판매 내역, 구매 내역, 신고 내역) */}
              <ActionButtons />

              {/* 설정 관리 버튼 */}
              <div className="mb-6">
                <Link
                  href="/mypage/settings"
                  className="block bg-card border border-border rounded-lg overflow-hidden hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <div className="w-full flex justify-between items-center py-6 px-8 text-lg font-bold text-foreground">
                    <span>설정 관리</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        모든 설정 보기
                      </span>
                      <Image
                        src="/chevron-down.svg"
                        alt="오른쪽 화살표"
                        width={24}
                        height={24}
                        className="inline-block -rotate-90 text-muted-foreground"
                      />
                    </div>
                  </div>
                </Link>
              </div>

              {/* 하단 버튼들 */}
              <MyPageBottomButtons />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
