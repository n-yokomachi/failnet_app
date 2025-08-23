'use client';

import { useState, useEffect, use } from 'react';
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

interface PostDetailPageProps {
  params: Promise<{
    postId: string;
  }>;
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { postId } = use(params);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'reactions'>('newest');

  // Fetch posts and find the specific post
  useEffect(() => {
    const fetchPostsAndShowModal = async () => {
      try {
        setIsLoading(true);
        const { data: postsData } = await client.models.Post.list({});
        if (postsData) {
          const formattedPosts = postsData.map((post) => ({
            id: post.id,
            content: post.content,
            author: post.author,
            authorImage: post.authorImage,
            reactions: post.reactions || 0,
            createdAt: post.createdAt ?? '',
            displayDate:
              post.createdAt && typeof post.createdAt === 'string'
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
          
          // Find and show the specific post
          const targetPost = formattedPosts.find(post => post.id === postId);
          if (targetPost) {
            setSelectedPost(targetPost);
            setIsModalOpen(true);
          }
        }
      } catch (error) {
        console.log('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostsAndShowModal();
  }, [postId]);

  const handleNewPost = () => {
    fetchPosts();
  };

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data: postsData } = await client.models.Post.list({});
      if (postsData) {
        const formattedPosts = postsData.map((post) => ({
          id: post.id,
          content: post.content,
          author: post.author,
          authorImage: post.authorImage,
          reactions: post.reactions || 0,
          createdAt: post.createdAt ?? '',
          displayDate:
            post.createdAt && typeof post.createdAt === 'string'
              ? new Date(post.createdAt).toLocaleString('ja-JP', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) + '前'
              : ''
        }));
        setPosts(formattedPosts);
      }
    } catch (error) {
      console.log('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
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

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'reactions') {
      return b.reactions - a.reactions;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              sortBy === 'newest'
                ? 'bg-blue-600 dark:bg-blue-700 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            新着順
          </button>
          <button
            onClick={() => setSortBy('reactions')}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              sortBy === 'reactions'
                ? 'bg-blue-600 dark:bg-blue-700 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            リアクション数順
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {isLoading ? (
          <LoadingSkeleton count={5} />
        ) : sortedPosts.length > 0 ? (
          sortedPosts.map((post) => (
            <PostItem key={post.id} post={post} onClick={() => handlePostClick(post)} />
          ))
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