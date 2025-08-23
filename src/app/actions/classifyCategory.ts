'use server';

import { classifyContent } from '@/lib/categoryClassification';

export async function classifyCategoryAction(content: string) {
  return await classifyContent(content);
}