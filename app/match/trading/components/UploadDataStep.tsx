'use client';

import React, { useState } from 'react';
import { MatchPartner } from '@/app/(shared)/stores/match-store';
import { api } from '@/app/(shared)/utils/api';
import {
  API_STATUS,
  UPLOAD_ERROR_MESSAGE,
} from '@/app/(shared)/constants/api-status';
import type { SendDataResponse } from '@/app/(shared)/types/api';

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
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [uploadMessageType, setUploadMessageType] = useState<
    'error' | 'success'
  >('error');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadMessage(''); // 메시지 초기화
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      setUploadMessage('이미지 파일만 선택 가능합니다.');
      setUploadMessageType('error');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage('파일을 선택해주세요.');
      setUploadMessageType('error');
      return;
    }

    try {
      setIsUploading(true);
      setUploadMessage('');
      setUploadMessageType('error');

      console.log('데이터 전송 완료 버튼 클릭됨:', {
        tradeId,
        fileName: selectedFile.name,
      });

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await api.patch<SendDataResponse>(
        `/matching/${tradeId}/send-data`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('데이터 전송 완료 처리됨', response);

      // 응답 상태에 따른 처리
      if (response.data.status === API_STATUS.OK) {
        // 성공 시 다음 단계로 진행
        setUploadSuccess(true);
        setUploadMessage('업로드가 완료되었습니다!');
        setUploadMessageType('success');
        setTimeout(() => {
          onNext();
        }, 1000);
        return;
      }

      let errorMessage: string = UPLOAD_ERROR_MESSAGE.DEFAULT;
      switch (response.data.status) {
        case API_STATUS.BAD_REQUEST:
          errorMessage = response.data.data || UPLOAD_ERROR_MESSAGE.BAD_IMAGE;
          break;
        case API_STATUS.GATEWAY_TIMEOUT:
          errorMessage = UPLOAD_ERROR_MESSAGE.TIMEOUT;
          break;
      }
      setUploadMessage(errorMessage);
      setUploadMessageType('error');

      setSelectedFile(null); // 전송 완료 후 파일 정보 초기화
    } catch (error) {
      console.error('데이터 전송 완료 처리 실패:', error);
      setUploadMessage(UPLOAD_ERROR_MESSAGE.DEFAULT);
      setUploadMessageType('error');
      setSelectedFile(null); // 에러 발생 시 파일 선택 초기화
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* 메인 카드 - 투명 배경 */}
      <div className="relative bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
        {/* 서브틀한 글로우 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 via-transparent to-blue-300/3"></div>

        <div className="relative p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-300 to-white bg-clip-text text-transparent mb-4">
              데이터 전송 확인
            </h2>

            <p className="text-lg text-gray-300 mb-6">
              구매자에게 데이터를 전송한 후 스크린샷을 업로드해주세요
            </p>

            {/* 거래 정보 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-700/50">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">구매자:</span>
                  <span className="ml-2 font-medium text-white">
                    {partner.buyerNickname}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">통신사:</span>
                  <span className="ml-2 font-medium text-white">
                    {partner.carrier}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">데이터:</span>
                  <span className="ml-2 font-medium text-white">
                    {partner.dataAmount}GB
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">가격:</span>
                  <span className="ml-2 font-medium text-green-400">
                    {partner.priceGb.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>

            {/* 파일 업로드 영역 */}
            <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 mb-6 bg-gray-800/30">
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
                  <p className="text-gray-300 mb-2">
                    스크린샷을 업로드해주세요
                  </p>
                  <p className="text-sm text-gray-400">
                    PNG, JPG, JPEG 파일만 가능
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="mt-4 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30 file:border file:border-purple-400/30"
                  />
                </div>
              ) : (
                <div>
                  <div className="text-green-400 mb-4">
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
                  <p className="text-gray-300 mb-2">
                    선택된 파일: {selectedFile.name}
                  </p>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-sm text-purple-400 hover:text-purple-300"
                  >
                    다른 파일 선택
                  </button>
                </div>
              )}
            </div>

            {/* 에러 메시지 */}
            {uploadMessage && (
              <div
                className={`mb-4 p-4 rounded-xl ${uploadMessageType === 'error' ? 'bg-red-900/20 border border-red-400/30' : 'bg-green-900/20 border border-green-400/30'}`}
              >
                <div className="flex items-center">
                  {uploadMessageType === 'error' ? (
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
                  ) : (
                    <svg
                      className="w-5 h-5 text-green-400 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L13 10.586l-1.293 1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <p
                    className={`${uploadMessageType === 'error' ? 'text-red-200' : 'text-green-300'} text-sm`}
                  >
                    {uploadMessage}
                  </p>
                </div>
              </div>
            )}

            {/* 업로드 버튼 */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading || uploadSuccess}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden group ${
                !selectedFile || isUploading || uploadSuccess
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-400 to-purple-500 text-black hover:from-purple-300 hover:to-purple-400 shadow-lg hover:shadow-purple-400/25'
              }`}
            >
              {isUploading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>업로드 중...</span>
                </span>
              ) : uploadSuccess ? (
                <span className="flex items-center justify-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>업로드 완료!</span>
                </span>
              ) : (
                <>
                  <span className="relative z-10">업로드하기</span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                </>
              )}
            </button>

            {/* 안내 메시지 */}
            <div className="text-sm text-gray-400 mt-4 space-y-1">
              <p>*데이터 전송 스크린샷을 업로드해주세요</p>
              <p>*업로드 후 구매자가 확인하면 거래가 완료됩니다</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
