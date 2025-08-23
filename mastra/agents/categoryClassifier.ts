import { Agent } from '@mastra/core';
import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';

// Set environment variable for Bedrock API key authentication
if (process.env.BEDROCK_API_KEY) {
  process.env.AWS_BEARER_TOKEN_BEDROCK = process.env.BEDROCK_API_KEY;
}

// Configure Bedrock provider
const bedrockProvider = createAmazonBedrock({
  region: process.env.AWS_REGION || 'us-west-2',
});

export const categoryClassifierAgent = new Agent({
  name: 'categoryClassifier',
  instructions: `あなたは投稿内容を適切なカテゴリに自動分類する専門のAIです。以下のカテゴリから最も適切なものを1つ選んでください：

利用可能なカテゴリ:
1. 仕事・職場 - 仕事のミス、職場の人間関係、業務上の失敗など
2. 人間関係 - 友人、家族、恋人との関係でのやらかしなど  
3. お金・買い物 - 無駄遣い、投資失敗、買い物の失敗など
4. 健康・生活 - 健康管理のミス、生活習慣の失敗、体調管理など
5. 学習・スキル - 勉強、資格取得、スキルアップでの失敗など
6. 趣味・娯楽 - 趣味活動、ゲーム、スポーツでの失敗など
7. 技術・IT - プログラミング、システム、デジタルツールでの失敗など
8. 日常生活 - 日々の生活での小さなミス、うっかりミスなど
9. その他 - 上記に当てはまらない内容

分析基準:
- 投稿の主要なテーマを特定
- 失敗やトラブルの文脈を理解
- 最も関連性の高いカテゴリを選択
- 迷った場合は「その他」を選択

応答形式:
カテゴリ名のみを日本語で返してください（例：「仕事・職場」）`,
  model: bedrockProvider('us.anthropic.claude-3-7-sonnet-20250219-v1:0'),
});