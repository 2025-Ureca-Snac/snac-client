'use client';

import React, { useState } from 'react';
import { MatchPartner } from '@/app/(shared)/stores/match-store';
import { api } from '@/app/(shared)/utils/api';
import { getApiErrorInfo } from '@/app/(shared)/types/api-errors';

interface UploadDataStepProps {
  partner: MatchPartner;
  tradeId: number;
  onNext: () => void;
}

export default function UploadDataStep({
  partner,
  tradeId,
  onNext,
}: UploadDataStepProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null); // 에러 초기화
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      setError('이미지 파일만 선택 가능합니다.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('파일을 선택해주세요.');
      return;
    }

    setError(null); // 에러 초기화
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await api.patch(
        `/matching/${tradeId}/send-data`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(response);

      setUploadSuccess(true);
      setTimeout(() => {
        onNext();
      }, 1000);
    } catch (error) {
      console.error('업로드 실패:', error);
      const errorInfo = getApiErrorInfo(error);
      setError(errorInfo.userMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          데이터 전송 확인
        </h2>

        <p className="text-lg text-gray-600 mb-6">
          구매자에게 데이터를 전송한 후 스크린샷을 업로드해주세요
        </p>

        {/* 거래 정보 */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">구매자:</span>
              <span className="ml-2 font-medium">{partner.buyer}</span>
            </div>
            <div>
              <span className="text-gray-600">통신사:</span>
              <span className="ml-2 font-medium">{partner.carrier}</span>
            </div>
            <div>
              <span className="text-gray-600">데이터:</span>
              <span className="ml-2 font-medium">{partner.dataAmount}GB</span>
            </div>
            <div>
              <span className="text-gray-600">가격:</span>
              <span className="ml-2 font-medium text-green-600">
                {partner.priceGb.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* 파일 업로드 영역 */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6">
          {!selectedFile ? (
            <div>
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">스크린샷을 업로드해주세요</p>
              <p className="text-sm text-gray-500">
                PNG, JPG, JPEG 파일만 가능
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          ) : (
            <div>
              <div className="text-green-500 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">
                선택된 파일: {selectedFile.name}
              </p>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                다른 파일 선택
              </button>
            </div>
          )}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* 업로드 버튼 */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading || uploadSuccess}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            !selectedFile || isUploading || uploadSuccess
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isUploading
            ? '업로드 중...'
            : uploadSuccess
              ? '업로드 완료!'
              : '업로드하기'}
        </button>

        {/* 안내 메시지 */}
        <div className="text-sm text-gray-500 mt-4 space-y-1">
          <p>*데이터 전송 스크린샷을 업로드해주세요</p>
          <p>*업로드 후 구매자가 확인하면 거래가 완료됩니다</p>
        </div>
      </div>
    </div>
  );
}
