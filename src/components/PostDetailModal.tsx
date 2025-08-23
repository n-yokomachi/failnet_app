'use client';

import { useState, useEffect } from 'react';
import ReactionPicker from './ReactionPicker';
import { addReactionAction, removeReactionAction, type ReactionData } from '@/app/actions/reactions';
import { generateShareImage } from './ShareImageGenerator';

interface Post {
  id: string;
  content: string;
  author: string;
  authorImage?: string;
  createdAt: string;
  displayDate: string;
  reactions: number;
  category?: string;
  reactionData?: string | null;
}

interface PostDetailModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onReactionUpdate?: () => void;
}

export default function PostDetailModal({ post, isOpen, onClose, onReactionUpdate }: PostDetailModalProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const [showImageTip, setShowImageTip] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [currentReactionData, setCurrentReactionData] = useState<ReactionData>(() => {
    if (post.reactionData) {
      try {
        return JSON.parse(post.reactionData);
      } catch (error) {
        console.error('Error parsing reaction data:', error);
        return {};
      }
    }
    return {};
  });
  const [totalReactions, setTotalReactions] = useState(post.reactions);
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

  const handleReactionPickerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setPickerPosition({
      top: rect.top - 120,
      left: rect.left - 100,
    });
    setShowReactionPicker(true);
  };

  const handleExistingReactionClick = async (emoji: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const result = await addReactionAction(post.id, emoji);
      if (result.success) {
        setCurrentReactionData(result.reactionData!);
        setTotalReactions(result.totalReactions!);
        onReactionUpdate?.();
      }
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  const handleReactionSelect = async (emoji: string) => {
    console.log('🎯 handleReactionSelect called with:', { emoji, postId: post.id });
    try {
      const result = await addReactionAction(post.id, emoji);
      console.log('📤 addReactionAction result:', result);
      if (result.success) {
        setCurrentReactionData(result.reactionData!);
        setTotalReactions(result.totalReactions!);
        onReactionUpdate?.();
      } else {
        console.error('❌ Reaction action failed:', result.error);
        alert('リアクションの追加に失敗しました: ' + result.error);
      }
    } catch (error) {
      console.error('💥 Failed to add reaction:', error);
      alert('リアクションの追加でエラーが発生しました: ' + error);
    }
  };

  const handleImageShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGeneratingImage(true);
    try {
      const success = await generateShareImage(post);
      if (success) {
        setShowImageTip(true);
        setTimeout(() => setShowImageTip(false), 3000);
      } else {
        alert('画像の生成に失敗しました');
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('画像の生成でエラーが発生しました');
    } finally {
      setIsGeneratingImage(false);
    }
  };

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
              <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
                {post.authorImage && !imageLoadError ? (
                  <img 
                    src={`/assets/images/${post.authorImage}`} 
                    alt={post.author}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: 'crisp-edges' }}
                    onError={() => setImageLoadError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                      {post.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
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
              {post.category && (
                <div className="mt-4">
                  <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              )}
            </div>

            {/* Reactions */}
            <div className="mb-6">
              <div 
                className="flex items-center flex-wrap gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {Object.entries(currentReactionData).map(([emoji, count]) => (
                  <button
                    key={emoji}
                    onClick={(e) => handleExistingReactionClick(emoji, e)}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm transition-colors"
                  >
                    <span>{emoji}</span>
                    <span className="text-gray-600 dark:text-gray-300">{count}</span>
                  </button>
                ))}
                
                {/* Add Reaction Button */}
                <button
                  onClick={handleReactionPickerClick}
                  className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                  aria-label="リアクションを追加"
                >
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  投稿日時: {post.displayDate}
                </div>
                <div className="flex gap-1">
                  {/* Image Share Button */}
                  <div className="relative">
                    <button
                      onClick={handleImageShareClick}
                      disabled={isGeneratingImage}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50"
                      aria-label="画像として共有"
                    >
                      {isGeneratingImage ? (
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                    {showImageTip && (
                      <div className="absolute -top-10 right-0 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                        Image Copied!
                        <div className="absolute top-full right-2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* URL Share Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const url = `${window.location.origin}/${post.id}`;
                      navigator.clipboard.writeText(url);
                    }}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    aria-label="URLを共有"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reaction Picker */}
      <ReactionPicker
        isOpen={showReactionPicker}
        onClose={() => setShowReactionPicker(false)}
        onReactionSelect={handleReactionSelect}
        position={pickerPosition}
      />
    </div>
  );
}