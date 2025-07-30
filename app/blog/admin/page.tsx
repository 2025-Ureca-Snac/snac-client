'use client';

import { useState } from 'react';
import { Header } from '@/app/(shared)/components/Header';
import { Footer } from '@/app/(shared)/components/Footer';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { useAuthStore } from '@/app/(shared)/stores/auth-store';
import dynamic from 'next/dynamic';
import { api } from '@/app/(shared)/utils/api';
import { toast } from 'sonner';

const ToastEditor = dynamic(
  () => import('../admin/ToastEditor').then((mod) => mod.ToastEditor),
  {
    ssr: false,
  }
);

interface BlogPostForm {
  title: string;
  subtitle: string;
  author: string;
  category: string;
  content: string;
  markdownContent: string;
  featured: boolean;
  images: string[];
  imagePositions: number[];
}

export default function BlogAdminPage() {
  const user = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState<BlogPostForm>({
    title: '',
    subtitle: '',
    author: '',
    category: '',
    content: '',
    markdownContent: '',
    featured: false,
    images: [],
    imagePositions: [],
  });

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const handleInputChange = (
    field: keyof BlogPostForm,
    value: string | boolean | string[] | number[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.markdownContent || !mainImageFile) {
      toast.error('제목, 본문 파일, 이미지 파일을 모두 첨부해야 합니다.');
      return;
    }

    console.log('user:', user);

    const data = new FormData();

    const markdownBlob = new Blob([formData.markdownContent], {
      type: 'text/markdown',
    });
    const markdownFileName =
      formData.title.trim().replace(/[\s/\\?%*:|"<>]/g, '_') || 'content';

    data.append('file', markdownBlob, `${markdownFileName}.md`);
    data.append('image', mainImageFile);

    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle);
    data.append('category', formData.category);
    data.append('featured', String(formData.featured));
    data.append('author', formData.author);
    data.append('content', formData.content);

    try {
      await api.post('/articles', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('블로그 포스트가 성공적으로 등록되었습니다!');
      (e.target as HTMLFormElement).reset();

      setFormData({
        title: '',
        subtitle: '',
        author: '',
        category: '',
        content: '',
        markdownContent: '',
        featured: false,
        images: [],
        imagePositions: [],
      });

      setMainImageFile(null);
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message: string } } })?.response?.data
          ?.message ||
        (error as Error)?.message ||
        '등록 실패';
      toast.error(`포스트 등록 실패: ${errorMessage}`);
      console.error('Failed to create blog post:', error);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      subtitle: '',
      author: '',
      category: '',
      content: '',
      markdownContent: '',
      featured: false,
      images: [],
      imagePositions: [],
    });
    setMainImageFile(null);
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="min-h-screen ">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-light p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            블로그 포스트 작성
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  부제목
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) =>
                    handleInputChange('subtitle', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  작성자 <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리 <span className="text-red">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange('category', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  required
                >
                  <option value="">카테고리 선택</option>
                  <option value="마케팅">마케팅</option>
                  <option value="데이터분석">데이터분석</option>
                  <option value="트렌드">트렌드</option>
                  <option value="브랜딩">브랜딩</option>
                  <option value="소셜미디어">소셜미디어</option>
                  <option value="고객경험">고객경험</option>
                  <option value="콘텐츠마케팅">콘텐츠마케팅</option>
                  <option value="SEO">SEO</option>
                  <option value="이메일마케팅">이메일마케팅</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  대표 이미지 파일 <span className="text-red">*</span>
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    setMainImageFile(e.target.files ? e.target.files[0] : null)
                  }
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                  accept="image/*"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    handleInputChange('featured', e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="featured"
                  className="ml-2 block text-sm text-gray-900"
                >
                  추천 포스트로 설정
                </label>
              </div>
            </div>
            {/* 마크다운 에디터 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  마크다운 콘텐츠 *
                </label>
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  {previewMode ? '편집 모드' : '미리보기'}
                </button>
              </div>

              {previewMode ? (
                <div className="border border-gray-300 rounded-md p-4 bg-gray-50 min-h-96">
                  <MarkdownRenderer
                    content={formData.markdownContent}
                    images={formData.images}
                    imagePositions={formData.imagePositions}
                    showGallery={false}
                  />
                </div>
              ) : (
                <ToastEditor
                  initialValue={formData.markdownContent}
                  onChange={(value) =>
                    handleInputChange('markdownContent', value)
                  }
                />
              )}
            </div>

            {/* 일반 텍스트 콘텐츠 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                일반 텍스트 콘텐츠 (선택사항)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="마크다운을 사용하지 않을 경우 일반 텍스트로 콘텐츠를 작성하세요."
              />
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                초기화
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                포스트 저장
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
