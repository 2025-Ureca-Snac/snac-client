import { blogPageMetadata } from './metadata';
import { Footer } from '@/app/(shared)/components/Footer';
import { Header } from '@/app/(shared)/components/Header';
import { BlogHero } from './components/BlogHero';
import { BLOG_POSTS } from './data/blogPosts';
import BlogPageClient from './BlogPageClient';
import BlogStructuredData from './components/BlogStructuredData';

export const metadata = blogPageMetadata;

export default function BlogPage() {
  return (
    <>
      <BlogStructuredData posts={BLOG_POSTS} />
      <div className="min-h-screen">
        <Header />
        <BlogHero />
        <BlogPageClient posts={BLOG_POSTS} />
        <Footer />
      </div>
    </>
  );
}
