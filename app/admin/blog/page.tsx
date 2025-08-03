'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { BlogTable } from './blog-table';
import { DeleteConfirmModal } from './delete-confirm-modal';
import { useBlogStore } from '@/app/(shared)/stores/use-blog-store';

export default function Page() {
  const { fetchAll, loading, error } = useBlogStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <>
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        {/* 검색 + 새글작성 라인 */}
        <div className="flex flex-col gap-2 md:flex-row md:justify-end mb-4">
          {/* 검색 인풋 */}
          <input
            type="text"
            placeholder="게시글 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              flex-1 min-w-0
              px-3 py-1.5
              border border-gray-300 dark:border-gray-600
              rounded-full bg-transparent
              text-gray-700 dark:text-gray-200
              focus:outline-none focus:ring-2 focus:ring-white
              transition
              w-full md:w-auto
            "
          />
          {/* 새 글 작성 버튼 */}
          <Link
            href="/blog/admin"
            className="
              flex-shrink-0
              inline-flex items-center space-x-2
              px-3 py-1.5
              bg-transparent border border-gray-300 dark:border-gray-600
              text-gray-600 dark:text-gray-200 font-medium text-regular-md
              rounded-full transition-colors duration-200
              hover:bg-gray-100 dark:hover:bg-gray-800
              whitespace-nowrap
              w-full md:w-auto
              justify-center
            "
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            <span>새 글 작성</span>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-light">
          {loading && (
            <div className="text-center py-10 text-gray-600 dark:text-gray-200">
              데이터를 불러오는 중...
            </div>
          )}
          {error && (
            <div className="text-center py-10 text-red-500">{error}</div>
          )}
          {!loading && !error && <BlogTable search={search} />}
        </div>
      </div>

      <DeleteConfirmModal />
    </>
  );
}
