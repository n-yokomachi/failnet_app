import { mastra } from '../../mastra';

export const AVAILABLE_CATEGORIES = [
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

export type Category = typeof AVAILABLE_CATEGORIES[number];

export async function classifyContent(content: string): Promise<Category> {
  try {
    const agent = mastra.getAgent('categoryClassifier');
    
    const prompt = `以下の投稿内容を分析して、最適なカテゴリを選択してください:

投稿内容: "${content}"

カテゴリ名のみを返してください。`;

    const result = await agent.generateVNext(prompt);
    
    // レスポンスからカテゴリ名を抽出
    const responseText = result.text.trim();
    
    // 利用可能なカテゴリから一致するものを検索
    const matchedCategory = AVAILABLE_CATEGORIES.find(category => 
      responseText.includes(category)
    );
    
    return matchedCategory || 'その他';
  } catch (error) {
    console.error('Category classification error:', error);
    
    // エラー時のフォールバック
    return 'その他';
  }
}