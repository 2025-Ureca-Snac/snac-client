import Image from 'next/image';

import { BlogPostThumbnailProps } from '../types/blog-post';

export default function BlogPostThumbnail({
  imageUrl,
  title,
}: BlogPostThumbnailProps) {
  return (
    <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
      />
    </div>
  );
}
