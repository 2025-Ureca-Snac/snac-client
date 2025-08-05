// 내부 라이브러리/유틸리티 임포트 (절대 경로)
import { BlogPostTitleProps } from '../types/blog-post';

export default function BlogPostTitle({ title }: BlogPostTitleProps) {
  return <h1 className="text-3xl font-bold mb-4">{title}</h1>;
}
