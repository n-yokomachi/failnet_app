'use client';

import { useEffect } from 'react';

interface Post {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  displayDate: string;
  reactions: number;
}

interface PostDetailModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

export default function PostDetailModal({ post, isOpen, onClose }: PostDetailModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal content */}
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start space-x-3 mb-4 pr-8">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                  {post.author.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{post.author}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-4">{post.displayDate}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="mb-6">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg">
                {post.content}
              </p>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  😅 {post.reactions} リアクション
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}