'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import { useState } from 'react';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  images?: string[];
  imagePositions?: number[];
  showGallery?: boolean;
}

export function MarkdownRenderer({
  content,
  images,
  imagePositions,
  showGallery = true,
}: MarkdownRendererProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openImageModal = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // 기존 로직은 그대로 유지합니다.
  const renderContentWithImages = () => {
    if (!images || images.length === 0) {
      return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {content}
        </ReactMarkdown>
      );
    }
    const paragraphs = content.split('\n\n');
    const result = [];
    for (let i = 0; i < paragraphs.length; i++) {
      result.push(
        <div key={`paragraph-${i}`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {paragraphs[i]}
          </ReactMarkdown>
        </div>
      );
      if (imagePositions && imagePositions.includes(i)) {
        const imageIndex = imagePositions.indexOf(i);
        if (images[imageIndex]) {
          result.push(
            <div key={`image-${i}`} className="my-6">
              <Image
                src={images[imageIndex]}
                alt={`Content image ${imageIndex + 1}`}
                width={800}
                height={400}
                className="max-w-full h-auto rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => openImageModal(images[imageIndex])}
              />
            </div>
          );
        }
      }
    }
    return result;
  };

  // components 객체에 클래스를 추가하여 다크 모드 스타일을 직접 지정합니다.
  const components: Components = {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold text-card-foreground mb-6 mt-8">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold text-card-foreground mb-4 mt-6">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-card-foreground mb-3 mt-5">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold text-card-foreground mb-2 mt-4">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="mb-4 text-foreground leading-relaxed">{children}</p>
    ),
    ul: ({ children }) => <ul className="mb-4 pl-6 list-disc">{children}</ul>,
    ol: ({ children }) => (
      <ol className="mb-4 pl-6 list-decimal">{children}</ol>
    ),
    li: ({ children }) => <li className="mb-1">{children}</li>,
    strong: ({ children }) => (
      <strong className="font-semibold text-card-foreground">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !match;
      return !isInline ? (
        <pre className="bg-secondary bg-background text-card-foreground p-4 rounded-lg overflow-x-auto my-4">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code
          className="bg-muted text-foreground px-1 py-0.5 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    },
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border-collapse border border-border">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-border px-4 py-2 bg-muted font-semibold text-left">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-border px-4 py-2">{children}</td>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 italic text-foreground">
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => (
      <a href={href} className="text-blue-600 hover:text-blue-800 underline">
        {children}
      </a>
    ),
    img({ src, alt }) {
      if (!src || typeof src !== 'string') return null;
      return (
        <div className="my-4">
          <Image
            src={src}
            alt={alt || ''}
            width={800}
            height={400}
            className="max-w-full h-auto rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => openImageModal(src)}
          />
        </div>
      );
    },
  };

  return (
    <div className="text-foreground leading-relaxed">
      <div>{renderContentWithImages()}</div>

      {showGallery && images && images.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-card-foreground mb-4">
            이미지 갤러리
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image}
                className="relative h-32 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => openImageModal(image)}
              >
                <Image
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-card bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-primary-foreground text-2xl hover:text-muted-foreground z-10"
            >
              ×
            </button>
            <Image
              src={selectedImage}
              alt="Modal image"
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
