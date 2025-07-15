'use client';

import { useState } from 'react';
import { Header } from '@/app/(shared)/components/Header';
import { Footer } from '@/app/(shared)/components/Footer';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

interface BlogPostForm {
  title: string;
  subtitle: string;
  author: string;
  category: string;
  content: string;
  markdownContent: string;
  featured: boolean;
  image: string;
  images: string[];
}

export default function BlogAdminPage() {
  const [formData, setFormData] = useState<BlogPostForm>({
    title: '',
    subtitle: '',
    author: '',
    category: '',
    content: '',
    markdownContent: '',
    featured: false,
    image: '',
    images: [],
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleInputChange = (field: keyof BlogPostForm, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기서 실제로 블로그 포스트를 저장하는 로직을 구현
    console.log('Blog post data:', formData);
    alert('블로그 포스트가 저장되었습니다!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            블로그 포스트 작성
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  작성자 *
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리 *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange('category', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  대표 이미지 URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
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

            {/* 이미지 갤러리 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                추가 이미지들
              </label>
              <div className="flex gap-2 mb-4">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="이미지 URL을 입력하세요"
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  추가
                </button>
              </div>
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                  />
                </div>
              ) : (
                <textarea
                  value={formData.markdownContent}
                  onChange={(e) =>
                    handleInputChange('markdownContent', e.target.value)
                  }
                  className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="# 제목

## 소제목

여기에 마크다운으로 콘텐츠를 작성하세요.

### 코드 예시
\`\`\`javascript
console.log('Hello World!');
\`\`\`

### 이미지 추가
![이미지 설명](이미지URL)

### 테이블
| 컬럼1 | 컬럼2 |
|-------|-------|
| 데이터1 | 데이터2 |"
                  required
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
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="마크다운을 사용하지 않을 경우 일반 텍스트로 콘텐츠를 작성하세요."
              />
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    title: '',
                    subtitle: '',
                    author: '',
                    category: '',
                    content: '',
                    markdownContent: '',
                    featured: false,
                    image: '',
                    images: [],
                  });
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                초기화
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
