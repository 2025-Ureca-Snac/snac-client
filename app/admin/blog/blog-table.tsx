'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Edit from '@/public/edit.svg';
import Trash from '@/public/trash.svg';
import { useBlogStore } from '@/app/(shared)/stores/use-blog-store';
import type { Blog } from '@/app/(shared)/stores/use-blog-store';
import { BlogDetailModal } from './blog-detail-modal';

// search: string을 props로 받음!
export function BlogTable({ search = '' }: { search?: string }) {
  const { blogs, loading, error, openDeleteModal } = useBlogStore();
  const [detailPost, setDetailPost] = useState<Blog | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // 검색어 필터링 (제목, 작성자, 내용)
  const filteredBlogs = blogs.filter((blog) => {
    const lower = search.toLowerCase();
    return (
      blog.title?.toLowerCase().includes(lower) ||
      blog.nickname?.toLowerCase().includes(lower) ||
      blog.contentFileUrl?.toLowerCase().includes(lower)
    );
  });

  if (loading) return <p className="p-6 text-center">로딩 중...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;
  if (filteredBlogs.length === 0)
    return <p className="p-6 text-center">게시글이 없습니다.</p>;

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 p-4 text-sm text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-lg">
        <strong>안내:</strong> 제목을 클릭하면 기존 게시글 정보를 수정할 수
        있습니다.
        <br />
        수정 시{' '}
        <span className="font-semibold">제목, 본문 파일, 이미지 파일</span>을
        모두 새로 첨부해야 하며, 기존 파일은 삭제되고{' '}
        <span className="font-semibold">새 파일로 교체</span>됩니다.
      </div>

      <table className="w-full text-regular-sm text-left text-muted-foreground text-muted-foreground">
        <thead className="text-regular-xs text-foreground uppercase bg-muted">
          <tr>
            <th scope="col" className="px-6 py-3">
              ID
            </th>
            <th scope="col" className="px-6 py-3">
              제목
            </th>
            <th scope="col" className="px-6 py-3">
              작성자
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              작업
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredBlogs.map((blog) => (
            <tr
              key={blog.id}
              className="bg-card border-b hover:bg-muted bg-background"
            >
              <td className="px-6 py-4 font-medium text-card-foreground">
                #{blog.id}
              </td>

              {/* 제목 클릭 시 모달 오픈 */}
              <td
                className="px-6 py-4 font-semibold text-card-foreground cursor-pointer hover:underline"
                onClick={() => {
                  setDetailPost(blog);
                  setDetailOpen(true);
                }}
              >
                {blog.title || '(제목 없음)'}
              </td>

              <td className="px-6 py-4">{blog.nickname}</td>
              <td className="px-6 py-4 flex justify-center space-x-3">
                <Link href={`/blog/admin?edit=${blog.id}`} title="수정">
                  <Edit className="h-6 w-6 text-card-foreground text-muted-foreground" />
                </Link>
                <button
                  onClick={() => openDeleteModal(blog.id)}
                  className="text-red"
                  title="삭제"
                >
                  <Trash className="h-6 w-6" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 상세 모달 */}
      <BlogDetailModal
        post={detailPost}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}
