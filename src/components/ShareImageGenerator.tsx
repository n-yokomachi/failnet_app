'use client';

import html2canvas from 'html2canvas';

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

export const generateShareImage = async (post: Post): Promise<boolean> => {
  try {
    // Create a temporary container for the share image
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '800px';
    container.style.padding = '40px';
    container.style.backgroundColor = '#ffffff';
    container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    
    // Parse reaction data
    let reactionData: ReactionData = {};
    if (post.reactionData) {
      try {
        reactionData = JSON.parse(post.reactionData);
      } catch (error) {
        console.error('Error parsing reaction data:', error);
      }
    }

    // Create the share image content
    container.innerHTML = `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px; border-radius: 16px; color: white; min-height: 400px; display: flex; flex-direction: column;">
        <!-- Header -->
        <div style="display: flex; align-items: center; margin-bottom: 24px;">
          <div style="width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; overflow: hidden;">
            ${post.authorImage ? `
              <img src="/assets/images/${post.authorImage}" alt="${post.author}" style="width: 100%; height: 100%; object-fit: cover;" />
            ` : `
              <div style="width: 100%; height: 100%; background-color: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 24px; font-weight: 600;">${post.author.charAt(0).toUpperCase()}</span>
              </div>
            `}
          </div>
          <div>
            <div style="font-size: 20px; font-weight: 600; margin-bottom: 4px;">${post.author}</div>
            <div style="font-size: 14px; opacity: 0.8;">${post.displayDate}</div>
          </div>
        </div>

        <!-- Content -->
        <div style="margin-bottom: 16px;">
          <div style="font-size: 18px; line-height: 1.6; word-wrap: break-word;">${post.content}</div>
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
            ${post.id}
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

    // Convert canvas to blob
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(false);
          return;
        }

        try {
          // Copy to clipboard
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob
            })
          ]);
          resolve(true);
        } catch (error) {
          console.error('Failed to copy image to clipboard:', error);
          
          // Fallback: Create download link
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `failnet-post-${post.id}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          resolve(true); // Still consider it successful since download worked
        }
      }, 'image/png');
    });

  } catch (error) {
    console.error('Error generating share image:', error);
    return false;
  }
};

export default generateShareImage;