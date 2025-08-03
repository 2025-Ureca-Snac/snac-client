'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/app/(shared)/components/Header';
import { Footer } from '@/app/(shared)/components/Footer';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { useAuthStore } from '@/app/(shared)/stores/auth-store';
import dynamic from 'next/dynamic';
import { api, handleApiError } from '@/app/(shared)/utils/api';
import { toast } from 'sonner';

// SSR 이슈를 방지하기 위해 에디터 컴포넌트를 동적으로 가져옵니다.
const ToastEditor = dynamic(
  () => import('../admin/ToastEditor').then((mod) => mod.ToastEditor),
  {
    ssr: false,
  }
);

// 타입 안전성을 위한 인터페이스 정의
interface BlogPostForm {
  title: string;
  author: string;
  content: string;
  markdownContent: string;
  images: string[];
  imagePositions: number[];
}

interface PostApiResponse {
  data: BlogPostForm;
}

function BlogAdminFormComponent() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get('edit');
  const user = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState<BlogPostForm>({
    title: '',
    author: '',
    content: '',
    markdownContent: '',
    images: [],
    imagePositions: [],
  });

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(!!editId); // 수정 페이지인 경우 로딩 상태로 시작
  const [fetchError, setFetchError] = useState<string | null>(null);

  // 인증된 사용자 상태에서 작성자를 설정하는 Effect
  useEffect(() => {
    if (user && !editId) {
      setFormData((prev) => ({ ...prev, author: user }));
    }
  }, [user, editId]);

  // 수정 모드일 때 기존 포스트 데이터를 가져오는 Effect
  useEffect(() => {
    if (!editId) return;

    const fetchPost = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await api.get<PostApiResponse>(`/articles/${editId}`);
        const post = res.data.data;
        setFormData({
          title: post.title || '',
          author: post.author || '',
          content: post.content || '',
          markdownContent: post.markdownContent || post.content || '',
          images: post.images || [],
          imagePositions: post.imagePositions || [],
        });
      } catch (error) {
        console.error('Failed to fetch post:', error);
        const errorMessage = '기존 포스트를 불러오지 못했습니다.';
        setFetchError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [editId]);

  // 폼 입력 변경을 위한 일반 핸들러
  const handleInputChange = (
    field: keyof BlogPostForm,
    value: string | boolean | string[] | number[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.markdownContent ||
      (!mainImageFile && !editId)
    ) {
      toast.error('제목, 마크다운 콘텐츠, 대표 이미지를 모두 입력해야 합니다.');
      return;
    }

    const data = new FormData();
    const markdownBlob = new Blob([formData.markdownContent], {
      type: 'text/markdown',
    });
    const markdownFileName =
      formData.title.trim().replace(/[\s/\\?%*:|"<>]/g, '_') || 'content';

    data.append('file', markdownBlob, `${markdownFileName}.md`);
    if (mainImageFile) data.append('image', mainImageFile);
    data.append('title', formData.title);
    data.append('author', formData.author);
    data.append('content', formData.content);

    try {
      if (editId) {
        await api.put(`/articles/${editId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('블로그 포스트가 성공적으로 수정되었습니다!');
      } else {
        await api.post('/articles', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('블로그 포스트가 성공적으로 등록되었습니다!');
      }

      router.push('/admin/blog');
    } catch (error) {
      const errorMessage =
        handleApiError(error) || '요청 처리 중 오류가 발생했습니다.';
      toast.error(errorMessage);
    }
  };

  // 폼을 초기 상태로 리셋하는 핸들러
  const handleReset = () => {
    setFormData({
      title: '',
      author: user || '',
      content: '',
      markdownContent: '',
      images: [],
      imagePositions: [],
    });
    setMainImageFile(null);
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // 로딩 및 오류 상태에 대한 조건부 렌더링
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full" />
        <span className="ml-4 text-gray-600 text-lg">
          포스트를 불러오는 중...
        </span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{fetchError}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          이전 페이지로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-light p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              {editId ? '블로그 포스트 수정' : '블로그 포스트 작성'}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목 <span className="text-red-500">*</span>
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
                    대표 이미지 파일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setMainImageFile(
                        e.target.files ? e.target.files[0] : null
                      )
                    }
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                    accept="image/*"
                    required={!editId}
                  />
                  {editId && !mainImageFile && formData.images?.[0] && (
                    <img
                      src={formData.images[0]}
                      alt="기존 대표 이미지"
                      className="w-32 h-32 object-cover rounded mt-2 border"
                    />
                  )}
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    마크다운 콘텐츠 <span className="text-red-500">*</span>
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
                  <div className="prose max-w-none border border-gray-300 rounded-md p-4 bg-gray-50 min-h-[400px]">
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
              <div className="flex justify-end space-x-4 pt-4 border-t">
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
                  {editId ? '포스트 수정' : '포스트 저장'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function BlogAdminPage() {
  const loadingFallback = (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full" />
      <span className="ml-4 text-gray-600 text-lg">페이지 로딩 중...</span>
    </div>
  );

  return (
    <Suspense fallback={loadingFallback}>
      <BlogAdminFormComponent />
    </Suspense>
  );
}
