// import { Button } from './(shared)/components/Button';
import { Header } from './(shared)/components/Header';
import { Footer } from './(shared)/components/Footer';
import { HomePageClient } from './(shared)/components/HomePageClient';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getCardData() {
  const res = await fetch(`${API_BASE}/api/cards`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default async function Home() {
  const cards = await getCardData();
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        {/* 홈화면 레이아웃 기초
        <Button>테스트</Button> */}
        <HomePageClient cards={cards} />
      </div>

      <Footer />
    </>
  );
}
