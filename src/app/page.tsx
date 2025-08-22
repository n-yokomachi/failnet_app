'use client';

import { useState, useEffect } from 'react';
import PostForm from '@/components/PostForm';
import PostItem from '@/components/PostItem';
import PostDetailModal from '@/components/PostDetailModal';
import { LoadingSkeleton } from '@/components/LoadingSpinner';
import { client } from '@/lib/amplify';

interface Post {
  id: string;
  content: string;
  author: string;
  reactions: number;
  createdAt: string;
  displayDate: string;
}

// Initial empty state
const initialPosts: Post[] = [];

export default function Home() {
  const [posts, setPosts] = useState(initialPosts);
  const [sortBy, setSortBy] = useState<'newest' | 'reactions'>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextToken, setNextToken] = useState<string | null>(null);

  // Fetch posts from GraphQL API with sorting and pagination
  useEffect(() => {
    fetchInitialPosts();
  }, [sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchInitialPosts = async () => {
    try {
      setIsLoading(true);
      setPosts([]);
      setNextToken(null);
      setHasMore(true);

      // Fetch posts and sort client-side
      const { data } = await client.models.Post.list({
        limit: 20
      });
      
      let postsData;
      if (sortBy === 'newest') {
        // Sort by createdAt descending (newest first)
        postsData = data?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else {
        // Sort by reactions descending (highest first)
        postsData = data?.sort((a, b) => (b.reactions || 0) - (a.reactions || 0));
      }

      if (postsData) {
        const formattedPosts = postsData.map((post) => ({
          id: post.id,
          content: post.content,
          author: post.author,
          reactions: post.reactions || 0,
          createdAt: post.createdAt,
          displayDate: new Date(post.createdAt).toLocaleString('ja-JP', {
            year: 'numeric',
            month: 'numeric', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }));
        setPosts(formattedPosts);
        setHasMore(formattedPosts.length === 20);
      }
    } catch (error) {
      console.log('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      // Fetch more posts and sort client-side
      const { data } = await client.models.Post.list({
        limit: 20,
        nextToken
      });
      
      let newPostsData;
      if (sortBy === 'newest') {
        // Sort by createdAt descending (newest first)
        newPostsData = data?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else {
        // Sort by reactions descending (highest first)
        newPostsData = data?.sort((a, b) => (b.reactions || 0) - (a.reactions || 0));
      }

      if (newPostsData && newPostsData.length > 0) {
        const formattedNewPosts = newPostsData.map((post) => ({
          id: post.id,
          content: post.content,
          author: post.author,
          reactions: post.reactions || 0,
          createdAt: post.createdAt,
          displayDate: new Date(post.createdAt).toLocaleString('ja-JP', {
            year: 'numeric',
            month: 'numeric', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }));

        setPosts(prevPosts => [...prevPosts, ...formattedNewPosts]);
        setHasMore(newPostsData.length === 20);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log('Error loading more posts:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleNewPost = () => {
    // Refresh posts after new post is created
    fetchInitialPosts();
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
    window.history.pushState(null, '', `/${post.id}`);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    window.history.pushState(null, '', '/');
  };

  // Handle URL changes and modal state
  useEffect(() => {
    const postId = window.location.pathname.slice(1); // Remove leading slash
    if (postId && postId !== '' && posts.length > 0) {
      const post = posts.find(p => p.id === postId);
      if (post) {
        setSelectedPost(post);
        setIsModalOpen(true);
      }
    }
  }, [posts]);


  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Post Form */}
      <div className="mb-6">
        <PostForm onPostCreated={handleNewPost} />
      </div>

      {/* Sort Options */}
      <div className="mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('newest')}
            disabled={isLoading}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              sortBy === 'newest'
                ? 'bg-blue-600 dark:bg-blue-700 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            新着順
          </button>
          <button
            onClick={() => setSortBy('reactions')}
            disabled={isLoading}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              sortBy === 'reactions'
                ? 'bg-blue-600 dark:bg-blue-700 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            リアクション数順
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {isLoading ? (
          <LoadingSkeleton count={5} />
        ) : posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <PostItem key={post.id} post={post} onClick={() => handlePostClick(post)} />
            ))}
            
            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-6">
                <button
                  onClick={loadMorePosts}
                  disabled={isLoadingMore}
                  className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? 'ロード中...' : 'もっと読む'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              まだやらかし投稿がありません。最初の投稿をしてみましょう！
            </p>
          </div>
        )}
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
