import { Button } from './(shared)/components/Button';
import { Header } from './(shared)/components/Header';
import { Footer } from './(shared)/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        홈화면 레이아웃 기초
        <Button>테스트</Button>
      </div>
      <Footer />
    </>
  );
}
