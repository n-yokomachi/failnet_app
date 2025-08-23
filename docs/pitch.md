---
marp: true
theme: default
paginate: true
backgroundColor: #f8fafc
color: #1e293b
style: |
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap');
  section {
    font-size: 18px;
    font-family: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Hiragino Kaku Gothic ProN', sans-serif;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    padding: 40px;
  }
  h1 {
    font-size: 42px;
    color: #0f172a;
    border-left: 6px solid #3b82f6;
    padding-left: 20px;
    margin-bottom: 30px;
    font-weight: 700;
  }
  h2 {
    font-size: 28px;
    color: #334155;
    margin-bottom: 20px;
    font-weight: 600;
  }
  table {
    font-size: 18px;
    border-collapse: collapse;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
  }
  th {
    background: #3b82f6;
    color: white;
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
  }
  td {
    background: white;
    padding: 12px 16px;
    border-bottom: 1px solid #e2e8f0;
  }
  ul {
    line-height: 1.8;
  }
  li {
    margin-bottom: 8px;
  }
  strong {
    color: #1e40af;
  }
  .highlight-box {
    background: white;
    border-left: 4px solid #10b981;
    padding: 20px;
    margin: 20px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border-radius: 0 8px 8px 0;
  }
---

<div style="margin:0; display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 32px;">
  <div style="max-width: 640px;">
    <div style="background: linear-gradient(135deg, #3b82f6, #1e40af); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; font-size: 72px; font-weight: 900; font-family: 'Noto Sans JP', sans-serif; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; letter-spacing: -1px;">
      FailNet
    </div>
    <div style="background: linear-gradient(45deg, #e99191ff, #e99191ff); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; font-size: 32px; font-weight: 600; margin-bottom: 40px;">
      やらかし体験談を共有するプラットフォーム
    </div>
    <div style="font-size: 18px; color: #64748b; margin-bottom: 0;">
      <strong>横町 直樹</strong> / Naoki Yokomachi<br>
      趣味：ガジェットの情報収集、ゲーム、映画鑑賞<br>
      AI歴：2023年のBedrock GAから趣味オンリーで勉強会やアウトプットを継続中
    </div>
  </div>
  <div style="max-width: 520px; display: flex; align-items: flex-end; justify-content: flex-end;">
    <img src="pitch_images/app.png" alt="FailNet App" style="margin: 0 0 0 auto; max-width: 100%; border-radius: 16px; box-shadow: 0 4px 16px rgba(59,130,246,0.12);" />
  </div>
</div>

---

## 現状の課題
まだ社歴が浅いので以前の組織を例にして
- **事業部間の情報共有不足** - 似たような失敗が各部署で繰り返される
- **やらかしの孤独感・孤立感** - 失敗を一人で抱え込む
- **ミスをミスのままにしない** - 学びとして組織に蓄積する仕組みが不足

<div class="highlight-box">

## 解決策：やらかし共有プラットフォーム
# FailNet
失敗体験談を匿名で共有し、組織全体の学びに変えるコミュニケーションプラットフォーム

</div>

---

# 機能とAI活用

## 主要機能
- **匿名投稿機能** - ユーザー登録不要、心理的安全性を確保
- **3つの共有方法** - URL、画像コピー、Slack連携で簡単共有
- **カテゴリ別表示・絞り込み** - 投稿日時順・リアクション数順ソート

<div class="highlight-box">

## AI活用の独自性
- 一般的なエージェント → 単発タスク処理（ChatGPT等で十分）
- **FailNetのAI** → 継続的運用サポート、モデレータ
  - **センシティブ情報の自動検出** - 匿名性・プライバシーを守るセーフティネット
  - **投稿の自動カテゴリ分類** - ユーザーの負担軽減


**設計思想**: ユーザーが直接AIを使うのではなく、ユーザーと運営の橋渡し

</div>

---

# 技術スタックと開発ツール

## プロダクト技術スタック
| 分野 | 技術 |
|------|------|
| フロントエンド・バックエンド | Next.js / TypeScript, AWS Amplify, Tailwind CSS |
| AI・エージェント | Mastra, Amazon Bedrock, Claude 3.7 Sonnet |

## 開発に使用したAIツール
| 用途 | ツール |
|------|------|
| コーディング | Claude Code(Claude Sonnet 4), GitHub Copilot(GPT-5)|
| 検索・テスト・分析 | Gemini CLI, Playwright MCP, Serena MCP |
| エレベーターピッチ資料作成 | Claude Code, Marp |
| 動画作成 | Kite |

---

# まとめ

<div class="highlight-box">

**FailNet**は単なる失敗共有ツールではなく、組織の学習文化を変革するプラットフォーム

- 匿名性による心理的安全性の確保
- AIによる自動的な運用品質向上  
- 事業部横断のコミュニケーション促進

**失敗を恐れず、学びに変える文化を**

</div>
