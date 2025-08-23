'use server';

import { client } from '@/lib/amplify';

export interface ReactionData {
  [emoji: string]: number;
}

export async function addReactionAction(postId: string, emoji: string) {
  console.log('🚀 addReactionAction called with:', { postId, emoji });
  
  try {
    // Get the current post
    console.log('📖 Fetching post from database...');
    const result = await client.models.Post.get({ id: postId });
    console.log('📄 Raw result from database:', result);
    const { data: post } = result;
    
    if (!post) {
      throw new Error('Post not found');
    }

    console.log('📄 Current post data:', { 
      id: post.id, 
      reactions: post.reactions, 
      reactionData: post.reactionData 
    });

    // Parse existing reaction data
    let reactionData: ReactionData = {};
    if (post.reactionData) {
      try {
        reactionData = JSON.parse(post.reactionData as string);
        console.log('✅ Parsed existing reaction data:', reactionData);
      } catch (error) {
        console.log('❌ Error parsing reaction data:', error);
        reactionData = {};
      }
    } else {
      console.log('🆕 No existing reaction data found');
    }

    // Add or increment the reaction
    reactionData[emoji] = (reactionData[emoji] || 0) + 1;
    console.log('➕ Updated reaction data:', reactionData);

    // Calculate total reactions
    const totalReactions = Object.values(reactionData).reduce((sum, count) => sum + count, 0);
    console.log('🔢 Total reactions:', totalReactions);

    // Update the post
    console.log('💾 Updating post in database...');
    const updateResult = await client.models.Post.update({
      id: postId,
      reactions: totalReactions,
      reactionData: JSON.stringify(reactionData),
    });
    
    console.log('✅ Post update result:', updateResult);

    return { success: true, reactionData, totalReactions };
  } catch (error) {
    console.error('💥 Error adding reaction:', error);
    return { success: false, error: 'Failed to add reaction' };
  }
}

export async function removeReactionAction(postId: string, emoji: string) {
  try {
    // Get the current post
    const { data: post } = await client.models.Post.get({ id: postId });
    
    if (!post) {
      throw new Error('Post not found');
    }

    // Parse existing reaction data
    let reactionData: ReactionData = {};
    if (post.reactionData) {
      try {
        reactionData = JSON.parse(post.reactionData as string);
      } catch (error) {
        console.log('Error parsing reaction data:', error);
        reactionData = {};
      }
    }

    // Remove or decrement the reaction
    if (reactionData[emoji] && reactionData[emoji] > 1) {
      reactionData[emoji] -= 1;
    } else {
      delete reactionData[emoji];
    }

    // Calculate total reactions
    const totalReactions = Object.values(reactionData).reduce((sum, count) => sum + count, 0);

    // Update the post
    await client.models.Post.update({
      id: postId,
      reactions: totalReactions,
      reactionData: JSON.stringify(reactionData),
    });

    return { success: true, reactionData, totalReactions };
  } catch (error) {
    console.error('Error removing reaction:', error);
    return { success: false, error: 'Failed to remove reaction' };
  }
}