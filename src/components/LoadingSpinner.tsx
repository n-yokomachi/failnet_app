export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Spinner Animation */}
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
        </div>
      </div>
      
      {/* Loading Text */}
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 animate-pulse">
        やらかし投稿を読み込み中...
      </p>
    </div>
  );
}

interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton({ count = 3 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm animate-pulse"
        >
          <div className="flex items-start space-x-3">
            {/* Avatar skeleton */}
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            
            <div className="flex-1">
              {/* Header skeleton */}
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
              </div>
              
              {/* Content skeleton */}
              <div className="space-y-2 mb-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              </div>
              
              {/* Reactions skeleton */}
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-28"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}