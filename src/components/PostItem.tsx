interface Post {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

interface PostItemProps {
  post: Post;
}

export default function PostItem({ post }: PostItemProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600">
            {post.author.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-medium text-gray-900">{post.author}</h3>
            <span className="text-sm text-gray-500">{post.createdAt}</span>
          </div>
          <p className="text-gray-800 leading-relaxed">{post.content}</p>
        </div>
      </div>
    </div>
  );
}