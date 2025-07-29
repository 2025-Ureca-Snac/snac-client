'use client';

import React, { useEffect } from 'react';

import { useBlogStore } from '@/app/(shared)/stores/use-blog-store';
import Plus from '../../../public/plus.svg';

import { BlogFilters } from './blog-filter';
import { BlogTable } from './blog-table';
import { DeleteConfirmModal } from './delete-confirm-modal';

export default function Page() {
  const { fetchBlogs, loading, error, blogs } = useBlogStore();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return (
    <>
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <div className="flex justify-end mb-4">
          <a
            href="/admin/blog/new"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold flex items-center space-x-2"
          >
            <Plus className="h-8 w-8" />
            <span>새 글 작성</span>
          </a>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-light">
          <BlogFilters />
          <span className="text-sm text-gray-600">총 {blogs.length}개</span>
          {loading && (
            <div className="text-center py-10">데이터를 불러오는 중...</div>
          )}
          {error && (
            <div className="text-center py-10 text-red-500">{error}</div>
          )}
          {!loading && !error && (
            <>
              <BlogTable />
            </>
          )}
        </div>
      </main>
      <DeleteConfirmModal />
    </>
  );
}
