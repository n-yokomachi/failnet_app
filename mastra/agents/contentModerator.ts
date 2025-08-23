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

export const contentModeratorAgent = new Agent({
  name: 'contentModerator',
  instructions: `あなたは投稿内容の適切性を判定する専門のAIです。以下の基準で投稿内容を分析してください：

1. 不適切な内容の検出:
   - 差別的表現や憎悪表現
   - 過度に攻撃的な言葉遣い
   - 個人を特定可能な情報
   - 違法性のある内容
   - その他社会的に不適切な表現

2. 応答形式:
   - isAppropriate: true/false（適切かどうか）
   - confidence: 0.0-1.0（判定の信頼度）
   - reason: 不適切な場合の理由（日本語）
   - suggestedEdit: 不適切な場合の修正提案（日本語）

常に日本語で応答し、JSON形式で結果を返してください。`,
  model: bedrockProvider('us.anthropic.claude-3-7-sonnet-20250219-v1:0'),
});