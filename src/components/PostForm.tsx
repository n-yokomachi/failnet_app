'use client';

import { useState } from 'react';
import { client } from '@/lib/amplify';
import { contentModerationService, ModerationResult } from '@/lib/contentModeration';

const animalNames = ['ハリネズミ', 'フクロウ', 'コアラ', 'ペンギン', 'キツネ', 'リス', 'パンダ', 'ウサギ'];

interface PostFormProps {
  onPostCreated: () => void;
}

export default function PostForm({ onPostCreated }: PostFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moderationResult, setModerationResult] = useState<ModerationResult | null>(null);
  const [showModerationWarning, setShowModerationWarning] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // コンテンツモデレーション実行
      const moderation = await contentModerationService.moderateContent(content.trim());
      setModerationResult(moderation);
      
      if (!moderation.isAppropriate) {
        setShowModerationWarning(true);
        setIsSubmitting(false);
        return;
      }
      
      const randomAnimal = animalNames[Math.floor(Math.random() * animalNames.length)];
      
      await client.models.Post.create({
        content: content.trim(),
        author: randomAnimal,
        reactions: 0
      });
      
      setContent('');
      setModerationResult(null);
      setShowModerationWarning(false);
      // Notify parent component to refresh posts
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIgnoreWarning = async () => {
    setIsSubmitting(true);
    try {
      const randomAnimal = animalNames[Math.floor(Math.random() * animalNames.length)];
      
      await client.models.Post.create({
        content: content.trim(),
        author: randomAnimal,
        reactions: 0
      });
      
      setContent('');
      setModerationResult(null);
      setShowModerationWarning(false);
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditContent = () => {
    if (moderationResult?.suggestedEdit) {
      setContent(moderationResult.suggestedEdit);
    }
    setShowModerationWarning(false);
    setModerationResult(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
      {/* モデレーション警告UI */}
      {showModerationWarning && moderationResult && (
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                投稿内容の確認が必要です
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>{moderationResult.reason}</p>
                {moderationResult.suggestedEdit && (
                  <p className="mt-2">
                    <strong>修正提案:</strong> {moderationResult.suggestedEdit}
                  </p>
                )}
              </div>
              <div className="mt-4 flex space-x-3">
                {moderationResult.suggestedEdit && (
                  <button
                    type="button"
                    onClick={handleEditContent}
                    className="text-sm bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-700 transition-colors"
                  >
                    修正案を適用
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleIgnoreWarning}
                  disabled={isSubmitting}
                  className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? '投稿中...' : 'そのまま投稿'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModerationWarning(false);
                    setModerationResult(null);
                  }}
                  className="text-sm text-gray-600 dark:text-gray-400 px-3 py-1 rounded-md hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  内容を編集
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              // テキスト変更時は警告をクリア
              if (showModerationWarning) {
                setShowModerationWarning(false);
                setModerationResult(null);
              }
            }}
            placeholder="どんなやらかしを共有する？"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {content.length}/370文字
          </span>
          <button
            type="submit"
            disabled={!content.trim() || content.length > 370 || isSubmitting}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '確認中...' : 'ぶっちゃける'}
          </button>
        </div>
      </form>
    </div>
  );
}