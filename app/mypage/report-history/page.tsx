'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import SideMenu from '@/app/(shared)/components/SideMenu';
import TabNavigation from '@/app/(shared)/components/TabNavigation';
import AnimatedTabContent from '@/app/(shared)/components/AnimatedTabContent';
import InquiryModal from '@/app/(shared)/components/inquiry-modal';
import InquiryDetailModal from '@/app/(shared)/components/inquiry-detail-modal';
import {
  getInquiryList,
  getInquiryDetail,
  createInquiry,
  uploadImage,
} from '@/app/(shared)/utils/inquiry-api';
import {
  InquiryItem,
  InquiryDetailItem,
  DisputeType,
} from '@/app/(shared)/types/inquiry';
import { toast } from 'sonner';
import { handleApiError } from '@/app/(shared)/utils/api';
import Link from 'next/link';

/**
 * @author 이승우
 * @description 문의 내역 페이지 컴포넌트
 * @returns 문의 목록, 작성, 상세보기 기능을 포함한 문의 내역 페이지
 */
export default function InquiryHistoryPage() {
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

  /**
   * @author 이승우
   * @description 문의 목록 조회 함수
   * @param page - 페이지 번호 (기본값: 0)
   * @param loadMore - 추가 로드 여부 (기본값: false)
   */
  const loadInquiries = useCallback(
    async (page: number = 0, loadMore: boolean = false) => {
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
    },
    []
  );

  // 초기 로드
  useEffect(() => {
    loadInquiries(0, false);
  }, [loadInquiries]);

  /**
   * @author 이승우
   * @description 더보기 로드 핸들러
   */
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasNext) {
      loadInquiries(currentPage + 1, true);
    }
  }, [isLoadingMore, hasNext, currentPage, loadInquiries]);

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

  const tabs = [
    { id: 'all', label: '전체' },
    { id: 'pending', label: '답변 대기' },
    { id: 'answered', label: '답변 완료' },
  ];

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
      // 이미지가 있으면 먼저 업로드
      let attachmentKeys: string[] = [];
      if (inquiry.images && inquiry.images.length > 0) {
        const uploadPromises = inquiry.images.map((image) =>
          uploadImage(image)
        );
        attachmentKeys = await Promise.all(uploadPromises);
      }

      // 문의 데이터 생성
      const inquiryData = {
        title: inquiry.title,
        type: inquiry.category as DisputeType,
        description: inquiry.content,
        attachmentKeys: attachmentKeys.length > 0 ? attachmentKeys : undefined,
      };

      await createInquiry(inquiryData);
      toast.success('문의가 성공적으로 제출되었습니다.');
      setIsInquiryModalOpen(false);
      // 문의 목록 새로고침
      loadInquiries(0, false);
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
            onClick={() => setIsInquiryModalOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                <AnimatedTabContent tabKey={activeTab}>
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
                              <div className="font-semibold text-gray-900 mb-1">
                                {item.title}
                              </div>
                              <div className="text-sm text-gray-600 mb-2">
                                {item.type}
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
    </div>
  );
}
