import { client } from '@/lib/amplify';
import { classifyCategoryAction } from '@/app/actions/classifyCategory';
import { getRandomUserInfo } from '@/lib/userUtils';

export async function createPostWithCategory(content: string): Promise<void> {
  // 投稿直前にカテゴリ自動分類実行
  const category = await classifyCategoryAction(content.trim());
  
  // ランダムなユーザー情報を取得
  const userInfo = getRandomUserInfo();
  
  await client.models.Post.create({
    content: content.trim(),
    author: userInfo.name,
    authorImage: userInfo.image,
    reactions: 0,
    category: category
  });
}