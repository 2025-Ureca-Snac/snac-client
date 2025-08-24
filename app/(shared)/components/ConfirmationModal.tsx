'use client';

import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  isOpen,
  title = '확인',
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-card p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-muted text-foreground rounded-md hover:bg-secondary"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-primary-foreground rounded-md hover:bg-blue-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
