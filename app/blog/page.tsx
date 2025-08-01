// import { BLOG_POSTS } from './data/blogPosts';
import { blogPageMetadata } from './metadata';
import { Header } from '@/app/(shared)/components/Header';
import { Footer } from '@/app/(shared)/components/Footer';
import { BlogHero } from './components/BlogHero';
import BlogPageClient from './BlogPageClient';
import BlogStructuredData from './components/BlogStructuredData';

export const metadata = blogPageMetadata;

export default function BlogPage() {
  return (
    <>
      <BlogStructuredData />
      <div className="min-h-screen">
        <Header />
        <BlogHero />
        <BlogPageClient />
        <Footer />
      </div>
    </>
  );
}
