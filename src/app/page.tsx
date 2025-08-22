'use client';

import { useState, useEffect } from 'react';
import PostForm from '@/components/PostForm';
import PostItem from '@/components/PostItem';
import { client } from '@/lib/amplify';

// Initial empty state
const initialPosts: any[] = [];

export default function Home() {
  const [posts, setPosts] = useState(initialPosts);
  const [sortBy, setSortBy] = useState<'newest' | 'reactions'>('newest');

  // Fetch posts from GraphQL API
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data: postsData } = await client.models.Post.list();
      if (postsData) {
        const formattedPosts = postsData.map((post: any) => ({
          id: post.id,
          content: post.content,
          author: post.author,
          reactions: post.reactions || 0,
          createdAt: post.createdAt, // Keep original date for sorting
          displayDate: new Date(post.createdAt).toLocaleString('ja-JP', {
            year: 'numeric',
            month: 'numeric', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) + '前'
        }));
        setPosts(formattedPosts);
      }
    } catch (error) {
      console.log('Error fetching posts:', error);
    }
  };

  const handleNewPost = () => {
    // Refresh posts after new post is created
    fetchPosts();
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'reactions') {
      return b.reactions - a.reactions;
    }
    // Default to newest (sort by creation date)
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
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            新着順
          </button>
          <button
            onClick={() => setSortBy('reactions')}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              sortBy === 'reactions'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            リアクション数順
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {sortedPosts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
