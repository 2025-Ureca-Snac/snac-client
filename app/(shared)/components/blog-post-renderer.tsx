import Image from 'next/image';
import React from 'react';
import { marked } from 'marked';
import { BlogPostRendererProps } from '../types/blog-post';

export default async function BlogPostRenderer({
  post,
}: BlogPostRendererProps) {
  // 콘텐츠를 단락으로 분리하고 이미지 삽입
  const renderContentWithImages = async () => {
    // 마크다운 콘텐츠가 있으면 우선 처리
    if (post.markdownContent) {
      const content = await post.markdownContent;
      try {
        const htmlContent = marked(content, {
          breaks: true, // 줄바꿈을 <br>로 변환
          gfm: true, // GitHub Flavored Markdown 지원
        });
        return (
          <div
            className="text-gray-700 leading-relaxed prose prose-lg max-w-none [&>h1]:text-4xl [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:text-gray-900 [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:text-gray-900 [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:mb-3 [&>h3]:text-gray-900 [&>h4]:text-xl [&>h4]:font-semibold [&>h4]:mb-2 [&>h4]:text-gray-900 [&>p]:mb-4 [&>p]:leading-7 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>li]:mb-2 [&>li]:leading-6 [&>strong]:font-bold [&>strong]:text-gray-900 [&>em]:italic [&>code]:bg-gray-100 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono [&>pre]:bg-gray-100 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:mb-4 [&>hr]:my-8 [&>hr]:border-gray-300 [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>blockquote]:bg-blue-50 [&>blockquote]:py-2 [&>blockquote]:rounded-r [&>a]:text-blue-600 [&>a]:underline [&>a]:hover:text-blue-800 [&>a]:transition-colors [&>a]:duration-200 [&>table]:w-full [&>table]:border-collapse [&>table]:mb-4 [&>th]:border [&>th]:border-gray-300 [&>th]:px-4 [&>th]:py-2 [&>th]:bg-gray-100 [&>th]:font-bold [&>td]:border [&>td]:border-gray-300 [&>td]:px-4 [&>td]:py-2 [&>img]:w-full [&>img]:h-auto [&>img]:rounded-lg [&>img]:shadow-md [&>img]:my-4 [&>img]:max-w-full [&>img]:object-contain"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        );
      } catch (error) {
        console.error('마크다운 변환 실패:', error);
        return (
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        );
      }
    }

    // API에서 실제로 사용하는 속성들 확인
    if (!post.content && !post.articleUrl && !post.contentFileUrl) {
      return (
        <div className="text-gray-700 leading-relaxed">
          <p>콘텐츠를 불러오는 중...</p>
        </div>
      );
    }

    // 기존 content가 있으면 사용
    if (post.content) {
      const content = post.content;

      if (!post.images || post.images.length === 0 || !post.imagePositions) {
        // 이미지가 없으면 일반 렌더링
        if (post.content) {
          return (
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          );
        } else {
          const markdownContent = post.markdownContent
            ? await post.markdownContent
            : '';
          return (
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {markdownContent}
            </div>
          );
        }
      }

      // 이미지가 있는 경우 단락 사이에 삽입
      const elements: React.ReactElement[] = [];
      const paragraphs = content.split('\n\n').filter((p) => p.trim());

      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        // 단락 추가
        if (post.content) {
          elements.push(
            <div
              key={`paragraph-${i}`}
              className="text-gray-700 leading-relaxed mb-6"
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />
          );
        } else {
          elements.push(
            <div
              key={`paragraph-${i}`}
              className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap"
            >
              {paragraph}
            </div>
          );
        }

        // 이미지 위치에 해당하는 단락 뒤에 이미지 삽입
        if (post.imagePositions?.includes(i + 1)) {
          const imageIndex = post.imagePositions.indexOf(i + 1);
          if (imageIndex < (post.images?.length || 0)) {
            const imageSrc = post.images![imageIndex];
            elements.push(
              <div key={`image-${i}`} className="my-8">
                <div className="relative h-80 rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={imageSrc}
                    alt={`${post.title} - 이미지 ${imageIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  />
                </div>
              </div>
            );
          }
        }
      }

      return elements;
    }

    // articleUrl이나 contentFileUrl이 있는 경우
    if (post.articleUrl || post.contentFileUrl) {
      const contentUrl = post.articleUrl || post.contentFileUrl;

      // 이미지 파일인 경우
      if (contentUrl && contentUrl.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return (
          <div className="relative aspect-video mb-6">
            <Image
              src={contentUrl}
              alt="업로드 이미지"
              fill
              className="object-contain rounded-lg"
            />
          </div>
        );
      }

      // 텍스트/마크다운 파일인 경우 - 클라이언트에서 처리하도록 안내
      return (
        <div className="text-gray-700 leading-relaxed">
          <p>콘텐츠를 불러오는 중...</p>
          <p className="text-sm text-gray-500 mt-2">콘텐츠 URL: {contentUrl}</p>
        </div>
      );
    }

    return (
      <div className="text-gray-700 leading-relaxed">
        <p>콘텐츠가 없습니다.</p>
      </div>
    );
  };

  return (
    <div className="prose prose-lg max-w-none">
      {await renderContentWithImages()}
    </div>
  );
}
