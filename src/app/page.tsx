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
  reactionData?: string | null;
}

// Initial empty state
const initialPosts: Post[] = [];

const categories = [
  'すべて',
  '仕事・職場',
  '人間関係', 
  'お金・買い物',
  '健康・生活',
  '学習・スキル',
  '趣味・娯楽',
  '技術・IT',
  '日常生活',
  'その他'
] as const;

export default function Home() {
  const [posts, setPosts] = useState(initialPosts);
  const [sortBy, setSortBy] = useState<'newest' | 'reactions'>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('すべて');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextToken, setNextToken] = useState<string | null>(null);

  // Fetch posts from GraphQL API with sorting and pagination
  useEffect(() => {
    fetchInitialPosts();
  }, [sortBy, selectedCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchInitialPosts = async () => {
    try {
      setIsLoading(true);
      setPosts([]);
      setNextToken(null);
      setHasMore(true);

      // Fetch posts using GraphQL secondary index for sorting
      let response;
      if (sortBy === 'newest') {
        // Use secondary index to sort by createdAt (newest first)
        try {
          response = await client.models.Post.listPostByTypeAndCreatedAt(
            { type: 'post' },
            {
              limit: 20,
              sortDirection: 'DESC'
            }
          );
        } catch (error) {
          console.log('Secondary index method not available, using regular list with client-side sorting:', error);
          response = await client.models.Post.list({
            limit: 50
          });
        }
      } else {
        // For reactions, use regular list 
        response = await client.models.Post.list({
          limit: 20
        });
      }
      
      const { data } = response;
      let postsData = data;
      
      // Apply client-side sorting if using fallback regular list
      if (sortBy === 'newest' && postsData) {
        postsData = data?.sort((a, b) => 
          new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime()
        ).slice(0, 20);
      } else if (sortBy === 'reactions' && postsData) {
        postsData = data?.sort((a, b) => (b.reactions || 0) - (a.reactions || 0)).slice(0, 20);
      }

      if (postsData) {
        let filteredPosts = postsData;
        
        // Apply category filter
        if (selectedCategory !== 'すべて') {
          filteredPosts = postsData.filter(post => post.category === selectedCategory);
        }
        
        const formattedPosts = filteredPosts.map((post) => ({
          id: post.id,
          content: post.content,
          author: post.author,
          authorImage: post.authorImage,
          reactions: post.reactions || 0,
          category: post.category,
          reactionData:
            typeof post.reactionData === 'string'
              ? post.reactionData
              : post.reactionData != null
                ? JSON.stringify(post.reactionData)
                : null,
          createdAt: post.createdAt ?? '',
          displayDate: post.createdAt
            ? new Date(post.createdAt).toLocaleString('ja-JP', {
                year: 'numeric',
                month: 'numeric', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : ''
        }));
        setPosts(formattedPosts);
        setNextToken(response.nextToken || null);
        setHasMore(formattedPosts.length === 20 && !!response.nextToken);
      }
    } catch (error) {
      console.log('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (isLoadingMore || !hasMore || !nextToken) return;

    try {
      setIsLoadingMore(true);
      // Fetch more posts using GraphQL secondary index for sorting
      let response;
      if (sortBy === 'newest') {
        // Use secondary index to sort by createdAt (newest first)
        try {
          response = await client.models.Post.listPostByTypeAndCreatedAt(
            { type: 'post' },
            {
              limit: 20,
              nextToken,
              sortDirection: 'DESC'
            }
          );
        } catch (error) {
          console.log('Secondary index method not available for pagination, using regular list:', error);
          response = await client.models.Post.list({
            limit: 20,
            nextToken
          });
        }
      } else {
        // For reactions, use regular list with pagination
        response = await client.models.Post.list({
          limit: 20,
          nextToken
        });
      }
      
      const { data } = response;
      const newPostsData = data;

      if (newPostsData && newPostsData.length > 0) {
        let filteredNewPosts = newPostsData;
        
        // Apply category filter
        if (selectedCategory !== 'すべて') {
          filteredNewPosts = newPostsData.filter(post => post.category === selectedCategory);
        }
        
        const formattedNewPosts = filteredNewPosts.map((post) => ({
          id: post.id,
          content: post.content,
          author: post.author,
          authorImage: post.authorImage,
          reactions: post.reactions || 0,
          category: post.category,
          reactionData:
            typeof post.reactionData === 'string'
              ? post.reactionData
              : post.reactionData != null
                ? JSON.stringify(post.reactionData)
                : null,
          createdAt: post.createdAt ?? '',
          displayDate: post.createdAt
            ? new Date(post.createdAt).toLocaleString('ja-JP', {
                year: 'numeric',
                month: 'numeric', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : ''
        }));

        // Filter out duplicates
        setPosts(prevPosts => {
          const existingIds = new Set(prevPosts.map(post => post.id));
          const uniqueNewPosts = formattedNewPosts.filter(post => !existingIds.has(post.id));
          return [...prevPosts, ...uniqueNewPosts];
        });
        
        setNextToken(response.nextToken || null);
        setHasMore(!!response.nextToken);
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

  const handleReactionUpdate = async (postId: string) => {
    try {
      // Update only the specific post instead of refetching all posts
      const { data: updatedPost } = await client.models.Post.get({ id: postId });
      if (updatedPost) {
        setPosts(prevPosts => 
          prevPosts.map(post =>
            post.id === postId
              ? {
                  ...post,
                  reactions: updatedPost.reactions || 0,
                  reactionData:
                    typeof updatedPost.reactionData === 'string'
                      ? updatedPost.reactionData
                      : updatedPost.reactionData != null
                        ? JSON.stringify(updatedPost.reactionData)
                        : null
                }
              : post
          )
        );
      }
    } catch (error) {
      console.log('Error updating post:', error);
    }
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

      {/* Sort and Filter Options */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Sort Options */}
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
          
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">カテゴリ:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={isLoading}
              className={`px-3 py-1 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {isLoading ? (
          <LoadingSkeleton count={5} />
        ) : posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <PostItem key={post.id} post={post} onClick={() => handlePostClick(post)} onReactionUpdate={() => handleReactionUpdate(post.id)} />
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
          onReactionUpdate={() => handleReactionUpdate(selectedPost.id)}
        />
      )}
    </div>
  );
}
