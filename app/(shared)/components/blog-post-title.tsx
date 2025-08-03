import { BlogPostTitleProps } from '../types/blog-post';

export default function BlogPostTitle({ title }: BlogPostTitleProps) {
  return <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>;
}
