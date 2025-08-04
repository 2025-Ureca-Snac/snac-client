'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import SideMenu from '@/app/(shared)/components/SideMenu';
import TabNavigation from '@/app/(shared)/components/TabNavigation';
import AnimatedTabContent from '@/app/(shared)/components/AnimatedTabContent';
import InquiryModal from '@/app/(shared)/components/inquiry-modal';
import InquiryDetailModal from '@/app/(shared)/components/inquiry-detail-modal';
import ReportModal from '@/app/(shared)/components/report-modal';
import {
  getInquiryList,
  getInquiryDetail,
} from '@/app/(shared)/utils/inquiry-api';
import {
  InquiryItem,
  InquiryDetailItem,
  DisputeType,
} from '@/app/(shared)/types/inquiry';
import { toast } from 'sonner';
import { handleApiError } from '@/app/(shared)/utils/api';
import { useInquiries } from '@/app/(shared)/hooks/use-inquiries';
import { useReports } from '@/app/(shared)/hooks/use-reports';
import Link from 'next/link';

/**
 * @author 이승우
 * @description 문의 내역 페이지 컴포넌트
 * @returns 문의 목록, 작성, 상세보기 기능을 포함한 문의 내역 페이지
 */
export default function InquiryHistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'answered'>(
    'all'
  );
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] =
    useState<InquiryDetailItem | null>(null);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 신고하기 모달 상태
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTradeId, setReportTradeId] = useState<string>('');
  const [reportTradeType, setReportTradeType] = useState<string>('');

  // 커스텀 훅 사용
  const { createInquiry } = useInquiries();
  const { createReport } = useReports();

  // 중복 호출 방지를 위한 ref
  const isInitialLoadRef = useRef(false);

  // 슬라이드 관련 상태
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  /**
   * @author 이승우
   * @description 문의 목록 조회 함수
   * @param page - 페이지 번호 (기본값: 0)
   * @param loadMore - 추가 로드 여부 (기본값: false)
   */
  const loadInquiries = async (page: number = 0, loadMore: boolean = false) => {
    try {
      setIsLoading(!loadMore);
      setIsLoadingMore(loadMore);

      const response = await getInquiryList(page, 20);

      console.log('문의 목록 API 응답:', response);

      if (loadMore) {
        setInquiries((prev) => [...prev, ...response.content]);
      } else {
        setInquiries(response.content);
      }

      setCurrentPage(response.number);
      setHasNext(!response.last);
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    // 이미 초기 로드가 완료되었으면 중복 호출 방지
    if (isInitialLoadRef.current) {
      return;
    }

    let isMounted = true;
    isInitialLoadRef.current = true;

    const loadData = async () => {
      if (isMounted) {
        console.log('문의 내역 초기 로드 시작');
        await loadInquiries(0, false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []); // loadInquiries 의존성 제거

  // URL 파라미터 처리 - 신고하기 모달 자동 열기
  useEffect(() => {
    const shouldOpenReportModal = searchParams.get('report');
    const tradeId = searchParams.get('tradeId');
    const tradeType = searchParams.get('tradeType');

    if (shouldOpenReportModal === 'true' && tradeId && tradeType) {
      setReportTradeId(tradeId);
      setReportTradeType(tradeType);
      setIsReportModalOpen(true);

      // URL에서 파라미터 제거
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('report');
      newUrl.searchParams.delete('tradeId');
      newUrl.searchParams.delete('tradeType');
      router.replace(newUrl.pathname + newUrl.search);
    }
  }, [searchParams.toString(), router]); // searchParams.toString()으로 변경

  /**
   * @author 이승우
   * @description 더보기 로드 핸들러
   */
  const handleLoadMore = () => {
    if (!isLoadingMore && hasNext) {
      loadInquiries(currentPage + 1, true);
    }
  };

  /**
   * @author 이승우
   * @description 문의 카테고리를 한글로 변환
   * @param type 문의 타입
   * @returns 한글 카테고리명
   */
  const getCategoryName = (type: string): string => {
    switch (type) {
      case DisputeType.DATA_NONE:
        return '데이터 안옴';
      case DisputeType.DATA_PARTIAL:
        return '일부만 수신';
      case DisputeType.PAYMENT:
        return '결제 관련';
      case DisputeType.ACCOUNT:
        return '계정 관련';
      case DisputeType.TECHNICAL_PROBLEM:
        return '기술적 문제';
      case DisputeType.QNA_OTHER:
      case DisputeType.REPORT_OTHER:
        return '기타';
      default:
        return type;
    }
  };

  /**
   * @author 이승우
   * @description 탭별 필터링된 문의 목록
   */
  const filteredInquiries = useMemo(() => {
    if (!inquiries) return [];
    if (activeTab === 'all') return inquiries;
    return inquiries.filter((inquiry) => {
      if (activeTab === 'pending') return inquiry.status === 'IN_PROGRESS';
      if (activeTab === 'answered') return inquiry.answerAt !== null;
      return true;
    });
  }, [inquiries, activeTab]);

  const tabs = useMemo(
    () => [
      { id: 'all', label: '전체' },
      { id: 'pending', label: '답변 대기' },
      { id: 'answered', label: '답변 완료' },
    ],
    []
  );

  // 슬라이드 핸들러
  const handleDragStart = useCallback((clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
  }, []);

  const handleDragMove = useCallback(
    (clientX: number) => {
      if (!isDragging) return;
      setCurrentX(clientX);
    },
    [isDragging]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    const deltaX = currentX - startX;
    const threshold = 100; // 슬라이드 감지 임계값

    if (Math.abs(deltaX) > threshold) {
      const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);

      if (deltaX > 0 && currentIndex > 0) {
        // 오른쪽으로 스와이프 - 이전 탭
        setActiveTab(tabs[currentIndex - 1].id as typeof activeTab);
      } else if (deltaX < 0 && currentIndex < tabs.length - 1) {
        // 왼쪽으로 스와이프 - 다음 탭
        setActiveTab(tabs[currentIndex + 1].id as typeof activeTab);
      }
    }

    setIsDragging(false);
  }, [isDragging, currentX, startX, activeTab, tabs]);

  // 슬라이드 방향 감지
  const getSlideDirection = () => {
    const deltaX = currentX - startX;
    if (Math.abs(deltaX) < 20) return null;
    return deltaX > 0 ? 'right' : 'left';
  };

  // 슬라이드 방향에 따른 애니메이션 설정
  const getSlideAnimation = () => {
    const deltaX = currentX - startX;

    if (Math.abs(deltaX) < 20) return { x: 0 };

    if (deltaX > 0) {
      // 오른쪽으로 슬라이드 - 현재 화면이 오른쪽으로 나감
      const progress = Math.min(Math.abs(deltaX) / 150, 1);
      return {
        x: Math.min(deltaX * 0.3, 200), // 더 부드러운 이동
        opacity: 1 - progress * 0.3, // 약간 투명해짐
      };
    } else {
      // 왼쪽으로 슬라이드 - 현재 화면이 왼쪽으로 나감
      const progress = Math.min(Math.abs(deltaX) / 150, 1);
      return {
        x: Math.max(deltaX * 0.3, -200), // 더 부드러운 이동
        opacity: 1 - progress * 0.3, // 약간 투명해짐
      };
    }
  };

  // 터치 이벤트 핸들러
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      handleDragStart(e.touches[0].clientX);
    },
    [handleDragStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
      }
      handleDragMove(e.touches[0].clientX);
    },
    [handleDragMove, isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // 마우스 이벤트 핸들러
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handleDragStart(e.clientX);
    },
    [handleDragStart]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      handleDragMove(e.clientX);
    },
    [handleDragMove]
  );

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      handleDragEnd();
    }
  }, [isDragging, handleDragEnd]);

  /**
   * @author 이승우
   * @description 문의 제출 핸들러
   * @param inquiry - 제출할 문의 데이터
   */
  const handleInquirySubmit = async (inquiry: {
    title: string;
    content: string;
    category: string;
    images?: File[];
  }) => {
    try {
      const success = await createInquiry(inquiry);
      if (success) {
        setIsInquiryModalOpen(false);
        // 문의 목록 새로고침
        loadInquiries(0, false);
      }
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  /**
   * @author 이승우
   * @description 문의 상세 보기 핸들러
   * @param inquiry - 조회할 문의 아이템
   */
  const handleInquiryClick = async (inquiry: InquiryItem) => {
    // 슬라이드 중에는 모달 열지 않음
    if (isDragging) return;

    try {
      console.log('문의 상세 조회 시작:', inquiry.disputeId);
      const inquiryDetail = await getInquiryDetail(inquiry.disputeId);
      console.log('문의 상세 조회 결과:', inquiryDetail);
      setSelectedInquiry(inquiryDetail);
      setIsDetailModalOpen(true);
      console.log('모달 상태 설정 완료');
    } catch (error) {
      console.error('문의 상세 조회 에러:', error);
      toast.error(handleApiError(error));
    }
  };

  /**
   * @author 이승우
   * @description 신고하기 제출 핸들러
   * @param data - 신고 데이터
   */
  const handleSubmitReport = async (data: {
    title: string;
    content: string;
    category: string;
    images: File[];
    tradeId?: string;
    tradeType?: string;
  }) => {
    try {
      const success = await createReport(data);
      if (success) {
        setIsReportModalOpen(false);
        setReportTradeId('');
        setReportTradeType('');

        // 목록 새로고침
        loadInquiries(0, false);
      }
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  // PC 헤더
  const DesktopHeader = () => (
    <div className="hidden md:block mb-8">
      {/* 네비게이션 */}
      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/mypage"
          className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
        >
          마이페이지
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">문의 내역</span>
      </div>

      {/* 제목과 설명 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">문의 내역</h1>
            <p className="text-gray-600 text-lg">
              문의한 거래와 문의 받은 거래 내역을 확인하세요
            </p>
          </div>
          <button
            onClick={() => !isDragging && setIsInquiryModalOpen(true)}
            disabled={isDragging}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            문의 작성
          </button>
        </div>
      </div>
    </div>
  );

  // 모바일 헤더
  const MobileHeader = () => (
    <div className="md:hidden mb-6">
      {/* 네비게이션 */}
      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/mypage"
          className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
        >
          마이페이지
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">문의 내역</span>
      </div>

      {/* 제목 */}
      <h1 className="text-xl font-bold text-gray-900">문의 내역</h1>
    </div>
  );

  // 초기 로딩 중일 때 스피너 표시
  if (isLoading && inquiries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">문의 내역을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="flex w-full min-h-screen">
        {/* 좌측 메뉴 (데스크탑만) */}
        <div className="hidden md:block w-64 flex-shrink-0 md:pt-8 md:pl-4">
          <SideMenu />
        </div>

        {/* 메인 컨텐츠 */}
        <main className="flex-1 flex flex-col md:pt-8 pt-4 md:px-6 px-2">
          <div className="max-w-4xl mx-auto w-full">
            {/* PC 헤더 */}
            <DesktopHeader />

            {/* 모바일 헤더 */}
            <MobileHeader />

            <section className="w-full max-w-full">
              <div className="bg-white rounded-lg shadow-sm border">
                {/* 탭 네비게이션 */}
                <TabNavigation
                  tabs={tabs}
                  activeTab={activeTab}
                  onTabChange={(tabId: string) => {
                    setActiveTab(tabId as typeof activeTab);
                    setCurrentPage(0); // 탭 변경 시 페이지 초기화
                  }}
                  activeTextColor="text-green-600"
                  inactiveTextColor="text-gray-500"
                  underlineColor="bg-green-600"
                />

                {/* 문의 내역 리스트 */}
                <motion.div
                  className="select-none overflow-hidden"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  animate={
                    isDragging ? getSlideAnimation() : { x: 0, opacity: 1 }
                  }
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 25,
                  }}
                >
                  <AnimatedTabContent
                    tabKey={activeTab}
                    slideDirection={getSlideDirection()}
                  >
                    <div className="p-6">
                      {isLoading ? (
                        <div className="text-center py-8 text-gray-500">
                          로딩 중...
                        </div>
                      ) : (filteredInquiries?.length || 0) > 0 ? (
                        <div className="space-y-4">
                          {filteredInquiries?.map((item: InquiryItem) => (
                            <div
                              key={item.disputeId}
                              className="bg-gray-50 rounded-lg p-4 flex items-start gap-3 cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => handleInquiryClick(item)}
                            >
                              {/* 아이콘 */}
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 font-bold text-lg">
                                  T
                                </span>
                              </div>

                              {/* 내용 */}
                              <div className="flex-1">
                                <div className="text-sm text-gray-500 mb-1">
                                  {new Date(item.createdAt).toLocaleDateString(
                                    'ko-KR'
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="font-semibold text-gray-900">
                                    {item.title}
                                  </div>
                                  {/* 신고/문의 구분 배지 */}
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full ${
                                      item.category === 'REPORT'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-blue-100 text-blue-800'
                                    }`}
                                  >
                                    {item.category === 'REPORT'
                                      ? '신고'
                                      : '문의'}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                  {getCategoryName(item.type)}
                                </div>

                                {/* 상태 표시 */}
                                <div className="mt-2">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      item.status === 'IN_PROGRESS'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-green-100 text-green-800'
                                    }`}
                                  >
                                    {item.status === 'IN_PROGRESS'
                                      ? '답변 대기'
                                      : '답변 완료'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* 더보기 버튼 */}
                          {hasNext && (
                            <div className="text-center pt-4">
                              <button
                                onClick={handleLoadMore}
                                disabled={isLoadingMore}
                                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                              >
                                {isLoadingMore ? '로딩 중...' : '더보기'}
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          {activeTab === 'all'
                            ? '문의 내역이 없습니다.'
                            : activeTab === 'pending'
                              ? '답변 대기 중인 문의가 없습니다.'
                              : '답변 완료된 문의가 없습니다.'}
                        </div>
                      )}
                    </div>
                  </AnimatedTabContent>
                </motion.div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* 문의 작성 모달 */}
      <InquiryModal
        open={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        onSubmit={handleInquirySubmit}
      />

      {/* 문의 상세 모달 */}
      <InquiryDetailModal
        open={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedInquiry(null);
        }}
        inquiry={selectedInquiry}
      />

      {/* 신고하기 모달 */}
      <ReportModal
        open={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setReportTradeId('');
          setReportTradeType('');
        }}
        onSubmit={handleSubmitReport}
        tradeId={reportTradeId}
        tradeType={reportTradeType}
      />
    </div>
  );
}
