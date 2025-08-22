import { useState } from 'react';

interface Post {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  displayDate: string;
  reactions: number;
}

interface PostItemProps {
  post: Post;
  onClick?: () => void;
}

export default function PostItem({ post, onClick }: PostItemProps) {
  const [showCopiedTip, setShowCopiedTip] = useState(false);

  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    const url = `${window.location.origin}/${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setShowCopiedTip(true);
      setTimeout(() => setShowCopiedTip(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopiedTip(true);
      setTimeout(() => setShowCopiedTip(false), 2000);
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {post.author.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{post.author}</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">{post.displayDate}</span>
          </div>
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{post.content}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">😅 {post.reactions} リアクション</span>
            <div className="relative">
              <button
                onClick={handleShareClick}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                aria-label="URLを共有"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
              {showCopiedTip && (
                <div className="absolute -top-10 right-0 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                  URL Copied!
                  <div className="absolute top-full right-2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}