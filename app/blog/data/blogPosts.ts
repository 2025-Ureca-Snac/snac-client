import { BlogPost } from '@/app/(shared)/components/BlogCard';

// 확장된 BlogPost 타입을 위한 인터페이스
export interface ExtendedBlogPost extends BlogPost {
  content?: string;
  author?: string;
  publishDate?: string;
  readTime?: string;
  category?: string;
}

export const BLOG_POSTS: ExtendedBlogPost[] = [
  {
    id: 1,
    title: '데이터 기반 아웃렛 마케팅 전략',
    subtitle: '더 보기 →',
    image: '/blog1.png',
    featured: true,
    author: '마케팅팀',
    publishDate: '2024-01-15',
    readTime: '5분',
    category: '마케팅',
    content: `
      데이터 기반 아웃렛 마케팅은 현대 비즈니스에서 가장 중요한 전략 중 하나입니다. 
      고객의 행동 패턴과 선호도를 분석하여 개인화된 마케팅 메시지를 전달함으로써 
      더 높은 전환율과 고객 만족도를 달성할 수 있습니다.

      이 글에서는 데이터 분석을 통한 효과적인 아웃렛 마케팅 전략을 소개하고, 
      실제 사례를 통해 그 효과를 검증해보겠습니다.
    `,
  },
  {
    id: 2,
    title: '고객 데이터 분석의 핵심 포인트',
    subtitle: '더 보기 →',
    image: '/blog2.png',
    featured: false,
    author: '데이터팀',
    publishDate: '2024-01-10',
    readTime: '7분',
    category: '데이터분석',
    content: `
      고객 데이터를 효과적으로 분석하기 위해서는 몇 가지 핵심 포인트를 
      이해해야 합니다. 데이터의 품질, 분석 방법, 그리고 해석의 정확성이 
      모두 중요합니다.

      이 글에서는 실제 데이터 분석 프로젝트에서 얻은 인사이트를 
      공유하고, 성공적인 분석을 위한 팁을 제공합니다.
    `,
  },
  {
    id: 3,
    title: '디지털 마케팅 트렌드 2024',
    subtitle: '더 보기 →',
    image: '/blog3.png',
    featured: true,
    author: '전략팀',
    publishDate: '2024-01-05',
    readTime: '8분',
    category: '트렌드',
    content: `
      2024년 디지털 마케팅 분야에서 주목해야 할 주요 트렌드들을 
      정리해보았습니다. AI 기술의 발전, 개인화 마케팅의 확산, 
      그리고 새로운 플랫폼의 등장이 주요 키워드입니다.

      이 글을 통해 2024년 마케팅 전략을 수립하는데 도움이 되길 바랍니다.
    `,
  },
  {
    id: 4,
    title: '브랜드 아이덴티티 구축 가이드',
    subtitle: '더 보기 →',
    image: '/blog1.png',
    featured: false,
    author: '브랜드팀',
    publishDate: '2023-12-28',
    readTime: '6분',
    category: '브랜딩',
    content: `
      강력한 브랜드 아이덴티티는 기업의 성공에 핵심적인 요소입니다. 
      일관된 브랜드 메시지와 시각적 요소를 통해 고객의 신뢰를 
      얻고 경쟁에서 우위를 점할 수 있습니다.

      이 가이드를 통해 효과적인 브랜드 아이덴티티 구축 방법을 
      알아보세요.
    `,
  },
  {
    id: 5,
    title: '소셜미디어 마케팅 성공 사례',
    subtitle: '더 보기 →',
    image: '/blog2.png',
    featured: true,
    author: '소셜팀',
    publishDate: '2023-12-20',
    readTime: '9분',
    category: '소셜미디어',
    content: `
      소셜미디어를 활용한 마케팅에서 성공한 다양한 사례들을 
      분석해보았습니다. 각 플랫폼의 특성을 활용한 창의적인 
      캠페인들이 어떻게 성과를 달성했는지 살펴보겠습니다.

      이 사례들을 통해 여러분의 소셜미디어 마케팅 전략에 
      영감을 얻으실 수 있을 것입니다.
    `,
  },
  {
    id: 6,
    title: '고객 경험(CX) 최적화 방법',
    subtitle: '더 보기 →',
    image: '/blog3.png',
    featured: false,
    author: 'CX팀',
    publishDate: '2023-12-15',
    readTime: '10분',
    category: '고객경험',
    content: `
      고객 경험은 기업의 성장과 지속 가능성에 직접적인 영향을 
      미칩니다. 고객의 여정을 분석하고 개선점을 찾아 최적화하는 
      방법을 단계별로 설명합니다.

      이 글을 통해 고객 만족도를 높이고 충성 고객을 확보하는 
      방법을 배워보세요.
    `,
  },
  {
    id: 7,
    title: '콘텐츠 마케팅 전략 수립',
    subtitle: '더 보기 →',
    image: '/blog1.png',
    featured: true,
    author: '콘텐츠팀',
    publishDate: '2023-12-10',
    readTime: '12분',
    category: '콘텐츠마케팅',
    content: `
      효과적인 콘텐츠 마케팅을 위해서는 체계적인 전략 수립이 
      필요합니다. 타겟 오디언스 분석부터 콘텐츠 기획, 제작, 
      배포까지 전체 프로세스를 다룹니다.

      이 가이드를 통해 고품질 콘텐츠를 지속적으로 생산하고 
      배포하는 방법을 알아보세요.
    `,
  },
  {
    id: 8,
    title: 'SEO 최적화 완벽 가이드',
    subtitle: '더 보기 →',
    image: '/blog2.png',
    featured: false,
    author: 'SEO팀',
    publishDate: '2023-12-05',
    readTime: '15분',
    category: 'SEO',
    content: `
      검색 엔진 최적화(SEO)는 디지털 마케팅의 기본이자 핵심입니다. 
      키워드 연구부터 기술적 SEO, 온페이지 최적화까지 
      모든 요소를 포괄적으로 다룹니다.

      이 완벽 가이드를 통해 검색 결과에서 상위 순위를 
      차지하는 방법을 배워보세요.
    `,
  },
  {
    id: 9,
    title: '이메일 마케팅 ROI 향상 전략',
    subtitle: '더 보기 →',
    image: '/blog3.png',
    featured: true,
    author: '이메일팀',
    publishDate: '2023-11-30',
    readTime: '8분',
    category: '이메일마케팅',
    content: `
      이메일 마케팅은 여전히 가장 높은 ROI를 보이는 
      마케팅 채널 중 하나입니다. 개인화, 세분화, A/B 테스트를 
      통한 지속적인 최적화 방법을 소개합니다.

      이 전략들을 통해 이메일 마케팅의 성과를 극대화해보세요.
    `,
  },
];
