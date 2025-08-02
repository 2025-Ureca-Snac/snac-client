'use client';

import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';

import { Editor } from '@toast-ui/react-editor';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import Prism from 'prismjs';
import { useEffect, useRef } from 'react';

interface ToastEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

export const ToastEditor = ({ initialValue, onChange }: ToastEditorProps) => {
  const editorRef = useRef<Editor>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setMarkdown(initialValue);
    }
  }, [initialValue]);

  const handleChange = () => {
    const value = editorRef.current?.getInstance().getMarkdown() || '';
    onChange(value);
  };

  return (
    <Editor
      ref={editorRef}
      initialValue={initialValue}
      previewStyle="vertical"
      height="500px"
      initialEditType="markdown"
      useCommandShortcut={true}
      plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
      onChange={handleChange}
    />
  );
};
