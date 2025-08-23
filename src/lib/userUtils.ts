import { AVATAR_OPTIONS } from '../constants';

export interface RandomUserInfo {
  name: string;
  image: string;
}

/**
 * AVATAR_OPTIONSからランダムにユーザー情報を選択する
 */
export function getRandomUserInfo(): RandomUserInfo {
  const randomIndex = Math.floor(Math.random() * AVATAR_OPTIONS.length);
  const selectedAvatar = AVATAR_OPTIONS[randomIndex];
  
  return {
    name: selectedAvatar.name,
    image: selectedAvatar.image
  };
}

/**
 * 投稿IDに基づいて一貫したユーザー情報を生成する（同じIDなら常に同じユーザー情報）
 */
export function getUserInfoFromPostId(postId: string): RandomUserInfo {
  // 投稿IDをハッシュ化して数値に変換
  let hash = 0;
  for (let i = 0; i < postId.length; i++) {
    const char = postId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit整数に変換
  }
  
  // 絶対値を取ってアバター数で割った余りを使用
  const index = Math.abs(hash) % AVATAR_OPTIONS.length;
  const selectedAvatar = AVATAR_OPTIONS[index];
  
  return {
    name: selectedAvatar.name,
    image: selectedAvatar.image
  };
}