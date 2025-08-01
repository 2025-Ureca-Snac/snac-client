'use client';

import { useState } from 'react';
import SideMenu from '@/app/(shared)/components/SideMenu';
import TabNavigation from '@/app/(shared)/components/TabNavigation';
import AnimatedTabContent from '@/app/(shared)/components/AnimatedTabContent';
import InquiryModal from '@/app/(shared)/components/inquiry-modal';
import InquiryDetailModal from '@/app/(shared)/components/inquiry-detail-modal';
import Link from 'next/link';

interface InquiryItem {
  id: number;
  date: string;
  title: string;
  price: number;
  reason?: string;
  status?: 'pending' | 'answered';
  content?: string;
  category?: string;
  createdAt?: string;
  answer?: {
    content: string;
    answeredAt: string;
  };
}

export default function InquiryHistoryPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'answered'>(
    'all'
  );
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<{
    id: number;
    title: string;
    content: string;
    category: string;
    status: 'pending' | 'answered';
    createdAt: string;
    answer?: {
      content: string;
      answeredAt: string;
    };
  } | null>(null);

  const allInquiries: InquiryItem[] = [
    {
      id: 1,
      date: '2025.07.03',
      title: '거래 중 문제가 발생했습니다',
      price: 2000,
      status: 'answered',
      category: '거래 관련',
      content:
        '거래 중 상대방이 응답하지 않아서 문제가 발생했습니다. 어떻게 해야 하나요?',
      answer: {
        content:
          '안녕하세요. 거래 중 상대방이 응답하지 않는 경우, 거래를 취소하고 새로운 거래를 진행하시는 것을 권장드립니다. 추가 문의사항이 있으시면 언제든 연락주세요.',
        answeredAt: '2025.07.04',
      },
    },
    {
      id: 2,
      date: '2025.07.02',
      title: '결제 오류 문의',
      price: 5000,
      status: 'pending',
      category: '결제 관련',
      content: '결제 시 오류가 발생하여 문의드립니다.',
    },
    {
      id: 3,
      date: '2025.07.01',
      title: '계정 관련 문의',
      price: 0,
      status: 'answered',
      category: '계정 관련',
      content: '계정 정보 변경에 대한 문의입니다.',
      answer: {
        content: '계정 정보 변경은 마이페이지에서 가능합니다.',
        answeredAt: '2025.07.02',
      },
    },
  ];

  const filteredInquiries = allInquiries.filter((inquiry) => {
    if (activeTab === 'all') return true;
    return inquiry.status === activeTab;
  });

  const tabs = [
    { id: 'all', label: '전체' },
    { id: 'pending', label: '답변 대기' },
    { id: 'answered', label: '답변 완료' },
  ];

  // 문의 제출 핸들러
  const handleInquirySubmit = async (inquiry: {
    title: string;
    content: string;
    category: string;
  }) => {
    try {
      // TODO: API 호출로 문의 제출
      console.log('문의 제출:', inquiry);

      // 임시로 성공 메시지 표시
      alert('문의가 성공적으로 제출되었습니다.');

      // TODO: 문의 목록 새로고침
    } catch (error) {
      console.error('문의 제출 실패:', error);
      throw error;
    }
  };

  // 문의 상세 보기 핸들러
  const handleInquiryClick = (inquiry: InquiryItem) => {
    // InquiryItem을 InquiryDetail로 변환
    const inquiryDetail = {
      id: inquiry.id,
      title: inquiry.title,
      content: inquiry.content || '',
      category: inquiry.category || '기타',
      status: inquiry.status || 'pending',
      createdAt: inquiry.createdAt || inquiry.date,
      answer: inquiry.answer,
    };
    setSelectedInquiry(inquiryDetail);
    setIsDetailModalOpen(true);
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
                  onTabChange={(tabId: string) =>
                    setActiveTab(tabId as typeof activeTab)
                  }
                  activeTextColor="text-green-600"
                  inactiveTextColor="text-gray-500"
                  underlineColor="bg-green-600"
                />

                {/* 문의 내역 리스트 */}
                <AnimatedTabContent tabKey={activeTab}>
                  <div className="p-6">
                    {filteredInquiries.length > 0 ? (
                      <div className="space-y-4">
                        {filteredInquiries.map((item: InquiryItem) => (
                          <div
                            key={item.id}
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
                                {item.date}
                              </div>
                              <div className="font-semibold text-gray-900 mb-1">
                                {item.title}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-900">
                                  {item.price.toLocaleString()}원
                                </span>
                              </div>

                              {/* 상태 표시 */}
                              {item.status && (
                                <div className="mt-2">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      item.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-green-100 text-green-800'
                                    }`}
                                  >
                                    {item.status === 'pending'
                                      ? '답변 대기'
                                      : '답변 완료'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
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
