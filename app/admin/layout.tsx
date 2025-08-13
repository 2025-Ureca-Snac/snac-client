'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAdminStore } from '../(shared)/stores/use-admin-store';

import ManagerIcon from '@/public/manager.svg';
import DashboardIcon from '@/public/database.svg';
import PostIcon from '@/public/post.svg';
import ReportIcon from '@/public/newReport.svg';
import QnaIcon from '@/public/qna.svg';
import MenuIcon from '@/public/menu.svg';

function Sidebar() {
  const { isSidebarOpen, setSidebarOpen } = useAdminStore();
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const NAV_ITEMS = [
    { name: '대시보드', icon: DashboardIcon, href: '/admin' },
    { name: '게시글 관리', icon: PostIcon, href: '/admin/blog' },
    { name: '신고 관리', icon: ReportIcon, href: '/admin/dispute/report' },
    { name: '문의 관리', icon: QnaIcon, href: '/admin/dispute/qna' },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-card shadow-lg flex-shrink-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-20 border-b gap-2">
          <ManagerIcon className="h-7 w-7 text-teal-green" />
          <span className="text-foreground text-lg font-bold">관리자 패널</span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-teal-green text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-primary-foreground'
                }`}
              >
                <item.icon className="w-6 h-6 mr-3" aria-hidden="true" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

function AdminHeader() {
  const { toggleSidebar } = useAdminStore();
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.startsWith('/admin/blog')) return '게시글 관리';
    if (pathname.startsWith('/admin/dispute/report')) return '신고 관리';
    if (pathname.startsWith('/admin/dispute/qna')) return '문의 관리';
    return '대시보드';
  };

  return (
    <header className="flex items-center justify-between h-20 px-6 bg-card border-b">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="md:hidden mr-4 text-muted-foreground hover:text-foreground focus:outline-none"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-foreground">{getTitle()}</h1>
      </div>
    </header>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen, setSidebarOpen } = useAdminStore();

  return (
    <>
      <div className="flex h-screen bg-muted bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </>
  );
}
