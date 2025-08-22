import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';

export interface ModerationResult {
  isAppropriate: boolean;
  confidence: number;
  reason?: string;
  suggestedEdit?: string;
}

class ContentModerationService {
  private client: BedrockRuntimeClient;
  private modelId = 'anthropic.claude-3-haiku-20240307-v1:0';

  constructor() {
    this.client = new BedrockRuntimeClient({
      region: 'us-west-2', // Bedrockが利用可能なリージョン
    });
  }

  async moderateContent(content: string): Promise<ModerationResult> {
    // デモ用：特定のキーワードでモックレスポンスを返す
    if (content.includes('バカ') || content.includes('最悪') || content.includes('死ね') || content.includes('くそ')) {
      return {
        isAppropriate: false,
        confidence: 0.8,
        reason: '攻撃的または不適切な表現が含まれている可能性があります',
        suggestedEdit: content.replace(/バカ/g, '困った').replace(/最悪/g, 'つらい').replace(/死ね/g, '').replace(/くそ/g, 'とても')
      };
    }
    const prompt = `以下の投稿内容を分析し、不適切な内容が含まれていないかチェックしてください。

投稿内容: "${content}"

以下の基準で判定してください：
- 差別的な発言や誹謗中傷
- 個人情報の露出
- 暴力的な内容
- 過度に攻撃的な言葉遣い
- その他社会通念上不適切とされる内容

結果をJSON形式で返してください：
{
  "isAppropriate": true/false,
  "confidence": 0.0-1.0の数値,
  "reason": "不適切と判断した理由（適切な場合は空文字）",
  "suggestedEdit": "修正提案（不適切な場合のみ）"
}`;

    try {
      const command = new ConverseCommand({
        modelId: this.modelId,
        messages: [
          {
            role: 'user',
            content: [
              {
                text: prompt
              }
            ]
          }
        ],
        inferenceConfig: {
          maxTokens: 1000,
          temperature: 0.1,
          topP: 0.9
        }
      });

      const response = await this.client.send(command);
      
      if (!response.output?.message?.content?.[0]?.text) {
        throw new Error('Invalid response from Bedrock');
      }

      const responseText = response.output.message.content[0].text;
      
      // JSONレスポンスをパース
      try {
        const result = JSON.parse(responseText) as ModerationResult;
        return result;
      } catch {
        // JSONパースに失敗した場合のフォールバック
        console.warn('Failed to parse moderation response as JSON:', responseText);
        return {
          isAppropriate: true,
          confidence: 0.5,
          reason: 'モデレーション結果の解析に失敗しました'
        };
      }
    } catch (error) {
      console.error('Content moderation error:', error);
      // エラー時は安全側に倒して適切とみなす（投稿を阻害しない）
      return {
        isAppropriate: true,
        confidence: 0.0,
        reason: 'モデレーション処理でエラーが発生しました'
      };
    }
  }
}

export const contentModerationService = new ContentModerationService();