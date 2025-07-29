import React from 'react';
import { usePostStore } from '@/app/(shared)/stores/use-post-store';
import Edit from '../../../public/edit.svg';
import Trash from '../../../public/trash.svg';

export function PostsTable() {
  const { posts, openDeleteModal } = usePostStore();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-regular-sm text-left text-gray-500">
        <thead className="text-regular-xs text-gray-700 uppercase bg-gray-50">
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
            <th scope="col" className="px-6 py-3">
              카테고리
            </th>
            <th scope="col" className="px-6 py-3">
              날짜
            </th>

            <th scope="col" className="px-6 py-3 text-center">
              작업
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">
                #{post.id}
              </td>
              <td className="px-6 py-4 font-semibold">{post.title}</td>
              <td className="px-6 py-4">{post.author}</td>
              <td className="px-6 py-4">{post.category}</td>
              <td className="px-6 py-4">{post.date}</td>

              <td className="px-6 py-4 flex justify-center space-x-3">
                <button className="text-midnight-black" title="수정">
                  <Edit className="h-6 w-6" />
                </button>
                <button
                  onClick={() => openDeleteModal(post.id)}
                  className="text-red "
                  title="삭제"
                >
                  <Trash className="h-6 w-6" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
