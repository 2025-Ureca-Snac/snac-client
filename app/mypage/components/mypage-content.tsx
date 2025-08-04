import SideMenu from '@/app/(shared)/components/SideMenu';
import ScoreCard from '@/app/(shared)/components/ScoreCard';
import ActionButtons from '@/app/(shared)/components/ActionButtons';
import Accordion from '@/app/(shared)/components/Accordion';
import SettingList from '@/app/(shared)/components/SettingList';
import MyPageBottomButtons from '@/app/(shared)/components/mypage-bottom-buttons';
import { FavoriteItem } from '@/app/(shared)/types/mypage';

interface MyPageContentProps {
  favorites: FavoriteItem[];
  onSettingClick: (item: string) => void;
}

export default function MyPageContent({
  favorites,
  onSettingClick,
}: MyPageContentProps) {
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
              {/* Accordion (거래 후기) */}
              <Accordion />
              {/* SettingList (설정 리스트) */}
              <SettingList onItemClick={onSettingClick} />

              {/* 하단 버튼들 */}
              <MyPageBottomButtons />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
