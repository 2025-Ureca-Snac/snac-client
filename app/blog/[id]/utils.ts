import { ExtendedBlogPost } from '../data/blogPosts';
import api from '@/app/(shared)/utils/api';

// 읽기 시간 계산 함수
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200; // 한국어 기준 분당 읽는 단어 수
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// 목차 생성 함수
export function generateTableOfContents(
  content: string
): Array<{ id: string; text: string; level: number }> {
  const headings = content.match(/^(#{1,6})\s+(.+)$/gm);
  if (!headings) return [];

  return headings.map((heading, index) => {
    const level = heading.match(/^(#{1,6})/)?.[0].length || 1;
    const text = heading.replace(/^(#{1,6})\s+/, '');
    const id = `heading-${index}`;
    return { id, text, level };
  });
}

// 데이터를 가져오는 함수
export async function getPost(id: string): Promise<ExtendedBlogPost | null> {
  try {
    const response = await api.get(`/articles/${id}`);
    const post = (response.data as { data: ExtendedBlogPost }).data;

    // articleUrl에서 콘텐츠 가져오기
    if (post.articleUrl && !post.articleUrl.match(/\.(jpg|jpeg|png|gif)$/i)) {
      try {
        const contentResponse = await fetch(post.articleUrl);
        if (contentResponse.ok) {
          const content = await contentResponse.text();
          post.markdownContent = content;
        }
      } catch {}
    }

    return post;
  } catch {
    return null;
  }
}
