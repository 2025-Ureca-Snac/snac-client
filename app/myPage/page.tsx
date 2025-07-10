import SideMenu from '../(shared)/components/SideMenu';
import ScoreCard from '../(shared)/components/ScoreCard';
import ActionButtons from '../(shared)/components/ActionButtons';
import Accordion from '../(shared)/components/Accordion';
import SettingList from '../(shared)/components/SettingList';

export default function MyPage() {
  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <SideMenu />
      <main className="flex-1 flex flex-col items-center py-12">
        <div className="w-full max-w-xl">
          <h2 className="text-2xl font-bold mb-6">김유저</h2>
          <ScoreCard />
          <ActionButtons />
          <Accordion />
          <SettingList />
          <button className="w-full h-12 mt-6 rounded-lg bg-[#C89B5C] text-white font-semibold">
            로그아웃
          </button>
          <button className="w-full h-12 mt-2 rounded-lg bg-[#EDEDED] text-[#888] font-semibold">
            탈퇴하기
          </button>
        </div>
      </main>
    </div>
  );
}
