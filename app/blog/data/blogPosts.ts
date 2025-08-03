import { Blog } from '@/app/(shared)/stores/use-blog-store';

// 확장된 Blog 타입을 위한 인터페이스
export interface ExtendedBlogPost extends Omit<Blog, 'nickname'> {
  nickname?: string; // API 응답과 일치
  subtitle?: string;
  image?: string; // 기존 호환성을 위한 속성
  imageUrl?: string; // API 응답과 일치하는 속성
  featured?: boolean;
  content?: string; // 기존 호환성을 위한 속성
  markdownContent?: string | Promise<string>; // API 응답과 일치
  contentFileUrl?: string; // API 응답과 일치하는 속성
  articleUrl?: string; // API 응답과 일치하는 속성
  author?: string; // 기존 호환성을 위한 속성
  publishDate?: string;
  readTime?: string;
  category?: string;
  images?: string[]; // 추가 이미지 배열
  imagePositions?: number[]; // 이미지가 삽입될 단락의 위치
}

export const BLOG_POSTS: ExtendedBlogPost[] = [
  {
    id: 1,
    title: '데이터 기반 아웃렛 마케팅 전략',
    subtitle: '더 보기 →',
    image: '/blog1.png',
    featured: true,
    nickname: '마케팅팀',
    author: '마케팅팀',
    publishDate: '2024-01-15',
    readTime: '5분',
    category: '데이터분석',
    images: ['/blog1.png', '/blog2.png', '/blog3.png'],
    imagePositions: [1, 3, 6], // 첫 번째, 세 번째, 여섯 번째 단락 뒤에 이미지 삽입
    content: `
      데이터 기반 아웃렛 마케팅은 현대 비즈니스에서 가장 중요한 전략 중 하나입니다. 
      고객의 행동 패턴과 선호도를 분석하여 개인화된 마케팅 메시지를 전달함으로써 
      더 높은 전환율과 고객 만족도를 달성할 수 있습니다.

      이 글에서는 데이터 분석을 통한 효과적인 아웃렛 마케팅 전략을 소개하고, 
      실제 사례를 통해 그 효과를 검증해보겠습니다.
    `,
    markdownContent: `
# 데이터 기반 아웃렛 마케팅 전략

데이터 기반 아웃렛 마케팅은 현대 비즈니스에서 가장 중요한 전략 중 하나입니다. 고객의 행동 패턴과 선호도를 분석하여 개인화된 마케팅 메시지를 전달함으로써 더 높은 전환율과 고객 만족도를 달성할 수 있습니다.

## 핵심 요소

### 1. 고객 데이터 분석
- **행동 패턴 분석**: 고객의 구매 이력과 웹사이트 방문 패턴
- **선호도 파악**: 제품 카테고리별 관심도와 구매 빈도
- **세그먼트 분류**: 연령, 성별, 지역, 소득 수준별 그룹화

### 2. 개인화 전략
개인화된 마케팅은 다음과 같은 요소로 구성됩니다:

\`\`\`javascript
// 고객 세그먼트 분석 예시
const customerSegments = {
  highValue: customers.filter(c => c.totalSpent > 1000000),
  frequent: customers.filter(c => c.purchaseCount > 10),
  newCustomer: customers.filter(c => c.joinDate > lastMonth)
};
\`\`\`

## 성공 사례

### 사례 1: 이커머스 플랫폼
- **개선 전**: 일반적인 이메일 마케팅 (전환율 2.1%)
- **개선 후**: 개인화된 추천 시스템 (전환율 8.7%)

### 사례 2: 소셜커머스
- **개선 전**: 일괄 발송 SMS (클릭률 1.2%)
- **개선 후**: 행동 기반 푸시 알림 (클릭률 15.3%)

## 구현 단계

1. **데이터 수집**
   - 웹사이트 분석 도구 설치
   - 고객 행동 추적 시스템 구축
   - 데이터베이스 설계

2. **분석 및 인사이트 도출**
   - 데이터 정제 및 전처리
   - 패턴 분석 알고리즘 적용
   - 마케팅 인사이트 생성

3. **개인화 시스템 구축**
   - 추천 엔진 개발
   - 실시간 개인화 로직 구현
   - A/B 테스트 시스템 구축

## 예상 효과

| 지표 | 개선 전 | 개선 후 | 개선율 |
|------|---------|---------|--------|
| 전환율 | 2.1% | 8.7% | +314% |
| 고객 만족도 | 3.2/5 | 4.5/5 | +41% |
| 재구매율 | 15% | 38% | +153% |

이 글을 통해 데이터 기반 아웃렛 마케팅의 핵심 요소와 구현 방법을 이해하셨기를 바랍니다. 실제 적용 시에는 비즈니스의 특성과 고객층에 맞게 조정하여 사용하시기 바랍니다.
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
    images: ['/blog2.png', '/blog1.png'],
    content: `
      고객 데이터를 효과적으로 분석하기 위해서는 몇 가지 핵심 포인트를 
      이해해야 합니다. 데이터의 품질, 분석 방법, 그리고 해석의 정확성이 
      모두 중요합니다.

      이 글에서는 실제 데이터 분석 프로젝트에서 얻은 인사이트를 
      공유하고, 성공적인 분석을 위한 팁을 제공합니다.
    `,
    markdownContent: `
# 고객 데이터 분석의 핵심 포인트

고객 데이터를 효과적으로 분석하기 위해서는 몇 가지 핵심 포인트를 이해해야 합니다. 데이터의 품질, 분석 방법, 그리고 해석의 정확성이 모두 중요합니다.

## 데이터 품질 관리

### 1. 데이터 정확성
- **중복 데이터 제거**: 동일한 고객의 중복 레코드 통합
- **누락 데이터 처리**: 결측값에 대한 적절한 처리 방법 적용
- **이상치 탐지**: 비정상적인 데이터 패턴 식별 및 처리

### 2. 데이터 일관성
\`\`\`sql
-- 데이터 일관성 검증 쿼리 예시
SELECT 
  customer_id,
  COUNT(*) as record_count,
  COUNT(DISTINCT email) as email_count
FROM customers 
GROUP BY customer_id 
HAVING COUNT(*) != COUNT(DISTINCT email);
\`\`\`

## 분석 방법론

### 정량적 분석
- **통계적 분석**: 평균, 분산, 상관관계 분석
- **시계열 분석**: 시간에 따른 변화 패턴 분석
- **군집 분석**: 유사한 특성을 가진 고객 그룹화

### 정성적 분석
- **고객 인터뷰**: 직접적인 피드백 수집
- **사용자 행동 관찰**: 실제 사용 패턴 분석
- **경쟁사 벤치마킹**: 시장 동향 파악

## 시각화 기법

### 1. 대시보드 구성
- **KPI 지표**: 핵심 성과 지표 실시간 모니터링
- **트렌드 차트**: 시간에 따른 변화 추이
- **분포도**: 데이터 분포 및 패턴 시각화

### 2. 인포그래픽
> 💡 **팁**: 복잡한 데이터는 시각적 요소를 활용하여 이해하기 쉽게 표현하는 것이 중요합니다.

## 실제 적용 사례

### 사례: 고객 생애 가치(LTV) 분석

**분석 목표**: 고객별 생애 가치를 계산하여 마케팅 예산 효율성 증대

**분석 과정**:
1. 구매 이력 데이터 수집
2. 고객별 평균 구매 금액 계산
3. 구매 빈도 및 지속 기간 분석
4. LTV 예측 모델 구축

**결과**: 상위 20% 고객이 전체 매출의 60%를 차지함을 확인

## 성공적인 분석을 위한 팁

1. **명확한 목표 설정**: 분석을 통해 얻고자 하는 인사이트를 명확히 정의
2. **적절한 도구 선택**: 데이터 규모와 복잡도에 맞는 분석 도구 활용
3. **지속적인 검증**: 분석 결과의 정확성을 지속적으로 검증
4. **액션 가능한 인사이트**: 실제 비즈니스에 적용 가능한 결론 도출

이 글을 통해 데이터 분석의 핵심 요소들을 이해하고, 실제 프로젝트에 적용하실 수 있기를 바랍니다.
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
