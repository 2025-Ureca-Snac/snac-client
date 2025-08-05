'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

interface DataUploadSectionProps {
  item: {
    carrier?: string;
    dataAmount?: string | number;
    phoneNumber?: string;
    status: string;
    cancelRequestStatus?: string | null;
  };
  onDataSent: (file: File) => Promise<void>;
}

export const DataUploadSection: React.FC<DataUploadSectionProps> = ({
  item,
  onDataSent,
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [uploadMessageType, setUploadMessageType] = useState<
    'success' | 'error' | null
  >(null);

  const messageTypeClasses = {
    success:
      'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700',
    error:
      'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700',
  };

  const getCarrierUrl = (carrier: string) => {
    switch (carrier) {
      case 'SKT':
        return 'https://www.tworld.co.kr/web/myt-data/giftdata?menuNm=T+끼리+데이터+선물';
      case 'KT':
        return 'https://www.kt.com/mypage/benefit/data-gift';
      case 'LGU+':
        return 'https://www.lguplus.co.kr/mypage/benefit/data-gift';
      default:
        return 'https://www.tworld.co.kr/web/myt-data/giftdata?menuNm=T+끼리+데이터+선물';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setUploadMessage('');
      setUploadMessageType(null);
    }
  };

  const handleDataSent = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    setUploadMessage('');
    setUploadMessageType(null);

    try {
      await onDataSent(uploadedFile);
      setUploadMessage('데이터 전송이 완료되었습니다.');
      setUploadMessageType('success');
      setUploadedFile(null);
    } catch (error: unknown) {
      setUploadMessage('데이터 전송 중 오류가 발생했습니다.');
      toast.error(
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.'
      );
      setUploadMessageType('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-gray-700 dark:text-gray-300 text-sm">
        아래 번호로{' '}
        <a
          href={getCarrierUrl(item.carrier || '')}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
        >
          {item.carrier || 'SKT'}
        </a>
        통신사의 데이터{item.dataAmount || '2GB'}를 전송해주세요
      </div>

      {/* 전화번호 표시 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          전화번호
        </label>
        <div className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-base font-semibold text-gray-900 dark:text-white">
          {item.phoneNumber || '010-0000-0000'}
        </div>
      </div>

      {/* 업로드된 파일 정보 */}
      {uploadedFile && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-xs">
                  📎
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  {uploadedFile.name}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </div>
              </div>
            </div>
            <button
              onClick={() => setUploadedFile(null)}
              className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
            >
              삭제
            </button>
          </div>
        </div>
      )}

      {/* 업로드 메시지 표시 */}
      {uploadMessage &&
        uploadMessageType &&
        messageTypeClasses[uploadMessageType] && (
          <div
            className={`p-3 rounded-lg text-sm ${messageTypeClasses[uploadMessageType]}`}
          >
            {uploadMessage}
          </div>
        )}

      {/* 액션 버튼 */}
      <div className="flex gap-2">
        <label className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer text-center">
          파일 업로드
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".webp,.jpg,.jpeg,.png"
          />
        </label>
        <button
          onClick={handleDataSent}
          disabled={!uploadedFile || isUploading}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            uploadedFile && !isUploading
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          {isUploading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              업로드 중입니다
            </div>
          ) : (
            '전송완료'
          )}
        </button>
      </div>
    </div>
  );
};
