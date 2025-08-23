
import { Mastra } from '@mastra/core';
import { contentModeratorAgent } from './agents/contentModerator';

export const mastra = new Mastra({
  agents: {
    contentModerator: contentModeratorAgent,
  },
});