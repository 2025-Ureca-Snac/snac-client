// import { BLOG_POSTS } from './data/blogPosts';
import { blogPageMetadata } from './metadata';

import { BlogHero } from './components/BlogHero';
import BlogPageClient from './BlogPageClient';
import BlogStructuredData from './components/BlogStructuredData';

export const metadata = blogPageMetadata;

export default function BlogPage() {
  return (
    <>
      <BlogStructuredData />
      <div className="min-h-screen">
        <BlogHero />
        <BlogPageClient />
      </div>
    </>
  );
}
