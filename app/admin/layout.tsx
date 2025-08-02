'use client';

import React from 'react';

import { Footer } from '@/app/(shared)/components/Footer';
import { Header } from '@/app/(shared)/components/Header';
import { ConfirmationModal } from '@/app/(shared)/components/ConfirmationModal';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminStore } from '../(shared)/stores/use-admin-store';
import ManagerIcon from '@/public/manager.svg';
import NewReportIcon from '@/public/newReport.svg';
import PostIcon from '@/public/post.svg';
import Menu from '@/public/menu.svg';
import DataBaseIcon from '@/public/database.svg';

// 사이드바 컴포넌트
function Sidebar() {
  const { isSidebarOpen, setSidebarOpen } = useAdminStore();
  const pathname = usePathname();

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  const NAV_ITEMS = [
    { name: '대시보드', icon: DataBaseIcon, href: '/admin' },
    { name: '게시글 관리', icon: PostIcon, href: '/admin/blog' },
    { name: '신고 관리', icon: NewReportIcon, href: '/admin/dispute' },
  ];

  return (
    <aside
      className={`fixed md:relative z-30 flex-shrink-0 w-64 h-full text-white transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}
    >
      <div className="flex flex-col h-full shadow-light rounded-lg bg-white dark:bg-gray-900 mr-5">
        <div className="flex items-center justify-center h-16 gap-2">
          <ManagerIcon className="h-6 w-6 text-gray-600 dark:text-gray-200" />
          <span className="text-midnight-black text-lg font-bold dark:text-gray-100">
            관리자 패널
          </span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-gray-300 text-white dark:bg-gray-800 dark:text-white'
                    : 'text-gray-400 hover:bg-gray-500 hover:text-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                }`}
              >
                {item.icon && (
                  <item.icon className="w-6 h-6 mr-3" aria-hidden="true" />
                )}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
} // 헤더 컴포넌트
function AdminHeader() {
  const { toggleSidebar } = useAdminStore();
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.startsWith('/admin/blog')) return '게시글 관리';
    if (pathname.startsWith('/admin/users')) return '사용자 관리';
    if (pathname.startsWith('/admin/dispute')) return '신고 관리';
    return '대시보드';
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-700">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="md:hidden mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          {getTitle()}
        </h1>
      </div>
    </header>
  );
}

// 레이아웃
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen, setSidebarOpen } = useAdminStore();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar />

        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>
      <ConfirmationModal />
      <Footer />
    </div>
  );
}
