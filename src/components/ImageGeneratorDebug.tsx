'use client';

import html2canvas from 'html2canvas';
import { useState } from 'react';

interface Post {
  id: string;
  content: string;
  author: string;
  authorImage?: string;
  createdAt: string;
  displayDate: string;
  reactions: number;
  category?: string;
  reactionData?: string | null;
}

interface ReactionData {
  [emoji: string]: number;
}

const testPost: Post = {
  id: 'test-123',
  content: 'これはテスト投稿です。画像生成のデバッグを行っています。',
  author: 'テストユーザー',
  authorImage: 'avatar1.jpg',
  createdAt: '2025-08-23T10:00:00Z',
  displayDate: '2025/8/23 19:00',
  reactions: 15,
  category: '技術・IT',
  reactionData: '{"😂": 5, "👍": 8, "❤️": 2}'
};

export default function ImageGeneratorDebug() {
  const [showPreview, setShowPreview] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const generateAndShowImage = async () => {
    try {
      let reactionData: ReactionData = {};
      if (testPost.reactionData) {
        try {
          reactionData = JSON.parse(testPost.reactionData);
        } catch (error) {
          console.error('Error parsing reaction data:', error);
        }
      }

      // Create a temporary container for the share image
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = '800px';
      container.style.padding = '40px';
      container.style.backgroundColor = '#ffffff';
      container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      
      // Create the share image content with explicit debugging
      container.innerHTML = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px; border-radius: 16px; color: white; min-height: 400px; display: flex; flex-direction: column;">
          <!-- Header -->
          <div style="display: flex; align-items: center; margin-bottom: 24px;">
            <div style="width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; overflow: hidden;">
              ${testPost.authorImage ? `
                <img src="/assets/images/${testPost.authorImage}" alt="${testPost.author}" style="width: 100%; height: 100%; object-fit: cover;" />
              ` : `
                <div style="width: 100%; height: 100%; background-color: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 24px; font-weight: 600;">${testPost.author.charAt(0).toUpperCase()}</span>
                </div>
              `}
            </div>
            <div>
              <div style="font-size: 20px; font-weight: 600; margin-bottom: 4px;">${testPost.author}</div>
              <div style="font-size: 14px; opacity: 0.8;">${testPost.displayDate}</div>
            </div>
          </div>

          <!-- Content -->
          <div style="margin-bottom: 16px;">
            <div style="font-size: 18px; line-height: 1.6; word-wrap: break-word;">${testPost.content}</div>
          </div>

          <!-- Spacer -->
          <div style="flex: 1;"></div>

          <!-- Footer -->
          <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <img src="/android-chrome-512x512.png" alt="Failnet" style="width: 24px; height: 24px;" />
              <span style="font-weight: 600; font-size: 16px;">Failnet</span>
            </div>
            <div style="font-size: 12px; opacity: 0.8;">
              ${testPost.id}
            </div>
          </div>
        </div>
      `;

      // Add to document temporarily
      document.body.appendChild(container);

      // Generate the image using html2canvas
      const canvas = await html2canvas(container, {
        width: 800,
        height: 600,
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
      });

      // Remove the temporary container
      document.body.removeChild(container);

      // Convert canvas to data URL for display
      const dataUrl = canvas.toDataURL('image/png');
      setGeneratedImageUrl(dataUrl);

    } catch (error) {
      console.error('Error generating share image:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">画像生成デバッグ</h1>
      
      <div className="mb-6">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2 bg-blue-600 text-white rounded mr-4"
        >
          {showPreview ? 'プレビューを隠す' : 'HTMLプレビューを表示'}
        </button>
        
        <button
          onClick={generateAndShowImage}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          画像を生成
        </button>
      </div>

      {showPreview && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">HTMLプレビュー（html2canvasで生成される前）</h2>
          <div style={{ width: '800px', padding: '40px', backgroundColor: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '32px', borderRadius: '16px', color: 'white', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px', overflow: 'hidden' }}>
                  {testPost.authorImage ? (
                    <img src={`/assets/images/${testPost.authorImage}`} alt={testPost.author} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '24px', fontWeight: '600' }}>{testPost.author.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>{testPost.author}</div>
                  <div style={{ fontSize: '14px', opacity: '0.8' }}>{testPost.displayDate}</div>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '18px', lineHeight: '1.6', wordWrap: 'break-word' }}>{testPost.content}</div>
              </div>


              <div style={{ flex: '1' }}></div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img src="/android-chrome-512x512.png" alt="Failnet" style={{ width: '24px', height: '24px' }} />
                  <span style={{ fontWeight: '600', fontSize: '16px' }}>Failnet</span>
                </div>
                <div style={{ fontSize: '12px', opacity: '0.8' }}>
                  {testPost.id}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {generatedImageUrl && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">生成された画像（html2canvas結果）</h2>
          <img src={generatedImageUrl} alt="Generated image" className="border border-gray-300" />
        </div>
      )}
    </div>
  );
}