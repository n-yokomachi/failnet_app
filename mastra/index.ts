
import { Mastra } from '@mastra/core';
import { contentModeratorAgent } from './agents/contentModerator';
import { categoryClassifierAgent } from './agents/categoryClassifier';

export const mastra = new Mastra({
  agents: {
    contentModerator: contentModeratorAgent,
    categoryClassifier: categoryClassifierAgent,
  },
});