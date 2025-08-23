import { mastra } from '../../mastra';

export interface ModerationResult {
  isAppropriate: boolean;
  confidence: number;
  reason?: string;
  suggestedEdit?: string;
}

export async function moderateContentWithMastra(content: string): Promise<ModerationResult> {
  try {
    const agent = mastra.getAgent('contentModerator');
    
    const prompt = `以下の投稿内容を分析してください:

投稿内容: "${content}"

以下のJSON形式で回答してください:
{
  "isAppropriate": boolean,
  "confidence": number,
  "reason": "string (不適切な場合のみ)",
  "suggestedEdit": "string (不適切な場合のみ)"
}`;

    const result = await agent.generateVNext(prompt);
    
    // JSONレスポンスをパース
    let parsedResult: ModerationResult;
    try {
      // レスポンスからJSON部分を抽出
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('JSON format not found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Mastra response:', parseError);
      // フォールバック: 安全を重視して不適切として扱う
      parsedResult = {
        isAppropriate: false,
        confidence: 0.5,
        reason: 'レスポンスの解析に失敗しました。安全のため確認が必要です。',
        suggestedEdit: 'より適切な表現に修正してください。'
      };
    }
    
    return parsedResult;
  } catch (error) {
    console.error('Mastra content moderation error:', error);
    
    // エラー時のフォールバック
    return {
      isAppropriate: false,
      confidence: 0.0,
      reason: 'コンテンツモデレーションサービスでエラーが発生しました。',
      suggestedEdit: '内容を確認して再度投稿してください。'
    };
  }
}