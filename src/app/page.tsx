import PostForm from '@/components/PostForm';
import PostItem from '@/components/PostItem';

// Mock data
const mockPosts = [
  {
    id: '1',
    content: 'Just deployed my new Next.js application with Amplify Gen2! The developer experience is amazing.',
    author: 'Alice Johnson',
    createdAt: '2 hours ago'
  },
  {
    id: '2',
    content: 'Working on a new feature for our authentication system. TypeScript makes everything so much more reliable.',
    author: 'Bob Smith',
    createdAt: '4 hours ago'
  },
  {
    id: '3',
    content: 'The new header design looks great! Love the fixed positioning and clean icons.',
    author: 'Charlie Brown',
    createdAt: '6 hours ago'
  }
];

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Post Form */}
      <div className="mb-6">
        <PostForm />
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {mockPosts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
