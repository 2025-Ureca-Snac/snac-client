'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Plus from '@/public/plus.svg';
import { BlogTable } from './blog-table';
import { DeleteConfirmModal } from './delete-confirm-modal';
import { useBlogStore } from '@/app/(shared)/stores/use-blog-store';

export default function Page() {
  const { fetchAll, loading, error } = useBlogStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <>
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <div className="flex justify-end mb-4">
          <Link
            href="/blog/admin"
            className="
              inline-flex items-center space-x-2
              px-3 py-1.5
              bg-transparent border border-gray-300
              text-gray-600 font-medium text-regular-md
              rounded-full transition-colors duration-200
              hover:bg-gray-100
            "
          >
            <Plus className="h-8 w-8" />
            <span>새 글 작성</span>
          </Link>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-light">
          {loading && (
            <div className="text-center py-10">데이터를 불러오는 중...</div>
          )}
          {error && (
            <div className="text-center py-10 text-red-500">{error}</div>
          )}
          {!loading && !error && <BlogTable />}
        </div>
      </div>

      <DeleteConfirmModal />
    </>
  );
}
