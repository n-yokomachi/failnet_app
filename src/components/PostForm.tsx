'use client';

import { useState } from 'react';
import { client } from '@/lib/amplify';

const animalNames = ['ハリネズミ', 'フクロウ', 'コアラ', 'ペンギン', 'キツネ', 'リス', 'パンダ', 'ウサギ'];

interface PostFormProps {
  onPostCreated: () => void;
}

export default function PostForm({ onPostCreated }: PostFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const randomAnimal = animalNames[Math.floor(Math.random() * animalNames.length)];
      
      await client.models.Post.create({
        content: content.trim(),
        author: randomAnimal,
        reactions: 0
      });
      
      setContent('');
      // Notify parent component to refresh posts
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="どんなやらかしを共有する？"
            className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {content.length}/370文字
          </span>
          <button
            type="submit"
            disabled={!content.trim() || content.length > 370 || isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '投稿中...' : 'ぶっちゃける'}
          </button>
        </div>
      </form>
    </div>
  );
}