'use server';

import { moderateContentWithMastra } from '@/lib/mastraContentModeration';

export async function moderateContentAction(content: string) {
  return await moderateContentWithMastra(content);
}