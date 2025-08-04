'use client';
import React, { useState, useRef } from 'react';
import ModalPortal from './modal-portal';
import { toast } from 'sonner';

const REPORT_CATEGORIES = [
  { value: 'DATA_NONE', label: '데이터 안옴' },
  { value: 'DATA_PARTIAL', label: '일부만 수신' },
  { value: 'REPORT_OTHER', label: '기타' },
];

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (report: {
    title: string;
    content: string;
    category: string;
    images: File[];
    tradeId?: string;
    tradeType?: string;
  }) => Promise<void>;
  tradeId?: string;
  tradeType?: string; // 'SALE' 또는 'PURCHASE'
}

export default function ReportModal({
  open,
  onClose,
  onSubmit,
  tradeId,
  tradeType,
}: ReportModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('DATA_NONE');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // 이미지 개수 제한 확인
    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`이미지는 최대 ${MAX_IMAGES}개까지 첨부할 수 있습니다.`);
      return;
    }

    // 파일 크기 및 타입 검증
    const validFiles = files.filter((file) => {
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(`${file.name}의 크기가 5MB를 초과합니다.`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name}은 이미지 파일이 아닙니다.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // 이미지 미리보기 생성
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]); // 메모리 누수 방지
      return prev.filter((_, i) => i !== index);
    });
  };

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
  };

  const goToPreviousImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? imagePreviews.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === imagePreviews.length - 1 ? 0 : prev + 1
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    if (e.key === 'Escape') {
      closeImageModal();
    } else if (e.key === 'ArrowLeft') {
      goToPreviousImage();
    } else if (e.key === 'ArrowRight') {
      goToNextImage();
    }
  };

  /**
   * @author 이승우
   * @description 폼 초기화 함수
   */
  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('DATA_NONE');
    setImages([]);
    setImagePreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url)); // 메모리 누수 방지
      return [];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      toast.error('내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        category,
        images,
        tradeId,
        tradeType,
      });

      // 폼 초기화
      resetForm();
    } catch (error) {
      console.error('신고 제출 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (title.trim() || content.trim() || images.length > 0) {
      if (confirm('작성 중인 내용이 있습니다. 정말로 닫으시겠습니까?')) {
        resetForm();
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <>
      <ModalPortal isOpen={open} onClose={handleClose}>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">신고하기</h2>
                {tradeId && (
                  <p className="text-sm text-gray-500 mt-1">
                    거래 ID: {tradeId}
                  </p>
                )}
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* 폼 */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* 카테고리 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  신고 카테고리
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  {REPORT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="신고 제목을 입력해주세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  maxLength={100}
                />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {title.length}/100
                </div>
              </div>

              {/* 내용 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="신고 내용을 자세히 입력해주세요"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 resize-none"
                  maxLength={1000}
                />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {content.length}/1000
                </div>
              </div>

              {/* 이미지 업로드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지 첨부 (선택)
                </label>
                <div className="space-y-3">
                  {/* 이미지 미리보기 */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`첨부 이미지 ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md border cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => openImageModal(index)}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            disabled={isSubmitting}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 이미지 업로드 버튼 */}
                  {images.length < MAX_IMAGES && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isSubmitting}
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50"
                    >
                      <div className="flex flex-col items-center text-gray-500">
                        <svg
                          className="w-8 h-8 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span className="text-sm">이미지 추가</span>
                        <span className="text-xs mt-1">
                          최대 {MAX_IMAGES}개, 각 5MB 이하
                        </span>
                      </div>
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '제출 중...' : '신고 제출'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </ModalPortal>

      {/* 이미지 상세보기 모달 */}
      {imageModalOpen && (
        <ModalPortal isOpen={imageModalOpen} onClose={closeImageModal}>
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4"
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()} // 클릭 이벤트 버블링 방지
            tabIndex={0}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeImageModal();
              }}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* 이전 버튼 */}
            {imagePreviews.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPreviousImage();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* 이미지 */}
            <div className="relative max-w-full max-h-full">
              <img
                src={imagePreviews[selectedImageIndex]}
                alt={`이미지 ${selectedImageIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain"
              />

              {/* 이미지 인디케이터 */}
              {imagePreviews.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {imagePreviews.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === selectedImageIndex
                          ? 'bg-white'
                          : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 다음 버튼 */}
            {imagePreviews.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextImage();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {/* 이미지 정보 */}
            <div className="absolute bottom-4 left-4 text-white text-sm">
              {selectedImageIndex + 1} / {imagePreviews.length}
            </div>
          </div>
        </ModalPortal>
      )}
    </>
  );
}
